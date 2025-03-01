import React, { useEffect } from "react";

const Popup = ({ type, message, onClose, delay }) => {
  // Automatically close the popup after a delay
  useEffect(() => {
    if (delay) {
      const timer = setTimeout(() => {
        onClose();
      }, delay);

      return () => clearTimeout(timer); // Cleanup the timer
    }
  }, [delay, onClose]);

  // Define styles based on the popup type
  const getStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-100 border-green-400 text-green-700";
      case "error":
        return "bg-red-100 border-red-400 text-red-700";
      case "warning":
        return "bg-yellow-100 border-yellow-400 text-yellow-700";
      default:
        return "bg-blue-100 border-blue-400 text-blue-700";
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className={`${getStyles()} p-6 rounded-lg border-2 shadow-lg text-center`}
      >
        <p className="font-medium">{message}</p>
      </div>
    </div>
  );
};

export default Popup;
