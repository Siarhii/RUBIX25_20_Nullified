import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

export default function UploadInterface() {
    const navigate = useNavigate();
    const [dragActive, setDragActive] = useState(false);
    const [files, setFiles] = useState([]);
    const [deliveryDate, setDeliveryDate] = useState('');
    const [password, setPassword] = useState('');
    
    // Calculate minimum date (today)
    const today = new Date().toISOString().split('T')[0];

    // Check if form is valid
    const isFormValid = files.length > 0 && deliveryDate && password.length >= 6;

    const handleEncrypt = () => {
        if (!isFormValid) return;
        
        // Handle encryption logic here
        console.log('Encrypting files with:', {
            files,
            deliveryDate,
            password
        });
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
        const newFiles = Array.from(inputFiles).map(file => ({
            name: file.name,
            size: (file.size / 1024 / 1024).toFixed(2), // Convert to MB
            type: file.type
        }));
        setFiles([...files, ...newFiles]);
    };

    const removeFile = (fileName) => {
        setFiles(files.filter(file => file.name !== fileName));
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 pt-32 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Back Button */}
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => navigate(-1)}
                        className="mb-8 flex items-center text-gray-400 hover:text-white transition-colors"
                    >
                        <svg 
                            className="w-5 h-5 mr-2" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                            />
                        </svg>
                        Back
                    </motion.button>

                    <div className="text-center mb-16">
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
                            Upload Your Files
                        </h1>
                        <p className="text-gray-300 text-sm md:text-base">
                            Drag and drop your files or click to select
                        </p>
                    </div>

                    {/* Upload Area */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div 
                            className={`relative p-8 rounded-lg border-2 border-dashed transition-all duration-300 ease-in-out
                                ${dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 hover:border-gray-500'}
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
                                    </svg>
                                </div>
                                <p className="text-lg text-white font-medium">
                                    Drop your files here
                                </p>
                                <p className="text-sm text-gray-400 mt-2">
                                    or click to select files
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Date and Password Fields */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="mt-8 space-y-6"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Delivery Date */}
                            <div>
                                <label htmlFor="deliveryDate" className="block text-sm font-medium text-gray-300 mb-2">
                                    Delivery Date
                                </label>
                                <input
                                    type="date"
                                    id="deliveryDate"
                                    min={today}
                                    value={deliveryDate}
                                    onChange={(e) => setDeliveryDate(e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                    Encryption Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Minimum 6 characters"
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                />
                                {password && password.length < 6 && (
                                    <p className="mt-1 text-sm text-red-400">
                                        Password must be at least 6 characters
                                    </p>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* File List */}
                    {files.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="mt-8"
                        >
                            <h3 className="text-xl font-semibold text-white mb-4">Selected Files</h3>
                            <div className="space-y-3">
                                {files.map((file, index) => (
                                    <motion.div
                                        key={file.name}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                        className="bg-gray-800/50 rounded-lg p-4 flex items-center justify-between"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">{file.name}</p>
                                                <p className="text-sm text-gray-400">{file.size} MB</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeFile(file.name)}
                                            className="text-gray-400 hover:text-red-400 transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Encrypt Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mt-8 flex justify-center"
                    >
                        <button
                            onClick={handleEncrypt}
                            disabled={!isFormValid}
                            className={`px-8 py-3 rounded-lg text-white font-medium transition-all duration-300
                                ${isFormValid 
                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 active:scale-95' 
                                    : 'bg-gray-700 cursor-not-allowed opacity-50'
                                }`}
                        >
                            {isFormValid ? 'Encrypt Files' : 'Please Fill All Fields'}
                        </button>
                    </motion.div>
                </div>
            </div>
        </>
    );
}
