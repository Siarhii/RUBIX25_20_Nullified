import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function FileInput() {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [password, setPassword] = useState("");
  const [unlockTime, setUnlockTime] = useState("");
  const [notificationEmail, setNotificationEmail] = useState("");
  // Add this button in your JSX
  const navigateToTemplates = () => {
    navigate("/templates");
  };
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (inputFiles) => {
    const newFiles = Array.from(inputFiles).map((file) => ({
      file, // Store the actual File object
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2), // Convert to MB
      type: file.type,
    }));
    setFiles([...files, ...newFiles]);
  };

  const removeFile = (fileName) => {
    setFiles(files.filter((file) => file.name !== fileName));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("Please select files first");
      return;
    }

    if (!password) {
      toast.error("Password is required");
      return;
    }

    if (!unlockTime) {
      toast.error("Unlock time is required");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file.file); // Append the actual File object
    });
    formData.append("password", password);
    formData.append("unlockTime", unlockTime);

    // Add notification email if uploading to server
    if (selectedOption === "upload") {
      const authToken = localStorage.getItem("token");
      if (!authToken) {
        toast.error(
          "You must be logged in to upload to the server,You will be redirected to Login page"
        );
        setUploading(false);
        setTimeout(() => {
          navigate("/login");
        }, 5000);
        return;
      }
      formData.append("userId", JSON.parse(atob(authToken.split(".")[1]))._id); // Extract userId from token
      if (notificationEmail) {
        formData.append("notificationEmail", notificationEmail);
      }
    }

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const endpoint =
        selectedOption === "capsule" ? "/uploadAndDelete" : "/uploadAndSave";

      // Include the auth token in the headers for authenticated requests
      const headers = {};
      if (selectedOption === "upload") {
        const authToken = localStorage.getItem("token");
        headers["Authorization"] = `Bearer ${authToken}`;
      }

      const response = await fetch(`${backendUrl}/uploads${endpoint}`, {
        method: "POST",
        headers,
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();

      setFiles([]);
      setUploadProgress(0);
      toast.success("Files uploaded successfully!");
      if (selectedOption === "capsule") {
        window.location.href = data.downloadLink; // Redirect to download link for time capsule
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload files. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 pt-32 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Choose Your Upload Method
            </h1>
            <p className="text-gray-300 text-sm md:text-base">
              Select how you want to preserve your memories
            </p>
          </div>

          <div className="text-center mb-8">
            <button
              onClick={navigateToTemplates}
              className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-600 transition-all duration-300"
            >
              Choose a Thematic Template
            </button>
          </div>
          {/* Options Grid */}
          {!selectedOption && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Get Time Capsule Option */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative group cursor-pointer"
                onClick={() => setSelectedOption("capsule")}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
                <div className="relative bg-gray-900 p-8 rounded-lg">
                  <div className="flex items-center justify-center mb-6">
                    <svg
                      className="w-16 h-16 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white text-center mb-4">
                    Get Time Capsule
                  </h3>
                  <p className="text-gray-300 text-center">
                    Download an encrypted and compressed zip file of your
                    memories instantly
                  </p>
                </div>
              </motion.div>

              {/* Upload to Server Option */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative group cursor-pointer"
                onClick={() => setSelectedOption("upload")}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
                <div className="relative bg-gray-900 p-8 rounded-lg">
                  <div className="flex items-center justify-center mb-6">
                    <svg
                      className="w-16 h-16 text-purple-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white text-center mb-4">
                    Upload to Server
                  </h3>
                  <p className="text-gray-300 text-center">
                    We'll store your memories and notify you when the time is
                    right
                  </p>
                </div>
              </motion.div>
            </div>
          )}

          {/* Render the appropriate upload interface based on selection */}
          {selectedOption && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Upload Area */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div
                  className={`relative p-8 rounded-lg border-2 border-dashed transition-all duration-300 ease-in-out
                                        ${
                                          dragActive
                                            ? "border-blue-500 bg-blue-500/10"
                                            : "border-gray-600 hover:border-gray-500"
                                        }
                                    `}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    multiple
                    onChange={handleChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />

                  <div className="text-center">
                    <div className="mb-4">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M24 14v6m0 0v6m0-6h6m-6 0h-6"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 40h24a8 8 0 008-8V16a8 8 0 00-8-8H12a8 8 0 00-8 8v16a8 8 0 008 8z"
                        />
                      </svg>
                    </div>
                    <p className="text-lg text-white font-medium">
                      Drag and drop your files here
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      or click to select files
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Support for images, videos, and documents
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Password and Unlock Time Inputs */}
              <div className="mt-8 space-y-4">
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-gray-200"
                  required
                />
                <input
                  type="datetime-local"
                  value={unlockTime}
                  onChange={(e) => setUnlockTime(e.target.value)}
                  className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-gray-200"
                  required
                />
                {selectedOption === "upload" && (
                  <input
                    type="email"
                    placeholder="Notification email (optional)"
                    value={notificationEmail}
                    onChange={(e) => setNotificationEmail(e.target.value)}
                    className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-gray-200"
                  />
                )}
              </div>

              {/* File List */}
              {files.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="mt-8"
                >
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Uploaded Files
                  </h3>
                  <div className="space-y-3">
                    {files.map((file, index) => (
                      <motion.div
                        key={file.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="bg-gray-800/50 rounded-lg p-4 flex items-center justify-between group hover:bg-gray-800 transition-all duration-300"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-blue-500/10 rounded-lg">
                            <svg
                              className="w-6 h-6 text-blue-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="text-white font-medium">
                              {file.name}
                            </p>
                            <p className="text-sm text-gray-400">
                              {file.size} MB
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(file.name)}
                          className="text-gray-400 hover:text-red-400 transition-colors duration-300"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Upload Button */}
              {files.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mt-8 flex justify-center"
                >
                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg
                                            hover:from-blue-700 hover:to-purple-700 transition-all duration-300
                                            transform hover:scale-105 active:scale-95"
                  >
                    {uploading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <i className="fas fa-spinner fa-spin"></i>
                        <span>Uploading... {uploadProgress}%</span>
                      </div>
                    ) : (
                      "Upload All Files"
                    )}
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Back Button - Show only when an option is selected */}
          {selectedOption && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mt-8"
            >
              <button
                onClick={() => setSelectedOption(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ← Back to options
              </button>
            </motion.div>
          )}
        </div>
      </div>
      <Footer />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}
