const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const File = require("../models/file.model.js"); // Import the File model
const authMiddleware = require("../middleware/auth.middleware.js"); // Import the authentication middleware

router.get("/downloadfile/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;
    const userEmail = req.user.email; // Authenticated user's email

    try {
        // Find the file in the database
        const file = await File.findById(id);
        if (!file) {
            return res.status(404).json({ message: "File not found" });
        }

        // Check file visibility and permissions
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
        const zipFilePath = path.join(__dirname, "..", "zips", `${file.fileName}`); // Append .enc to the filename

        // Check if the ZIP file exists
        console.log("not found : ", zipFilePath, file)
        if (!fs.existsSync(zipFilePath)) {
            return res.status(404).json({ message: "ZIP file not found on the server" });
        }

        // Set the response headers for the download
        res.download(zipFilePath, `${file.originalName}.enc`, (err) => {
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