import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

const DownloadPage = () => {
  const [downloadLink, setDownloadLink] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleDownload = async () => {
    if (!downloadLink) {
      toast.error("Please enter a valid download link.");
      return;
    }

    // Extract the file ID from the link
    const fileId = downloadLink.split("/").pop();
    if (!fileId) {
      toast.error("Invalid download link.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      // Make a GET request to the download endpoint
      const response = await axios.get(
        `http://localhost:8000/download/downloadfile/${fileId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob", // Important for file downloads
        }
      );

      // Create a download link for the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `file_${fileId}.enc`; // Set the download filename
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success("File downloaded successfully!");
    } catch (error) {
      console.error("Error downloading file:", error);

      if (error.response) {
        switch (error.response.status) {
          case 401:
            toast.error(
              "You are not authorized to download this file. Please log in."
            );
            break;
          case 403:
            toast.error("You do not have permission to access this file.");
            break;
          case 404:
            toast.error("File not found. Please check the link.");
            break;
          default:
            toast.error("Failed to download the file. Please try again.");
        }
      } else {
        toast.error(
          "Failed to download the file. Please check your connection."
        );
      }
    } finally {
      setIsLoading(false);
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
              Download Your File
            </h1>
            <p className="text-gray-300 text-sm md:text-base">
              Paste your download link below to retrieve your file.
            </p>
          </div>

          {/* Download Input Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800/50 rounded-lg p-8"
          >
            <div className="space-y-6">
              {/* Input for the download link */}
              <input
                type="text"
                value={downloadLink}
                onChange={(e) => setDownloadLink(e.target.value)}
                placeholder="Paste the download link here"
                className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-gray-200"
              />

              {/* Download Button */}
              <button
                onClick={handleDownload}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg
                            hover:from-blue-700 hover:to-purple-700 transition-all duration-300
                            transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Downloading..." : "Download File"}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />

      {/* Toast Notifications */}
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
};

export default DownloadPage;
