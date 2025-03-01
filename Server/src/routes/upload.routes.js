require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const archiver = require('archiver');
const mongoose = require("mongoose")
const ensureDirectoryExists = require("../helper/fileExists.helper.js")

const File = require("../models/file.model.js")

const cloudinary = require('../config/cloudinary.config.js');
const upload = require("../config/multer.config.js")
const authMiddleware = require("../middleware/auth.middleware.js")

const router = express.Router();

const PORT = process.env.PORT
const backendURL = process.env.BACKEND_URL

const UPLOAD_DIR = path.join(__dirname, '../uploads');
const ZIPS_DIR = path.join(__dirname, '../zips');
ensureDirectoryExists(UPLOAD_DIR);
ensureDirectoryExists(ZIPS_DIR);

function encryptFile(filePath, password, outputDir, unlockTime) {
    return new Promise((resolve, reject) => {
        try {
            if (!(unlockTime instanceof Date) || isNaN(unlockTime.getTime())) {
                throw new Error('Invalid unlock time');
            }

            //32 bytes
            const key = crypto.createHash('sha256').update(password).digest();

            //16 byte
            const iv = crypto.randomBytes(16);

            const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);


            const encryptedFileName = `${path.basename(filePath)}.enc`;
            const encryptedFilePath = path.join(outputDir, encryptedFileName);

            const input = fs.createReadStream(filePath);
            const output = fs.createWriteStream(encryptedFilePath);

            //IV write at first
            output.write(iv);

            //piping the data buffer after iv
            input.pipe(cipher).pipe(output);

            output.on('finish', () => {
                // Append the unlock timestamp to the encrypted file
                const timestampBuffer = Buffer.alloc(8); // 8 bytes for a 64-bit timestamp
                const timestampInSeconds = Math.floor(unlockTime.getTime() / 1000);
                timestampBuffer.writeBigUInt64BE(BigInt(timestampInSeconds));
                fs.appendFileSync(encryptedFilePath, timestampBuffer);

                resolve(encryptedFilePath);
            });

            output.on('error', (err) => {
                reject(err);
            });
        } catch (err) {
            reject(err);
        }
    });
}

function decryptFile(filePath, password) {
    return new Promise((resolve, reject) => {
        try {
            const key = crypto.createHash('sha256').update(password).digest();
            const input = fs.createReadStream(filePath);

            // Read the IV from the beginning of the file
            const iv = Buffer.alloc(16);
            input.read(iv);

            const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

            const decryptedFileName = `${path.basename(filePath, '.enc')}_decrypted.zip`;
            const decryptedFilePath = path.join(path.dirname(filePath), decryptedFileName);
            const output = fs.createWriteStream(decryptedFilePath);

            // Read the unlock timestamp from the end of the file
            input.on('end', () => {
                const timestampBuffer = Buffer.alloc(8);
                fs.readSync(fs.openSync(filePath, 'r'), timestampBuffer, 0, 8, fs.statSync(filePath).size - 8);
                const unlockTime = new Date(Number(timestampBuffer.readBigUInt64BE()) * 1000);

                if (new Date() < unlockTime) {
                    reject(new Error('File is not yet available for decryption'));
                }
            });

            input.pipe(decipher).pipe(output);

            output.on('finish', () => {
                resolve(decryptedFilePath);
            });

            output.on('error', (err) => {
                reject(err);
            });
        } catch (err) {
            reject(err);
        }
    });
}

router.post('/uploadAndDelete', upload.array('files'), async (req, res) => {
    const { password, unlockTime } = req.body;
    const uploadedFiles = req.files;

    if (!password) {
        return res.status(400).json({ message: 'Password is required' });
    }

    if (!uploadedFiles || uploadedFiles.length === 0) {
        return res.status(400).json({ message: 'No files uploaded' });
    }

    const unlockTimeDate = new Date(unlockTime);
    if (isNaN(unlockTimeDate.getTime())) {
        return res.status(400).json({ message: 'Invalid unlock time' });
    }

    let zipFileName;
    try {
        // Generate the zip file in the upload directory
        zipFileName = path.join(UPLOAD_DIR, `${Date.now()}_encrypted.zip`);
        const output = fs.createWriteStream(zipFileName);
        const archive = archiver('zip', { zlib: { level: 9 } });

        archive.pipe(output);

        // Append uploaded files to the archive
        for (const file of uploadedFiles) {
            const filePath = path.resolve(file.path);
            archive.append(fs.createReadStream(filePath), { name: file.originalname });
        }

        await archive.finalize();

        const encryptedZipFilePath = await encryptFile(zipFileName, password, ZIPS_DIR, unlockTimeDate);

        uploadedFiles.forEach(file => fs.unlinkSync(file.path));

        fs.unlinkSync(zipFileName);

        res.status(200).json({
            message: 'Files uploaded, encrypted, and saved successfully',
            downloadLink: `${backendURL}:${PORT}/zips/${path.basename(encryptedZipFilePath)}`,
        });
    } catch (err) {
        console.error('Error during file processing:', err);

        if (zipFileName && fs.existsSync(zipFileName)) {
            fs.unlinkSync(zipFileName);
        }
        uploadedFiles.forEach(file => {
            if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
        });

        res.status(500).json({ message: 'Error processing files' });
    }
});

