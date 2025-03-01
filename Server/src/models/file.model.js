const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the user who uploaded the file
        ref: "User", // Assuming you have a User model
        required: true,
    },
    originalName: {
        type: String, // Original names of the uploaded files (comma-separated)
        required: true,
    },
    fileName: {
        type: String, // Name of the encrypted file (e.g., "1737673616289_encrypted.zip.enc")
        required: true,
    },
    fileSize: {
        type: Number, // Size of the file in bytes
        required: true,
    },
    unlockDate: {
        type: Date, // Date when the file can be unlocked
        required: true,
    },
    storageLocation: {
        type: String, // Where the file is stored (e.g., "local" or "cloudinary")
        enum: ["local", "cloudinary"], // Restrict to these values
        required: true,
    },
    cloudinaryUrl: {
        type: String, // URL of the file if stored in Cloudinary
        default: null, // Optional, only used if storageLocation is "cloudinary"
    },
    visibility: {
        type: String, // Visibility of the file (e.g., "private" or "public")
        enum: ["private", "public", "custom"], // Restrict to these values
        default: "private", // Default to private
    },
    allowedUsers: [
        {
            type: mongoose.Schema.Types.ObjectId, // Array of user IDs who can access the file
            ref: "User", // Reference to the User model
        },
    ],
    notificationEmail: {
        type: String, // Email address to notify when the file is unlocked
        default: null, // Optional
    },
    createdAt: {
        type: Date, // Timestamp when the file was uploaded
        default: Date.now, // Automatically set to the current date and time
    },
});

// Create the File model
const File = mongoose.model("File", fileSchema);

module.exports = File;