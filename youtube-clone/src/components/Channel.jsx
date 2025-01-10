import { useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { ChannelContext } from "../Context/ChannelContext";
import { useNavigate } from "react-router-dom";
import SnackBar from "./snackbar";

const Channel = () => {
  const [videoUrl, setVideoUrl] = useState(
    "https://youtu.be/ruYD1CgLmaY?si=4HJtEHY6Lw5pzmWH"
  );
  const [videos, setVideos] = useState([]);
  const [currentlyEditing, setCurrentlyEditing] = useState(null);
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [isValidUrl, setIsValidUrl] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [snackBar, setSnackBar] = useState({
    show: false,
    message: "",
    type: "info",
  });

  const showSnackBar = (message, type = "info") => {
    setSnackBar({ show: true, message, type });
  };

  const [username, setUsername] = useState(null);
  useEffect(() => {
    if (!token) {
      console.log("Token is null or invalid, redirecting to /signin");
      navigate("/signin");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      setUsername(decodedToken.userName);
    } catch (err) {
      console.error("Invalid token:", err.message);
      navigate("/signin"); // redirect to sign-in on invalid token
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchChannel = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("You must be signed in to view this page.");
        setLoading(false);
        return;
      }

      const decodedToken = jwtDecode(token);
      const userName = decodedToken.userName;

      try {
        const response = await fetch(
          `http://localhost:5555/channel/${userName}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, // token for authentication
            },
          }
        );

        if (!response.ok) {
          const errorDetails = await response.text();
          throw new Error(`Failed to fetch channel data: ${errorDetails}`);
        }

        const data = await response.json();

        setChannels(data.channels || []); //fallback to empty array
        setLoading(false);
      } catch (err) {
        console.error("Error fetching channel:", err);
        setError(err.message || "An error occurred.");
        setLoading(false);
      }
    };

    fetchChannel();
  }, []);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch(
          `http://localhost:5555/videos/${username}/videos`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, //  token for authentication
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch videos");
        }

        const data = await response.json();
        console.log("Fetched Videos:", data.videos);
        setVideos(data.videos); // updating state with the fetched videos
      } catch (error) {
        console.error("Error fetching videos:", error.message);
      }
    };

    fetchVideos();
  }, [username]);

  //===================================================================================
  const handleEditClick = (video) => {
    setCurrentlyEditing(video._id); //  current video ID in edit mode
    setNewVideoUrl(video.url); // pouplating the input with the current URL
  };

  const handleCancelEdit = () => {
    setCurrentlyEditing(null); // exiting edit mode
    setNewVideoUrl("");
  };

  const { channels, setChannels, loading, setLoading, error, setError } =
    useContext(ChannelContext);

  const decodeToken = (token) => {
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);

      if (!decoded || typeof decoded !== "object" || !decoded.exp) {
        console.error("Invalid token structure");
        return null;
      }
      return decoded;
    } catch (error) {
      console.error("Error decoding token:", error.message);
      return null;
    }
  };

  const handleAddVideo = async () => {
    if (videoUrl.trim() === "") {
      setIsValidUrl(false);
      showSnackBar("Please provide a YouTube video URL.", "error");
      return;
    }

    // Regex for YouTube URL validation
    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;

    // Validate YouTube URL
    if (!youtubeRegex.test(videoUrl)) {
      setIsValidUrl(false);
      showSnackBar("Invalid YouTube URL. Please check the format.", "error");
      return;
    }

    setIsValidUrl(true);

    // Decode token to extract username
    const decodedToken = jwtDecode(token);
    const username = decodedToken?.userName;

    if (!username) {
      showSnackBar("User not identified. Please log in again.", "error");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5555/videos/${username}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: videoUrl }),
      });

      console.log("Payload:", { url: videoUrl });

      if (!response.ok) {
        const errorDetail = await response.text();
        console.error("Error details:", errorDetail);
        showSnackBar("Token expired or something went wrong.", "error");
        return;
      }

      const data = await response.json();

      setVideos(data.channel.videos); // Update state with the updated videos array
      setVideoUrl(""); // Clear input field
    } catch (error) {
      console.error("Network error:", error.message);
    }
  };

  const handleDeleteVideo = async (videoId) => {
    const wantToDelete = window.confirm(
      "Are you sure You want to delete your video"
    );
    if (!wantToDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5555/videos/${username}/videos/${videoId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete video");
      }

      const data = await response.json();
      console.log("Video deleted successfully:", data);

      setVideos(data.videos); // Update videos state after deletion
    } catch (error) {
      console.error("Error deleting video:", error.message);
    }
  };
  const handleSaveEdit = async (videoId) => {
    try {
      const response = await fetch(
        `http://localhost:5555/videos/${username}/videos/${videoId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ newUrl: newVideoUrl }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update video");
      }

      const data = await response.json();

      setVideos(data.videos); // Update videos state
      setCurrentlyEditing(null); // Exit edit mode
      setNewVideoUrl(""); // Clear input
    } catch (error) {
      console.error("Error updating video:", error.message);
    }
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (channels.length === 0) {
    return <h2>No channels found.</h2>;
  }
  return (
    <div className="w-full bg-gray-100 py-10">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Channel
      </h1>

      <div className="space-y-10">
        {channels.map((channel) => (
          <div
            key={channel._id}
            className="w-full bg-white shadow-lg rounded-lg overflow-hidden"
          >
            {/* Channel Banner */}
            <div className="relative w-full md:w-full h-60">
              <img
                src={channel.channelBanner}
                alt={`${channel.channelName} Banner`}
                className="w-full h-full object-cover"
              />
              <img
                src={channel.channelProfileImage}
                alt={`${channel.channelName} Profile`}
                className="absolute left-10 bottom-[-40px] w-24 h-24 rounded-full border-4 border-white object-cover"
              />
            </div>

            {/* Channel Info Section */}
            <div className="px-10 pt-16 pb-10">
              <div className="flex justify-between items-center mb-6">
                {/* Channel Name & Description */}
                <div>
                  <h2 className="text-md md:text-3xl font-bold text-gray-800">
                    {channel.channelName}
                    <i className="fas fa-check-circle text-blue-500 text-2xl ml-2"></i>
                  </h2>
                  <p className="text-gray-600 text-sm mt-2">
                    {channel.description}
                  </p>
                </div>

                {/* Subscribe Button */}
                <button className="bg-red-600 text-white p-2 md:px-6 md:py-2 rounded-full font-semibold text-lg hover:bg-red-700 transition duration-300">
                  <i className="fas fa-bell"></i> Subscribe
                </button>
              </div>

              {/* Stats Section */}
              <div className="flex gap-10 text-gray-700 text-base">
                <p>
                  <span className="font-bold">{channel.subscribers}</span>{" "}
                  Subscribers
                </p>
                <p>
                  <span className="font-bold">
                    {channel.videos.length || 0}
                  </span>{" "}
                  Videos
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="w-full mt-6">
        <div className="flex border-b border-gray-300 justify-start">
          <button className="py-2 px-4 text-sm md:text-lg font-semibold border-b-4 text-gray-500 hover:text-blue-600 hover:border-blue-500 focus:text-blue-600 focus:border-blue-500">
            Home
          </button>
          <button className="py-2 px-4 text-sm md:text-lg font-semibold text-gray-500 hover:text-blue-600 hover:border-blue-500 focus:text-blue-600 focus:border-blue-500">
            Videos
          </button>
          <button className="py-2 px-4 text-sm md:text-lg font-semibold text-gray-500 hover:text-blue-600 hover:border-blue-500 focus:text-blue-600 focus:border-blue-500">
            Shorts
          </button>
          <button className="py-2 px-4 text-sm md:text-lg font-semibold text-gray-500 hover:text-blue-600 hover:border-blue-500 focus:text-blue-600 focus:border-blue-500">
            Live
          </button>
          <button className="py-2 px-4 text-sm md:text-lg font-semibold text-gray-500 hover:text-blue-600 hover:border-blue-500 focus:text-blue-600 focus:border-blue-500">
            Playlists
          </button>
          <button className="py-2 px-4 text-sm md:text-lg font-semibold text-gray-500 hover:text-blue-600 hover:border-blue-500 focus:text-blue-600 focus:border-blue-500">
            Community
          </button>
        </div>
      </div>

      <hr></hr>

      <div className="flex justify-between">
        <div className="flex flex-col md:flex-row gap-4 ml-5 mt-5 mb-10">
          <button className="bg-gray-500 text-white font-bold p-2 rounded-md">
            Latest
          </button>
          <button className="bg-gray-500 text-white font-bold p-2 rounded-md">
            Popular
          </button>
          <button className="bg-gray-500 text-white font-bold p-2 rounded-md">
            Oldest
          </button>
        </div>

        {/* Upload Video Section */}
        <div className=" mt-5 mb-10 flex flex-col sm:flex-row gap-4 items-center w-1/3">
          <input
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="Add YouTube video URL (https://youtu.be/dVgJPkI18gw?si=IxahxlrXu8GzKYJN)"
            className={`border text-sm rounded p-2 w-full sm:w-3/4 ${
              isValidUrl ? "border-gray-300" : "border-red-500"
            }`}
          />

          <button
            onClick={handleAddVideo}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            <i className="fas fa-upload"></i> Upload
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6  border-4">
        {videos.map((video, index) => {
          // Extract the URL from the video object
          const videoUrl = video.url;

          // Check if the URL exists and is a string
          if (!videoUrl || typeof videoUrl !== "string") {
            console.error("Invalid video URL:", videoUrl);
            return null; // Skip invalid entries
          }

          // Extract video ID from YouTube URL
          const videoId = videoUrl.split("/").pop().split("?")[0];
          const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

          return (
            <>
              <div
                key={index}
                className="bg-white rounded-lg shadow-gray-500 p-4 mt-4 shadow-xl ml-4"
              >
                <iframe
                  width="100%"
                  height="250"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title={`Video ${index + 1}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>

                <p className="text-gray-700 text-sm break-words mb-4 mt-6">
                  Link:{" "}
                  {currentlyEditing === video._id ? (
                    <input
                      type="text"
                      value={newVideoUrl}
                      onChange={(e) => setNewVideoUrl(e.target.value)}
                      className="border border-gray-300 text-sm rounded p-2 w-full"
                    />
                  ) : (
                    <span className="bg-amber-100 text-black p-1 rounded-md ">
                      {video.url}
                    </span>
                  )}
                </p>
                <div className="flex justify-between">
                  {currentlyEditing === video._id ? (
                    <>
                      <button
                        onClick={() => handleSaveEdit(video._id)}
                        className="bg-green-600 text-white px-5 py-1 rounded hover:bg-green-700"
                      >
                        <i className="fas fa-save mr-2"></i>Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-600 text-white px-5 py-1 rounded hover:bg-gray-700"
                      >
                        <i className="fas fa-times mr-2"></i>Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditClick(video)}
                        className="bg-blue-600 text-white px-5 py-1 rounded hover:bg-blue-700"
                      >
                        <i className="fas fa-edit mr-2"></i>Edit
                      </button>
                      <button
                        onClick={() => handleDeleteVideo(video._id)}
                        className="bg-orange-700 text-white px-5 py-1 rounded hover:bg-red-600"
                      >
                        <i className="fas fa-trash mr-2"></i>Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </>
          );
        })}
      </div>

      {snackBar.show && (
        <SnackBar
          className="bottom-5 left-1/2 transform -translate-x-1/2"
          message={snackBar.message}
          type={snackBar.type}
          onClose={() => setSnackBar((prev) => ({ ...prev, show: false }))}
        />
      )}
    </div>
  );
};

export default Channel;
