import React, { useState } from "react";
import { Link, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";

const App = () => {
  const location = useLocation();

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <Link to="/" className="nav-button-link">
          <button
            className={`nav-button ${
              location.pathname === "/" ? "active" : ""
            }`}
          >
            Encrypt
          </button>
        </Link>

        <Link to="/decrypt" className="nav-button-link">
          <button
            className={`nav-button ${
              location.pathname === "/decrypt" ? "active" : ""
            }`}
          >
            Decrypt
          </button>
        </Link>
      </div>

      {/* Main Content */}
      <div className="content-area">
        <Routes>
          <Route path="/" element={<EncryptPage />} />
          <Route path="/decrypt" element={<DecryptPage />} />
        </Routes>
      </div>
    </div>
  );
};

function EncryptPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [files, setFiles] = useState([]);
  const [unlockDate, setUnlockDate] = useState(new Date()); // Default to current local time
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  // Format a date in the local timezone for the <input type="datetime-local">
  const formatLocalDateTime = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleEncryption = async () => {
    if (!password || !confirmPassword || files.length === 0) {
      setStatus({
        type: "error",
        message:
          "Please fill in all fields and select files before proceeding.",
      });
      return;
    }

    if (password !== confirmPassword) {
      setStatus({
        type: "error",
        message: "Passwords do not match. Please try again.",
      });
      return;
    }

    setIsEncrypting(true);
    setStatus({ type: "", message: "" });

    try {
      const outputDir = await window.go.main.App.GetCurrentDirectory();

      // Send the unlock date as-is (local time) to the backend
      const encryptedFilePath = await window.go.main.App.EncryptFiles(
        files,
        password,
        unlockDate.toISOString(), // Send the date as an ISO string in local time
        outputDir
      );

      setStatus({
        type: "success",
        message: `Files successfully encrypted and saved to: ${encryptedFilePath}`,
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: `Encryption failed: ${error.message || error.toString()}`,
      });
    } finally {
      setIsEncrypting(false);
    }
  };

  const handleFileSelect = async () => {
    try {
      const selectedFiles = await window.go.main.App.SelectFiles();
      if (selectedFiles && selectedFiles.length > 0) {
        setFiles(selectedFiles);
        setStatus({ type: "", message: "" }); // Clear previous status
      } else {
        setStatus({
          type: "error",
          message: "No files selected. Please try again.",
        });
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: `Error selecting files: ${error.message || error.toString()}`,
      });
    }
  };

  const handleCustomDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const currentDate = new Date();

    // Ensure the selected date is in the future
    if (selectedDate > currentDate) {
      setUnlockDate(selectedDate); // Store the date in local time
    } else {
      setStatus({
        type: "error",
        message: "Custom date must be in the future.",
      });
    }
  };

  return (
    <div className="page-container">
      <h1>Create A time capsule!</h1>

      <div>
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="password-input"
        />
      </div>

      <div>
        <label>Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm your password"
          className="password-input"
        />
      </div>

      <div>
        <label>Files to Encrypt</label>
        <div className="input-group">
          <input
            type="text"
            value={files.join(", ")}
            readOnly
            placeholder="No files selected"
          />
          <button onClick={handleFileSelect}>Browse</button>
        </div>
      </div>

      <div>
        <label>Unlock Date</label>
        <input
          type="datetime-local"
          value={formatLocalDateTime(unlockDate)} // Display in local time
          onChange={handleCustomDateChange}
          min={formatLocalDateTime(new Date())} // Prevent past dates/times
        />
      </div>

      <button
        className="button"
        onClick={handleEncryption}
        disabled={
          isEncrypting || !password || !confirmPassword || files.length === 0
        }
      >
        {isEncrypting ? "Encrypting..." : "Encrypt Files"}
      </button>

      {status.message && (
        <div className={`status ${status.type}`}>
          {status.type === "error" ? "❌ " : "✅ "}
          {status.message}
        </div>
      )}
    </div>
  );
}

function DecryptPage() {
  const [password, setPassword] = useState("");
  const [encryptedFile, setEncryptedFile] = useState("");
  const [outputDir, setOutputDir] = useState("");
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleDecryption = async () => {
    if (!password || !encryptedFile || !outputDir) {
      setStatus({
        type: "error",
        message: "Please fill in all fields before proceeding.",
      });
      return;
    }

    setIsDecrypting(true);
    setStatus({ type: "", message: "" });
    try {
      await window.go.main.App.DecryptAndExtractCapsule(
        encryptedFile,
        outputDir,
        password
      );
      setStatus({
        type: "success",
        message: "Time capsule successfully decrypted!",
      });
    } catch (error) {
      let errorMessage = error.toString();

      // Handle specific error messages
      if (errorMessage.includes("incorrect password")) {
        errorMessage = "Incorrect password. Please try again.";
      } else if (errorMessage.includes("file is still locked")) {
        errorMessage = errorMessage.replace(
          "file is still locked",
          "File is still locked"
        );
      } else {
        errorMessage = "Decryption failed. Please try again.";
      }

      setStatus({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setIsDecrypting(false);
    }
  };

  const handleFileSelect = async () => {
    try {
      const file = await window.go.main.App.SelectEncryptedFile();
      if (file) {
        setEncryptedFile(file);
        setStatus({ type: "", message: "" });
      } else {
        setStatus({
          type: "error",
          message: "No file selected. Please try again.",
        });
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: `Error selecting file: ${error.message || error.toString()}`,
      });
    }
  };

  const handleDirSelect = async () => {
    try {
      const dir = await window.go.main.App.SelectOutputFolder();
      if (dir) {
        setOutputDir(dir);
        setStatus({ type: "", message: "" });
      } else {
        setStatus({
          type: "error",
          message: "No directory selected. Please try again.",
        });
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: `Error selecting directory: ${
          error.message || error.toString()
        }`,
      });
    }
  };

  return (
    <div className="page-container">
      <h1>Decrypt Time Capsule</h1>

      <div>
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="password-input"
        />
      </div>

      <div>
        <label>Encrypted File</label>
        <div className="input-group">
          <input
            type="text"
            value={encryptedFile}
            readOnly
            placeholder="No file selected"
          />
          <button onClick={handleFileSelect}>Browse</button>
        </div>
      </div>

      <div>
        <label>Output Directory</label>
        <div className="input-group">
          <input
            type="text"
            value={outputDir}
            readOnly
            placeholder="No directory selected"
          />
          <button onClick={handleDirSelect}>Browse</button>
        </div>
      </div>

      <button
        className="button"
        onClick={handleDecryption}
        disabled={isDecrypting || !password || !encryptedFile || !outputDir}
      >
        {isDecrypting ? "Decrypting..." : "Decrypt Time Capsule"}
      </button>

      {status.message && (
        <div className={`status ${status.type}`}>
          {status.type === "error" ? "❌ " : "✅ "}
          {status.message}
        </div>
      )}
    </div>
  );
}

export default App;
