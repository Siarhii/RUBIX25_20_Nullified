import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";

export default function Dashboard() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    totalFiles: 0,
    storageUsed: "0 GB",
    storageLimit: "5 GB",
  });
  const [userFiles, setUserFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch user data and files on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");

    // Redirect to login if no token is found
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch user data
        const userResponse = await axios.get(
          "http://localhost:8000/dashboard/user",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("User Data Response:", userResponse.data); // Debugging log
        setUserData(userResponse.data.data);

        // Fetch user files
        const filesResponse = await axios.get(
          "http://localhost:8000/dashboard/files",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Files Response:", filesResponse.data); // Debugging log
        setUserFiles(filesResponse.data.files);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data. Please try again.");

        // Redirect to login if the token is invalid or expired
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token"); // Clear invalid token
          navigate("/login");
        }
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    fetchData();
  }, [navigate]);

  const handleFileClick = (file) => {
    setSelectedFile(file);
  };

  const handleVisibilityChange = async (fileId, visibility) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      // Send updated visibility to the backend
      const response = await axios.put(
        `http://localhost:8000/dashboard/file/${fileId}/visibility`,
        { visibility },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Visibility updated:", response.data);

      // Update the file in the local state
      const updatedFiles = userFiles.map((file) =>
        file._id === fileId ? response.data.file : file
      );
      setUserFiles(updatedFiles);
    } catch (error) {
      console.error("Error updating visibility:", error);

      // Redirect to login if the token is invalid or expired
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  // Function to handle file download
  const handleDownload = async (fileId, originalName) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You are not authenticated. Please log in.");
        return;
      }

      // Make a GET request to the download endpoint
      const response = await fetch(
        `http://localhost:8000/download/downloadfile/${fileId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to download file");
      }

      // Convert the response to a Blob and create a download link
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${originalName}.enc`; // Set the download filename
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert(error.message || "Failed to download file");
    }
  };

  const FileSettingsModal = ({ file, onClose }) => {
    const [visibility, setVisibility] = useState(file.visibility);
    const [accessEmails, setAccessEmails] = useState(
      file.allowedUsers.map((user) => user.email).join(", ")
    );

    const handleSave = async () => {
      try {
        const token = localStorage.getItem("token");

        // Redirect to login if no token is found
        if (!token) {
          navigate("/login");
          return;
        }

        // Send updated settings to the backend
        const response = await axios.put(
          `http://localhost:8000/dashboard/file/${file._id}/visibility`,
          {
            visibility,
            allowedUsers: accessEmails.split(",").map((email) => email.trim()),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("File settings updated:", response.data);

        // Update the file in the local state
        const updatedFiles = userFiles.map((f) =>
          f._id === file._id ? response.data.file : f
        );
        setUserFiles(updatedFiles);

        onClose();
      } catch (error) {
        console.error("Error updating file settings:", error);

        // Redirect to login if the token is invalid or expired
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token"); // Clear invalid token
          navigate("/login");
        }
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4"
        >
          <h3 className="text-xl font-bold text-white mb-4">File Settings</h3>

          {/* Visibility Setting */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Visibility
            </label>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="private">Private</option>
              <option value="public">Public</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          {/* Access Users */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Access Users (comma separated emails)
            </label>
            <textarea
              value={accessEmails}
              onChange={(e) => setAccessEmails(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              rows="3"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-red-500 text-2xl">{error}</div>
      </div>
    );
  }

  // Ensure userData and userFiles are defined before rendering
  if (!userData || !userFiles) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-2xl">No data available.</div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* User Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* User Name */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 rounded-lg p-6"
            >
              <h3 className="text-gray-400 text-sm mb-2">User Name</h3>
              <p className="text-2xl font-bold text-white">
                {userData.name || "N/A"}
              </p>
            </motion.div>

            {/* User Email */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-800 rounded-lg p-6"
            >
              <h3 className="text-gray-400 text-sm mb-2">User Email</h3>
              <p className="text-3l font-bold text-white">
                {userData.email || "N/A"}
              </p>
            </motion.div>

            {/* Total Files */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800 rounded-lg p-6"
            >
              <h3 className="text-gray-400 text-sm mb-2">Total Files</h3>
              <p className="text-2xl font-bold text-white">
                {userData.totalFiles}
              </p>
            </motion.div>

            {/* Storage Used */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800 rounded-lg p-6"
            >
              <h3 className="text-gray-400 text-sm mb-2">Storage Used</h3>
              <p className="text-2xl font-bold text-white">
                {userData.storageUsed}
              </p>
            </motion.div>
          </div>

          {/* Files Section */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-6">Your Files</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userFiles.map((file) => {
                const unlockDate = new Date(file.unlockDate);
                const now = new Date();
                const timeRemaining = unlockDate - now; // Time difference in milliseconds

                // Convert timeRemaining to days, hours, minutes, and seconds
                const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
                const hours = Math.floor(
                  (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                );
                const minutes = Math.floor(
                  (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
                );
                const seconds = Math.floor(
                  (timeRemaining % (1000 * 60)) / 1000
                );

                return (
                  <motion.div
                    key={file._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-gray-900 rounded-lg p-4 cursor-pointer hover:bg-gray-700 transition-colors max-w-full overflow-hidden"
                    onClick={() => handleFileClick(file)}
                  >
                    <div className="flex flex-col space-y-2">
                      {/* File Name and Visibility Badge */}
                      <div className="flex items-start justify-between">
                        <h3 className="text-white font-medium mb-2">
                          {file.originalName}
                        </h3>
                        <div
                          className={`px-2 py-1 rounded text-xs whitespace-nowrap ${
                            file.visibility === "private"
                              ? "bg-gray-600 text-gray-300"
                              : file.visibility === "public"
                              ? "bg-blue-600 text-white"
                              : "bg-green-600 text-white"
                          }`}
                        >
                          {file.visibility}
                        </div>
                      </div>

                      {/* File Details */}
                      <div>
                        <p className="text-gray-400 text-sm">
                          Size:{" "}
                          {(file.fileSize / (1024 * 1024 * 1024)).toFixed(2)} GB
                        </p>
                        <p className="text-gray-400 text-sm">
                          Unlocks in:{" "}
                          {timeRemaining > 0
                            ? `${days > 0 ? `${days}d ` : ""}
             ${hours > 0 ? `${hours}h ` : ""}
             ${minutes > 0 ? `${minutes}m ` : ""}
             ${seconds > 0 ? `${seconds}s` : ""}`
                            : "Unlocked"}
                        </p>
                        <p className="text-gray-400 text-sm">
                          Status: {file.status || "locked"}
                        </p>
                        <p className="text-gray-400 text-sm">
                          <button
                            onClick={() =>
                              handleDownload(file._id, file.originalName)
                            }
                            className="text-blue-500 hover:underline mr-2"
                          >
                            Download
                          </button>
                          <button
                            onClick={() => {
                              const downloadLink = `http://localhost:8000/download/downloadfile/${file._id}`;
                              navigator.clipboard
                                .writeText(downloadLink)
                                .then(() => {
                                  alert("Download link copied to clipboard!");
                                });
                            }}
                            className="text-blue-500 hover:underline"
                          >
                            Copy Link
                          </button>
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* File Settings Modal */}
        {selectedFile && (
          <FileSettingsModal
            file={selectedFile}
            onClose={() => setSelectedFile(null)}
          />
        )}
      </div>
    </>
  );
}