router.post("/uploadAndSave", authMiddleware, upload.array("files"), async (req, res) => {
    const { password, unlockTime, notificationEmail } = req.body;
    const uploadedFiles = req.files;

    if (!req.user?.userId) {
        return res.status(400).json({ message: "User ID is required" });
    }
    if (!mongoose.isValidObjectId(req.user.userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }
    const userId = req.user.userId

    if (!password) {
        return res.status(400).json({ message: "Password is required" });
    }

    if (!uploadedFiles || uploadedFiles.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
    }

    const unlockTimeDate = new Date(unlockTime);
    if (isNaN(unlockTimeDate.getTime())) {
        return res.status(400).json({ message: "Invalid unlock time" });
    }

    let zipFileName;
    try {
        // Generate the zip file in the upload directory
        zipFileName = path.join(UPLOAD_DIR, `${Date.now()}_encrypted.zip`);
        const output = fs.createWriteStream(zipFileName);
        const archive = archiver("zip", { zlib: { level: 9 } });

        archive.pipe(output);

        // Append uploaded files to the archive
        for (const file of uploadedFiles) {
            const filePath = path.resolve(file.path);
            archive.append(fs.createReadStream(filePath), { name: file.originalname });
        }

        await archive.finalize();

        const encryptedZipFilePath = await encryptFile(zipFileName, password, ZIPS_DIR, unlockTimeDate);

        const stats = fs.statSync(encryptedZipFilePath);
        const maxFileSize = 9 * 1024 * 1024;

        let storageLocation = "local";
        let cloudinaryUrl = "";

        if (stats.size < maxFileSize) {
            const cloudinaryResult = await cloudinary.uploader.upload(encryptedZipFilePath, {
                resource_type: "auto", // Automatically detect file type
                public_id: `capsule_${Date.now()}`, // Unique public ID
            });
            cloudinaryUrl = cloudinaryResult.secure_url;
            storageLocation = "cloudinary";
        }

        const fileMetadata = new File({
            userId,
            originalName: uploadedFiles.map((file) => file.originalname).join(", "),
            fileName: path.basename(encryptedZipFilePath),
            fileSize: stats.size,
            unlockDate: unlockTimeDate,
            storageLocation,
            cloudinaryUrl,
            visibility: "private",
            allowedUsers: [],
            notificationEmail: notificationEmail || null,
        });

        await fileMetadata.save();

        uploadedFiles.forEach((file) => fs.unlinkSync(file.path));
        fs.unlinkSync(zipFileName);

        res.status(200).json({
            message: "Files uploaded, encrypted, and saved successfully.",
            fileId: fileMetadata._id,
            downloadLink:
                storageLocation === "cloudinary"
                    ? cloudinaryUrl
                    : `${req.protocol}://${req.get("host")}/zips/${path.basename(encryptedZipFilePath)}`,
        });
    } catch (err) {
        console.log("Error during file processing:", err);

        // Clean up temporary files in case of error
        if (zipFileName && fs.existsSync(zipFileName)) {
            fs.unlinkSync(zipFileName);
        }
        uploadedFiles.forEach((file) => {
            if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
        });

        res.status(500).json({ message: "Error processing files" });
    }
});

router.post('/decrypt', upload.single('file'), async (req, res) => {
    const { password } = req.body;
    const uploadedFile = req.file;

    if (!password) {
        return res.status(400).json({ message: 'Password is required' });
    }

    if (!uploadedFile) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        const decryptedFilePath = await decryptFile(uploadedFile.path, password);
        res.download(decryptedFilePath, (err) => {
            if (err) {
                console.error('Error downloading file:', err);
                res.status(500).json({ message: 'Error downloading file' });
            }
            fs.unlinkSync(decryptedFilePath);
        });
    } catch (err) {
        console.error('Error during decryption:', err);
        res.status(500).json({ message: 'Error decrypting file' });
    } finally {
        fs.unlinkSync(uploadedFile.path);
    }
});

router.get("/downloadfile/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;
    const userEmail = req.user.email; // Authenticated user's email

    try {
        // Find the file
        const file = await File.findById(id);
        if (!file) {
            return res.status(404).json({ message: "File not found" });
        }

        // Check file visibility
        if (file.visibility === "private" && file.uploadedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You do not have permission to access this file" });
        }

        if (file.visibility === "custom") {
            // Check if the user is in the allowedUsers list
            const allowedUserEmails = file.allowedUsers.map((user) => user.email);
            if (!allowedUserEmails.includes(userEmail)) {
                return res.status(403).json({ message: "You do not have permission to access this file" });
            }
        }

        // If the file is public, custom (and user is allowed), or private (and user is the owner), proceed

        // Construct the path to the ZIP file
        const zipFilePath = path.join(__dirname, "..", "zips", file.filename);

        // Check if the ZIP file exists
        if (!fs.existsSync(zipFilePath)) {
            return res.status(404).json({ message: "ZIP file not found on the server" });
        }

        // Set the response headers for the download
        res.download(zipFilePath, file.originalName, (err) => {
            if (err) {
                console.error("Error downloading file:", err);
                res.status(500).json({ message: "Error downloading file", error: err.message });
            }
        });
    } catch (err) {
        console.error("Error downloading file:", err);
        res.status(500).json({ message: "Error downloading file", error: err.message });
    }
});


module.exports = router;