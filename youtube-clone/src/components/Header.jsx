import React, { useContext, useState, useEffect } from "react";
import {FaRegUserCircle,FaSearch,FaSignOutAlt,FaPlus,} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { VideoContext } from "../Context/VideoContext";
import { useLocation } from "react-router-dom";
import { ChannelContext } from "../Context/ChannelContext";

const Header = () => {
  const { channels } = useContext(ChannelContext);

  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const { setSearchText } = useContext(VideoContext);
  const [currentSearch, setCurrentSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    setSearchText(currentSearch);
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isChannelPage = location.pathname.startsWith("/channel");

  // Decoding JWT token with error handling
  const decodeToken = (token) => {
    if (!token) return null;
    try {
      const payloadPart = JSON.parse(atob(token.split(".")[1])); //  JWT payload
      return payloadPart;
    } catch (error) {
      return null;
    }
  };

  const token = localStorage.getItem("token");
  const [user, setUser] = useState(null);

  //  useEffect to handle token decoding only once
  useEffect(() => {
    if (token) {
      const decodedUser = decodeToken(token);
      setUser(decodedUser);
    }
  }, [token]); // only run when token changes

  return (
    <header className=" bg-gray-800 text-white p-4 flex flex-col  items-start gap-4 md:flex-row   md:items-center justify-between fixed top-0 left-0 w-full z-50">
      <button
        onClick={toggleSidebar}
        className="font-sm md:text-xl font-bold flex items-center gap-5"
      >
        ☰{" "}
        <img
          src="https://cdn-icons-png.flaticon.com/256/48/48968.png"
          className="bg-white h-8 w-8 md:h-12 md:w-12 rounded-md p-2"
          alt="logo"
        />
        VIEWTUBE
      </button>

      {isHomePage && (
        <div className="w-72 md:w-96 bg- absolute top-36 left-1/2 transform -translate-x-1/2 flex items-center gap-2 p-4 bg-transparent z-10">
          <input
            type="text"
            placeholder="Search your videos"
            value={currentSearch}
            onChange={(e) => setCurrentSearch(e.target.value)}
            className="w-full p-2 focus:border-yellow-400 focus:mr-6 focus:bg-white focus:scale-125 duration-300 ease-in-out rounded-md text-gray-900 bg-transparent border-4 border-gray-300 focus:outline-none"
          />
          <button
            onClick={handleSearch}
            className="bg-transparent  bg-black p-3 rounded-md hover:bg-amber-200 transition duration-300"
          >
            <FaSearch className="text-black text-xl" />
          </button>
        </div>
      )}

      {user && (
        <div className="hover:bg-gray-700 p-1 md:px-2 rounded-md shadow-xl bg-black">
          <h1 className=" font-mono uppercase text-amber-200">
            Welcome {user.userName}
          </h1>
        </div>
      )}

      {token && (
        <button
          className=" text-sm md:text-lg flex items-center gap-2 absolute opacity-70 top-20 right-16 md:right-8 md:top-72  text-white font-bold z-50 bg-purple-700  p-2 rounded-md"
          onClick={() => {
            navigate("/signin");
            localStorage.removeItem("token");
            window.location.reload();
          }}
        >
          <FaSignOutAlt className="text-lg" />
          Logout
        </button>
      )}

      {token && (
        <div className="absolute right-4 md:right-6 md:top-56 z-50">
          {channels?.length > 0 ? (
            // Hide "Go to Your Channel" button if the current page is a channel page
            !isChannelPage && (
              <Link
                to={`/channel/${channels[0]._id}`}
                className="text-sm md:text-lg flex items-center gap-2 text-white font-bold bg-blue-600 hover:bg-blue-500 opacity-70 p-2 rounded-md"
              >
                <FaPlus className="text-lg" />
                Go to Your Channel
              </Link>
            )
          ) : (
            // Show "Create Your Channel" button everywhere if no channels exist
            <Link
              to="/channel"
              className="text-lg flex items-center gap-2 text-white font-bold  bg-green-600 hover:bg-green-500 opacity-70 p-2 rounded-md"
            >
              <FaPlus className="text-lg" />
              Create Your Channel
            </Link>
          )}
        </div>
      )}

      {!token && (
        <div className="flex items-center ml-auto mr-4">
          <Link to="/signin" className="text-lg">
            <FaRegUserCircle className="text-2xl hover:text-yellow-200" />
          </Link>
        </div>
      )}
      <div className="flex items-center gap-4">
        <Link>
          <i className="fas fa-heart text-xl hover:text-yellow-200"></i>
        </Link>
        <Link to="/">
          <i className="fas fa-home text-xl hover:text-yellow-200"></i>
        </Link>
        <Link>
          <i className="fas fa-cog text-xl hover:text-yellow-200"></i>
        </Link>
      </div>

      <Sidebar isVisible={isSidebarVisible} />
    </header>
  );
};

export default Header;
