import React from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";
import "./Home.css";
import { motion } from "framer-motion";

function Home() {
  return (
    <>
      <main className="relative min-h-screen w-full overflow-x-hidden bg-gray-900">
        <Navbar />

        {/* Hero Section - With Fixed Image */}
        <section className="relative w-full min-h-screen">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://images.squarespace-cdn.com/content/v1/5afdf0ad1aef1d04b9a008d6/1540832105091-SAD4QYV7PA059DTRGFX0/hero_v2.jpg?format=2500w')`,
              // If using a direct URL:
              // backgroundImage: `url('https://images.squarespace-cdn.com/content/v1/5afdf0ad1aef1d04b9a008d6/1540832105091-SAD4QYV7PA059DTRGFX0/hero_v2.jpg?format=2500w')`
            }}
          >
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/60" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 w-full min-h-screen flex items-center bg-black/30">
            <div
              className="absolute inset-0 z-0"
              style={{
                backgroundImage: `url('https://images.squarespace-cdn.com/content/v1/5afdf0ad1aef1d04b9a008d6/1540832105091-SAD4QYV7PA059DTRGFX0/hero_v2.jpg?format=2500w')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "brightness(0.8)",
                opacity: "0.9",
              }}
            />
            <div className="w-full max-w-7xl mx-auto px-4 md:px-6 relative z-10">
              <div className="w-full md:w-1/2 ml-auto flex flex-col justify-center min-h-screen py-32">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-right space-y-6"
                >
                  <motion.h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-bold text-white leading-relaxed text-center md:text-right">
                    <motion.span
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3, duration: 0.8 }}
                      className="block mb-4"
                    >
                      Transform
                    </motion.span>
                    <motion.span
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                      className="block mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400"
                    >
                      Your Present
                    </motion.span>
                    <motion.span
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7, duration: 0.8 }}
                      className="block mb-4"
                    >
                      Into Tomorrow's
                    </motion.span>
                    <motion.span
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9, duration: 0.8 }}
                      className="block text-white"
                    >
                      Legacy
                    </motion.span>
                  </motion.h1>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                  className="flex justify-center md:justify-end mt-20"
                >
                  <Link to="/signup" className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/50 via-purple-600/50 to-blue-600/50 rounded-xl blur opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                    <button className="relative px-12 py-4 bg-gradient-to-r from-blue-600/80 via-purple-600/80 to-blue-600/80 rounded-xl leading-none flex items-center group-hover:from-blue-600 group-hover:via-purple-600 group-hover:to-blue-600 transition-all duration-300">
                      <span className="text-white/90 group-hover:text-white text-lg font-medium transition-colors duration-300">
                        Get Started
                      </span>
                      <motion.span
                        animate={{
                          x: [0, 5, 0],
                          opacity: [1, 0.7, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="ml-3 text-xl text-white/90 group-hover:text-white"
                      >
                        →
                      </motion.span>
                    </button>
                  </Link>
                </motion.div>

                {/* Decorative elements */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.12 }}
                  transition={{ delay: 1.5, duration: 1 }}
                  className="absolute top-1/3 right-12 w-24 h-24 bg-blue-600 rounded-full blur-3xl"
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.12 }}
                  transition={{ delay: 1.7, duration: 1 }}
                  className="absolute bottom-1/3 right-24 w-36 h-36 bg-purple-600 rounded-full blur-3xl"
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.08 }}
                  transition={{ delay: 1.9, duration: 1 }}
                  className="absolute top-2/3 right-16 w-28 h-28 bg-blue-600 rounded-full blur-3xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Digital Time Capsule Section */}
        <section className="relative bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 py-16">
          <div className="max-w-7xl mx-auto px-4">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Create Your Digital Time Capsule
              </h2>
              <p className="text-gray-300 text-sm md:text-base max-w-2xl mx-auto">
                Our platform allows you to securely store messages, photos, and
                videos for a future date. Experience the joy of sharing memories
                at the perfect moment.
              </p>
            </div>

            {/* Steps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {/* Step 1 */}
              <div className="group relative h-full">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
                <div className="relative h-full bg-gray-900 rounded-lg p-5 flex flex-col">
                  <div className="h-48 mb-4 overflow-hidden rounded-lg bg-gray-800">
                    <img
                      src="https://www.tessolve.com/wp-content/uploads/2023/12/memory-testing-post.jpg"
                      alt="Set Up Your Capsule"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-white font-sans group-hover:text-blue-400 transition-colors duration-300">
                    Step 1: Set Up Your Capsule
                  </h3>
                  <p className="text-gray-300 text-sm font-sans">
                    Choose a name and customize your capsule settings.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="group relative h-full">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-500 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
                <div className="relative h-full bg-gray-900 rounded-lg p-5 flex flex-col">
                  <div className="h-48 mb-4 overflow-hidden rounded-lg bg-gray-800">
                    <img
                      src="https://img.freepik.com/premium-photo/document-transferring-concept-women-use-smartphones-upload-documents-from-folder-open-file-folder-with-flying-blank-documents-data-transfer-backup-file-sharing_29488-9323.jpg"
                      alt="Upload Your Media"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-white font-sans group-hover:text-blue-400 transition-colors duration-300">
                    Step 2: Upload Your Media
                  </h3>
                  <p className="text-gray-300 text-sm font-sans">
                    Add photos, videos, and messages to your capsule.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="group relative h-full">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
                <div className="relative h-full bg-gray-900 rounded-lg p-5 flex flex-col">
                  <div className="h-48 mb-4 overflow-hidden rounded-lg bg-gray-800">
                    <img
                      src="https://thumbs.dreamstime.com/b/clock-face-calendar-7424008.jpg"
                      alt="Set Delivery Date"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-white font-sans group-hover:text-blue-400 transition-colors duration-300">
                    Step 3: Set Delivery Date
                  </h3>
                  <p className="text-gray-300 text-sm font-sans">
                    Choose when your capsule will be delivered.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* "Is this how..." Section - Fixed mobile view */}
        <div className="w-full px-4">
          <div className="py-12 sm:py-24">
            <div className="w-full max-w-[90%] mx-auto">
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src="https://img.freepik.com/premium-photo/newspaper-put-blue-recycle-bin_943281-67592.jpg"
                  alt="Newspaper in recycling bin"
                  className="w-full h-[300px] sm:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <h2 className="text-2xl sm:text-4xl md:text-6xl font-sans font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-300 px-2">
                    Is this how you wanted to be remembered?
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section - Fixed mobile view */}
        <section className="bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4">
          <div className="max-w-[90%] mx-auto">
            <h2 className="text-2xl sm:text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-sans">
              Why Choose Us?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Digital Legacy Card */}
              <div className="group relative overflow-hidden rounded-2xl border border-gray-700/50 hover:border-blue-500/50 bg-gray-800/50 p-8 hover:bg-gray-800/80 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 mb-6 rounded-full bg-blue-500/10 border-2 border-blue-500/30 p-3 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-8 h-8 text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-white font-sans">
                    Digital Legacy
                  </h3>
                  <p className="text-gray-300 leading-relaxed font-sans">
                    Create a lasting digital footprint that preserves your
                    memories and stories for generations to come.
                  </p>
                </div>
              </div>

              {/* Time Travel Card */}
              <div className="group relative overflow-hidden rounded-2xl border border-gray-700/50 hover:border-purple-500/50 bg-gray-800/50 p-8 hover:bg-gray-800/80 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 mb-6 rounded-full bg-purple-500/10 border-2 border-purple-500/30 p-3 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-8 h-8 text-purple-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-white font-sans">
                    Time Travel Experience
                  </h3>
                  <p className="text-gray-300 leading-relaxed font-sans">
                    Journey through your memories with our intuitive timeline
                    feature, making every moment accessible.
                  </p>
                </div>
              </div>

              {/* Future Messages Card */}
              <div className="group relative overflow-hidden rounded-2xl border border-gray-700/50 hover:border-pink-500/50 bg-gray-800/50 p-8 hover:bg-gray-800/80 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 mb-6 rounded-full bg-pink-500/10 border-2 border-pink-500/30 p-3 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-8 h-8 text-pink-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-white font-sans">
                    Future Messages
                  </h3>
                  <p className="text-gray-300 leading-relaxed font-sans">
                    Schedule messages to be delivered in the future, creating
                    surprises for loved ones.
                  </p>
                </div>
              </div>

              {/* Security Card */}
              <div className="group relative overflow-hidden rounded-2xl border border-gray-700/50 hover:border-green-500/50 bg-gray-800/50 p-8 hover:bg-gray-800/80 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 mb-6 rounded-full bg-green-500/10 border-2 border-green-500/30 p-3 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-8 h-8 text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-white font-sans">
                    Bank-Level Security
                  </h3>
                  <p className="text-gray-300 leading-relaxed font-sans">
                    Your memories are protected with state-of-the-art encryption
                    and security measures.
                  </p>
                </div>
              </div>

              {/* Easy Access Card */}
              <div className="group relative overflow-hidden rounded-2xl border border-gray-700/50 hover:border-blue-500/50 bg-gray-800/50 p-8 hover:bg-gray-800/80 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 mb-6 rounded-full bg-blue-500/10 border-2 border-blue-500/30 p-3 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-8 h-8 text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-white font-sans">
                    Easy Access
                  </h3>
                  <p className="text-gray-300 leading-relaxed font-sans">
                    Access your memories anytime, anywhere with our cloud-based
                    platform.
                  </p>
                </div>
              </div>

              {/* Privacy Control Card */}
              <div className="group relative overflow-hidden rounded-2xl border border-gray-700/50 hover:border-purple-500/50 bg-gray-800/50 p-8 hover:bg-gray-800/80 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 mb-6 rounded-full bg-purple-500/10 border-2 border-purple-500/30 p-3 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-8 h-8 text-purple-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-white font-sans">
                    Privacy Control
                  </h3>
                  <p className="text-gray-300 leading-relaxed font-sans">
                    Full control over who sees your memories and when they can
                    access them.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Make Your Life Stand Out Section - Fixed mobile view */}
        <div className="relative">
          <div className="bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4">
            <div className="max-w-[90%] mx-auto">
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-20">
                {/* Title Section */}
                <div className="w-full lg:w-[45%]">
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
                    <div className="relative px-4 sm:px-8 py-8 bg-gray-900/50 backdrop-blur-sm rounded-lg">
                      <h2 className="text-3xl sm:text-5xl lg:text-7xl font-sans font-extrabold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent leading-tight">
                        Make Your Life
                        <span className="block mt-2">Stand Out</span>
                      </h2>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="w-full lg:w-[55%] space-y-6">
                  <p className="text-lg sm:text-xl leading-relaxed text-gray-200">
                    Our mission is to safeguard your most precious memories,
                    turning them into a beautiful, nostalgic gift for the
                    future. We're passionate about making a lasting impact on
                    families, helping them cherish their stories for generations
                    to come.
                  </p>

                  <div className="space-y-6">
                    {/* Feature points with hover effects */}
                    <div className="flex items-start space-x-4 group">
                      <div className="flex-shrink-0">
                        <div className="p-3 bg-purple-400/20 rounded-full group-hover:bg-purple-400/30 transition-colors duration-300">
                          <svg
                            className="w-6 h-6 text-purple-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      </div>
                      <p className="text-lg text-gray-300 font-sans group-hover:text-white transition-colors duration-300">
                        Create timeless digital keepsakes that can be passed
                        down through generations
                      </p>
                    </div>

                    <div className="flex items-start space-x-4 group">
                      <div className="flex-shrink-0">
                        <div className="p-3 bg-blue-400/20 rounded-full group-hover:bg-blue-400/30 transition-colors duration-300">
                          <svg
                            className="w-6 h-6 text-blue-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                          </svg>
                        </div>
                      </div>
                      <p className="text-lg text-gray-300 font-sans group-hover:text-white transition-colors duration-300">
                        Secure and private storage for your most cherished
                        memories and messages
                      </p>
                    </div>

                    <div className="flex items-start space-x-4 group">
                      <div className="flex-shrink-0">
                        <div className="p-3 bg-purple-400/20 rounded-full group-hover:bg-purple-400/30 transition-colors duration-300">
                          <svg
                            className="w-6 h-6 text-purple-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      </div>
                      <p className="text-lg text-gray-300 font-sans group-hover:text-white transition-colors duration-300">
                        Schedule meaningful messages to be delivered at the
                        perfect moment
                      </p>
                    </div>
                  </div>

                  {/* CTA Button - Full width on mobile */}
                  <Link
                    to="/login"
                    className="w-full sm:w-auto mt-8 px-8 py-4 bg-gradient-to-r from-purple-400/60 to-blue-400/60 
                                    text-white rounded-full font-sans font-medium tracking-wide
                                    hover:from-purple-400/80 hover:to-blue-400/80 
                                    transition-all duration-300 
                                    shadow-lg text-center block"
                  >
                    Start Your Legacy
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Home;
