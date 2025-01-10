import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaFire,
  FaTv,
  FaBook,
  FaMusic,
  FaFilm,
  FaGamepad,
  FaBookReader,
  FaHeart,
  FaTools,
  FaPalette,
  FaBriefcase,
} from "react-icons/fa"; // Importing Font Awesome icons

const Sidebar = ({ isVisible }) => {
  const navigate = useNavigate(); //  for navigation

  //  to navigate to the Home page
  const goToHome = () => {
    navigate("/");
  };

  return (
    <aside
      className={`fixed top-16 left-0 h-full bg-gradient-to-b from-gray-800 via-gray-400 to-gray-800 text-white w-64 sm:w-48 md:w-64 z-10 transform ${
        isVisible ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out shadow-lg overflow-y-auto`}
    >
      <ul className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Home Link */}
        <li
          onClick={goToHome} // nav to Home
          className="hover:bg-gray-600 hover:scale-105 transition-all duration-200 p-3 rounded-lg cursor-pointer flex items-center space-x-4"
          tabIndex={0} //  feature for focusable elements
        >
          <FaHome className="h-5 w-5 sm:h-6 sm:w-6" /> {/* Home Icon */}
          <span className="text-sm sm:text-lg">Home</span>
        </li>

        {/* Trending Link */}
        <li
          className="hover:bg-gray-600 hover:scale-105 transition-all duration-200 p-3 rounded-lg cursor-pointer flex items-center space-x-4"
          tabIndex={0}
        >
          <FaFire className="h-5 w-5 sm:h-6 sm:w-6" /> {/* Trending Icon */}
          <span className="text-sm sm:text-lg">Trending</span>
        </li>

        {/* Subscriptions Link */}
        <li
          className="hover:bg-gray-600 hover:scale-105 transition-all duration-200 p-3 rounded-lg cursor-pointer flex items-center space-x-4"
          tabIndex={0}
        >
          <FaTv className="h-5 w-5 sm:h-6 sm:w-6" /> {/* Subscriptions Icon */}
          <span className="text-sm sm:text-lg">Subscriptions</span>
        </li>

        {/* Entertainment Section Header */}
        <h1 className="text-yellow-300 text-sm sm:text-lg">Entertainment</h1>

        {/* Library Link */}
        <li
          className="hover:bg-gray-600 hover:scale-105 transition-all duration-200 p-3 rounded-lg cursor-pointer flex items-center space-x-4"
          tabIndex={0}
        >
          <FaBook className="h-5 w-5 sm:h-6 sm:w-6" /> {/* Library Icon */}
          <span className="text-sm sm:text-lg">Library</span>
        </li>

        {/* Additional  */}
        <li
          className="hover:bg-gray-600 hover:scale-105 transition-all duration-200 p-3 rounded-lg cursor-pointer flex items-center space-x-4"
          tabIndex={0}
        >
          <FaMusic className="h-5 w-5 sm:h-6 sm:w-6" /> {/* Music Icon */}
          <span className="text-sm sm:text-lg">Music</span>
        </li>
        <li
          className="hover:bg-gray-600 hover:scale-105 transition-all duration-200 p-3 rounded-lg cursor-pointer flex items-center space-x-4"
          tabIndex={0}
        >
          <FaFilm className="h-5 w-5 sm:h-6 sm:w-6" /> {/* Movies Icon */}
          <span className="text-sm sm:text-lg">Movies</span>
        </li>
        <li
          className="hover:bg-gray-600 hover:scale-105 transition-all duration-200 p-3 rounded-lg cursor-pointer flex items-center space-x-4"
          tabIndex={0}
        >
          <FaGamepad className="h-5 w-5 sm:h-6 sm:w-6" /> {/* Gaming Icon */}
          <span className="text-sm sm:text-lg">Gaming</span>
        </li>

        {/* Learning Section Header */}
        <h1 className="text-yellow-300 text-sm sm:text-lg">Learning</h1>

        <li
          className="hover:bg-gray-600 hover:scale-105 transition-all duration-200 p-3 rounded-lg cursor-pointer flex items-center space-x-4"
          tabIndex={0}
        >
          <FaBookReader className="h-5 w-5 sm:h-6 sm:w-6" />{" "}
          {/* Education Icon */}
          <span className="text-sm sm:text-lg">Education</span>
        </li>
        <li
          className="hover:bg-gray-600 hover:scale-105 transition-all duration-200 p-3 rounded-lg cursor-pointer flex items-center space-x-4"
          tabIndex={0}
        >
          <FaHeart className="h-5 w-5 sm:h-6 sm:w-6" /> {/* Lifestyle Icon */}
          <span className="text-sm sm:text-lg">Lifestyle</span>
        </li>
        <li
          className="hover:bg-gray-600 hover:scale-105 transition-all duration-200 p-3 rounded-lg cursor-pointer flex items-center space-x-4"
          tabIndex={0}
        >
          <FaTools className="h-5 w-5 sm:h-6 sm:w-6" /> {/* DIY Icon */}
          <span className="text-sm sm:text-lg">DIY</span>
        </li>
        <li
          className="hover:bg-gray-600 hover:scale-105 transition-all duration-200 p-3 rounded-lg cursor-pointer flex items-center space-x-4"
          tabIndex={0}
        >
          <FaPalette className="h-5 w-5 sm:h-6 sm:w-6" /> {/* Art Icon */}
          <span className="text-sm sm:text-lg">Art</span>
        </li>
        <li
          className="hover:bg-gray-600 hover:scale-105 transition-all duration-200 p-3 rounded-lg cursor-pointer flex items-center space-x-4"
          tabIndex={0}
        >
          <FaBriefcase className="h-5 w-5 sm:h-6 sm:w-6" />{" "}
          {/* Business Icon */}
          <span className="text-sm sm:text-lg">Business</span>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
