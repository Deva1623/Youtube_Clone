import React, { useEffect } from "react";

const SnackBar = ({
  message = "No message provided!",
  type = "info",
  duration = 5000,
  onClose,
}) => {
  const colorClass =
    {
      success: "bg-green-600",
      error: "bg-red-600",
      info: "bg-blue-600",
      warning: "bg-amber-600",
    }[type] || "bg-blue-600";

  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={` flex justify-around items-center gap-5 fixed bottom-10 left-1/2 transform -translate-x-1/2 p-4 max-w-xs w-auto rounded shadow-lg text-white ${colorClass}`}
      role="alert"
    >
      <div className="font-mono">{message}</div>

      <button
        className=" text-2xl font-bold text-white p-2 rounded"
        onClick={onClose}
        aria-label="Close"
      >
        &times;
      </button>
    </div>
  );
};

export default SnackBar;
