const express = require("express");
const router = express.Router();
const File = require("../models/file.model.js");
const User = require("../models/User.model.js");
const authenticateToken = require("../middleware/auth.middleware.js");

// router.put("/file/:id/visibility", authenticateToken, async (req, res) => {
//     const { id } = req.params;
//     const { visibility, allowedUsers } = req.body;

//     try {
//         // Find the file
//         const file = await File.findById(id);
//         if (!file) {
//             return res.status(404).json({ message: "File not found" });
//         }

//         // Validate visibility
//         const validVisibilities = ["private", "public", "custom"];
//         if (!validVisibilities.includes(visibility)) {
//             return res.status(400).json({ message: "Invalid visibility setting" });
//         }

//         // Update visibility
//         file.visibility = visibility;

//         // Handle allowedUsers for custom visibility
//         if (visibility === "custom") {
//             if (!Array.isArray(allowedUsers) || allowedUsers.length === 0) {
//                 return res
//                     .status(400)
//                     .json({ message: "Allowed users are required for custom visibility" });
//             }

//             // Check if all allowedUsers exist in the database
//             const users = await User.find({ email: { $in: allowedUsers } });
//             if (users.length !== allowedUsers.length) {
//                 return res
//                     .status(400)
//                     .json({ message: "One or more allowed users do not exist" });
//             }

//             // Map user emails to their IDs
//             file.allowedUsers = users.map((user) => user._id);
//         } else {
//             file.allowedUsers = []; // Clear allowedUsers for non-custom visibility
//         }

//         // Update sharable link based on visibility
//         if (visibility === "public" || visibility === "custom") {
//             file.sharableLink = `http://localhost:8000/file/${file._id}`; // Sharable link for public and custom
//         } else {
//             file.sharableLink = null; // No link for private visibility
//         }

//         // Save the updated file
//         await file.save();

//         res.status(200).json({
//             message: "Visibility updated successfully",
//             file: {
//                 ...file.toObject(),
//                 sharableLink: file.sharableLink, // Include the updated sharable link
//             },
//         });
//     } catch (err) {
//         console.error("Error updating visibility:", err);
//         res.status(500).json({ message: "Error updating visibility", error: err.message });
//     }
// });

// Fetch user files

router.put("/file/:id/visibility", authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { visibility, allowedUsers } = req.body;

    try {
        // Find the file
        const file = await File.findById(id);
        if (!file) {
            return res.status(404).json({ message: "File not found" });
        }

        // Validate visibility
        const validVisibilities = ["private", "public", "custom"];
        if (!validVisibilities.includes(visibility)) {
            return res.status(400).json({ message: "Invalid visibility setting" });
        }

        // Update visibility
        file.visibility = visibility;

        // Handle allowedUsers for custom visibility
        if (visibility === "custom") {
            if (!Array.isArray(allowedUsers) || allowedUsers.length === 0) {
                return res
                    .status(400)
                    .json({ message: "Allowed users are required for custom visibility" });
            }

            // Check if all allowedUsers exist in the database
            const users = await User.find({ email: { $in: allowedUsers } });
            if (users.length !== allowedUsers.length) {
                return res
                    .status(400)
                    .json({ message: "One or more allowed users do not exist" });
            }

            // Map user emails to their IDs
            file.allowedUsers = users.map((user) => user._id);
        } else {
            file.allowedUsers = []; // Clear allowedUsers for non-custom visibility
        }

        // Update sharable link based on visibility
        if (visibility === "public" || visibility === "custom") {
            file.sharableLink = `http://localhost:8000/download/downloadfile/${file._id}`; // Updated sharable link
        } else {
            file.sharableLink = null; // No link for private visibility
        }

        // Save the updated file
        await file.save();

        res.status(200).json({
            message: "Visibility updated successfully",
            file: {
                ...file.toObject(),
                sharableLink: file.sharableLink, // Include the updated sharable link
            },
        });
    } catch (err) {
        console.error("Error updating visibility:", err);
        res.status(500).json({ message: "Error updating visibility", error: err.message });
    }
});

// Fetch user files
router.get("/files", authenticateToken, async (req, res) => {
    const userId = req.user.userId;

    try {
        // Find all files for the user
        const files = await File.find({ userId }).populate("allowedUsers", "email");

        // Map files to include additional fields
        const filesWithDetails = files.map((file) => {
            const now = new Date();
            const unlockDate = new Date(file.unlockDate);
            const isUnlocked = now >= unlockDate;

            return {
                ...file.toObject(),
                sharableLink: `http://localhost:8000/download/downloadfile/${file._id}`, // Updated sharable link
                unlockDate: file.unlockDate,
                status: isUnlocked ? "unlocked" : "locked", // Dynamically set status
            };
        });

        res.status(200).json({ message: "Files retrieved successfully", files: filesWithDetails });
    } catch (err) {
        console.error("Error retrieving files:", err);
        res.status(500).json({ message: "Error retrieving files", error: err.message });
    }
});

// router.get("/files", authenticateToken, async (req, res) => {
//     const userId = req.user.userId;

//     try {
//         // Find all files for the user
//         const files = await File.find({ userId }).populate("allowedUsers", "email");

//         // Map files to include additional fields
//         const filesWithDetails = files.map((file) => {
//             const now = new Date();
//             const unlockDate = new Date(file.unlockDate);
//             const isUnlocked = now >= unlockDate;

//             return {
//                 ...file.toObject(),
//                 sharableLink: `http://localhost:8000/file/${file._id}`, // Example sharable link
//                 unlockDate: file.unlockDate,
//                 status: isUnlocked ? "unlocked" : "locked", // Dynamically set status
//             };
//         });

//         res.status(200).json({ message: "Files retrieved successfully", files: filesWithDetails });
//     } catch (err) {
//         console.error("Error retrieving files:", err);
//         res.status(500).json({ message: "Error retrieving files", error: err.message });
//     }
// });
// Fetch user data for the dashboard
router.get("/user", authenticateToken, async (req, res) => {
    const userId = req.user.userId;

    try {
        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Calculate total files and storage used
        const files = await File.find({ userId });
        const totalFiles = files.length;
        const storageUsed = files.reduce((total, file) => total + file.fileSize, 0);

        res.status(200).json({
            message: "User data retrieved successfully",
            data: {
                ...user.toObject(), // Include all user data
                totalFiles,
                storageUsed: `${(storageUsed / (1024 * 1024 * 1024)).toFixed(2)} GB`, // Convert to GB
            },
        });
    } catch (err) {
        console.error("Error retrieving user data:", err);
        res.status(500).json({ message: "Error retrieving user data", error: err.message });
    }
});


module.exports = router;