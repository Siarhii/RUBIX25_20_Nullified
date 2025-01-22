require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const { createCipheriv, randomBytes, createHash } = require('crypto');
const ensureDirectoryExists = require("../helper/fileExists.helper.js")

const cloudinary = require('../config/cloudinary.config.js');
const upload = require("../config/multer.config.js")
const router = express.Router();

const PORT = process.env.PORT
const backendURL = process.env.BACKEND_URL

const UPLOAD_DIR = path.join(__dirname, '../uploads');
const ZIPS_DIR = path.join(__dirname, '../zips');
ensureDirectoryExists(UPLOAD_DIR);
ensureDirectoryExists(ZIPS_DIR);

function encryptFile(filePath, password, outputDir) {
    return new Promise((resolve, reject) => {
        const key = createHash('sha256').update(password).digest(); // 32 bytes hash
        const iv = randomBytes(16);
        const cipher = createCipheriv('aes-256-cbc', key, iv);

        const encryptedFileName = `${path.basename(filePath)}.enc`;
        const encryptedFilePath = path.join(outputDir, encryptedFileName);

        const input = fs.createReadStream(filePath);
        const output = fs.createWriteStream(encryptedFilePath);

        // Write IV first
        output.write(iv);

        input.pipe(cipher).pipe(output);

        output.on('finish', () => {
            resolve(encryptedFilePath);
        });

        output.on('error', reject);
    });
}

router.post('/uploadAndDelete', upload.array('files'), async (req, res) => {
    const { password } = req.body;
    const uploadedFiles = req.files;

    if (!password) {
        return res.status(400).json({ message: 'Password is required' });
    }

    if (!uploadedFiles || uploadedFiles.length === 0) {
        return res.status(400).json({ message: 'No files uploaded' });
    }

    try {
        // Generate the zip file in the upload directory
        const zipFileName = path.join(UPLOAD_DIR, `${Date.now()}_encrypted.zip`);
        const output = fs.createWriteStream(zipFileName);
        const archive = archiver('zip', { zlib: { level: 9 } });

        archive.pipe(output);

        // Append uploaded files to the archive
        for (const file of uploadedFiles) {
            const filePath = path.resolve(file.path);
            archive.append(fs.createReadStream(filePath), { name: file.originalname });
        }

        await archive.finalize();

        // Pass the zips directory path to the encryptFile function
        const encryptedZipFilePath = await encryptFile(zipFileName, password, ZIPS_DIR);

        // Clean up uploaded files from the 'uploads' directory
        uploadedFiles.forEach(file => fs.unlinkSync(file.path));

        // Return the download link to the encrypted file in the zips directory
        res.status(200).json({
            message: 'Files uploaded, encrypted, and saved successfully',
            downloadLink: `${backendURL}${PORT}/zips/${path.basename(encryptedZipFilePath)}`,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating encrypted ZIP file' });
    }
});

router.post('/uploadAndSave', upload.array('files'), async (req, res) => {
    const { password } = req.body;
    const uploadedFiles = req.files;

    if (!password) {
        return res.status(400).json({ message: 'Password is required' });
    }

    if (!uploadedFiles || uploadedFiles.length === 0) {
        return res.status(400).json({ message: 'No files uploaded' });
    }

    try {
        const zipFileName = path.join(UPLOAD_DIR, `${Date.now()}_encrypted.zip`);
        const output = fs.createWriteStream(zipFileName);
        const archive = archiver('zip', { zlib: { level: 9 } });

        archive.pipe(output);

        for (const file of uploadedFiles) {
            const filePath = path.resolve(file.path);
            archive.append(fs.createReadStream(filePath), { name: file.originalname });
        }

        await archive.finalize();

        const encryptedZipFilePath = await encryptFile(zipFileName, password, ZIPS_DIR);

        uploadedFiles.forEach(file => fs.unlinkSync(file.path));

        const fileNameWithoutExtension = path.basename(encryptedZipFilePath, path.extname(encryptedZipFilePath));
        const cloudinaryResult = await cloudinary.uploader.upload(encryptedZipFilePath, {
            resource_type: 'auto', // Let Cloudinary automatically detect file type (zip)
            public_id: fileNameWithoutExtension
        });

        fs.unlinkSync(encryptedZipFilePath);

        res.status(200).json({
            message: 'Files uploaded, encrypted, and uploaded to Cloudinary successfully.',
            downloadLink: cloudinaryResult.secure_url,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating encrypted ZIP file or uploading to Cloudinary' });
    }
});



module.exports = router;