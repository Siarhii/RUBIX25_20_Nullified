import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const TemplatesPage = () => {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const templates = [
    {
      id: 1,
      title: "Graduation",
      description:
        "Celebrate your academic achievements with a time capsule for your graduation.",
      icon: "🎓",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-24 h-24 text-blue-500"
        >
          <path d="M22 10v6M2 10l10-6 10 6-10 6-10-6zM2 10v6M12 4v6M12 16v6" />
        </svg>
      ),
      details: {
        suggestedContent: [
          "Photos from graduation day",
          "Scanned copies of diplomas or certificates",
          "Videos of graduation speeches or celebrations",
        ],
        example:
          "Include a letter to your future self about your career goals.",
      },
    },
    {
      id: 2,
      title: "Anniversary",
      description:
        "Preserve memories of your special day with an anniversary-themed capsule.",
      icon: "💍",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-24 h-24 text-pink-500"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
      details: {
        suggestedContent: [
          "Photos from the wedding or anniversary celebration",
          "Love letters or notes exchanged between partners",
          "Videos of special moments",
        ],
        example: "Write a letter to your partner about your favorite memories.",
      },
    },
    {
      id: 3,
      title: "Letters to Future Self",
      description:
        "Write a letter to your future self and revisit it years later.",
      icon: "✉️",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-24 h-24 text-yellow-500"
        >
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <path d="M22 6l-10 7L2 6" />
        </svg>
      ),
      details: {
        suggestedContent: [
          "A written letter to your future self",
          "Photos or videos of your current life",
          "Predictions or goals for the future",
        ],
        example: "Include a list of your current hobbies and aspirations.",
      },
    },
    {
      id: 4,
      title: "New Beginnings",
      description:
        "Capture the excitement of new beginnings, like a new job or moving to a new city.",
      icon: "🌱",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-24 h-24 text-green-500"
        >
          <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
        </svg>
      ),
      details: {
        suggestedContent: [
          "Photos of your new home or workplace",
          "Journal entries about your feelings and goals",
          "Videos of your new surroundings",
        ],
        example: "Write about your hopes and fears for this new chapter.",
      },
    },
    {
      id: 5,
      title: "Travel Memories",
      description:
        "Store your travel photos, tickets, and souvenirs in a travel-themed capsule.",
      icon: "✈️",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-24 h-24 text-indigo-500"
        >
          <path d="M22 16v-6l-6-6H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2zM12 2v6l6 6" />
        </svg>
      ),
      details: {
        suggestedContent: [
          "Photos from your travels",
          "Scanned copies of tickets and boarding passes",
          "Videos of landmarks and experiences",
        ],
        example: "Include a map with your travel route highlighted.",
      },
    },
    {
      id: 6,
      title: "Family Memories",
      description:
        "Create a capsule filled with family photos, videos, and mementos.",
      icon: "👨‍👩‍👧‍👦",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-24 h-24 text-orange-500"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      details: {
        suggestedContent: [
          "Family photos from special occasions",
          "Videos of family gatherings",
          "Handwritten notes or recipes from family members",
        ],
        example: "Include a family tree or a timeline of family milestones.",
      },
    },
  ];

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
  };

  const handleProceed = () => {
    console.log("Proceed button clicked");
    console.log("Selected Template:", selectedTemplate);

    if (selectedTemplate) {
      // Create a new object without the `svg` property
      const templateWithoutSvg = { ...selectedTemplate };
      delete templateWithoutSvg.svg;

      navigate("/fileinput", { state: { template: templateWithoutSvg } });
    } else {
      console.error("No template selected.");
    }
  };

  const handleCloseModal = () => {
    setSelectedTemplate(null);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 pt-32 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Choose Your Thematic Capsule Template
            </h1>
            <p className="text-gray-300 text-sm md:text-base">
              Personalize your time capsule with a theme that matches your
              memories.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates.map((template) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: template.id * 0.1 }}
                className="relative group cursor-pointer"
                onClick={() => handleTemplateSelect(template)}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
                <div className="relative bg-gray-900 p-8 rounded-lg h-full flex flex-col items-center justify-center text-center">
                  <div className="text-6xl mb-6">{template.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    {template.title}
                  </h3>
                  <p className="text-gray-300">{template.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <Footer />

      {/* Modal for Template Details */}
      {selectedTemplate && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-900 p-8 rounded-lg max-w-2xl w-full mx-4"
          >
            {/* Animated SVG */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex justify-center mb-6"
            >
              {selectedTemplate.svg}
            </motion.div>

            <h2 className="text-2xl font-bold text-white mb-6">
              {selectedTemplate.title}
            </h2>
            <p className="text-gray-300 mb-6">{selectedTemplate.description}</p>

            <h3 className="text-xl font-bold text-white mb-4">
              Suggested Content
            </h3>
            <ul className="list-disc list-inside text-gray-300 mb-6">
              {selectedTemplate.details.suggestedContent.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center space-x-2"
                >
                  <span>•</span>
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>

            <h3 className="text-xl font-bold text-white mb-4">Example</h3>
            <p className="text-gray-300 mb-6">
              {selectedTemplate.details.example}
            </p>

            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCloseModal}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all duration-300"
              >
                Close
              </button>
              <button
                onClick={handleProceed}
                className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-600 transition-all duration-300"
              >
                Proceed
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default TemplatesPage;
