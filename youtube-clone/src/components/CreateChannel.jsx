import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ChannelContext } from "../Context/ChannelContext";
import SnackBar from "./snackbar";

const CreateChannel = () => {
  // states for channel name and description
  const [channelName, setChannelName] = useState("");
  const [description, setDescription] = useState("");

  // fetching context values for existing channels and loading status
  const { channels, loading } = useContext(ChannelContext);

  // navigate function for redirection
  const navigate = useNavigate();

  useEffect(() => {
    // check if user already has a channel
    if (!loading && channels.length > 0) {
      alert("you already have a channel! redirecting to your channel...");
      navigate(`/channel/${channels[0]._id}`); // redirecting to the first channel
    }
  }, [channels, loading, navigate]);

  // state for managing snackbar visibility and messages
  const [snackBar, setSnackBar] = useState({
    show: false,
    message: "",
    type: "info",
  });

  // function to show snackbar with a message and type
  const showSnackBar = (message, type = "info") => {
    setSnackBar({ show: true, message, type });
  };

  // function to decode jwt token
  const decodeToken = (token) => {
    if (!token) return null; // return null if token is missing
    try {
      const payloadPart = JSON.parse(atob(token.split(".")[1])); // decode token
      return payloadPart;
    } catch (error) {
      console.error("decode token error:", error);
      return null;
    }
  };

  // handles channel creation
  const handleCreateChannel = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    // check if user is signed in
    if (!token) {
      alert("you must be signed in to create a channel!");
      navigate("/signin");
      return;
    }

    const user = decodeToken(token); // decode the token for user details

    // validate decoded user
    if (!user) {
      alert("invalid user token!");
      return;
    }

    // prepare channel data for the request
    const channelData = {
      channelName: channelName,
      description: description,
    };

    try {
      const response = await fetch("http://localhost:5555/channel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // attach user token
        },
        body: JSON.stringify(channelData), // send channel data
      });

      console.log("raw response:", response);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "unable to create channel");
      }

      const data = await response.json();
      showSnackBar("channel created successfully, redirecting.....", "success");

      // redirect to the user's channel after a short delay
      setTimeout(() => {
        navigate(`/channel/${user.userName}`);
      }, 2000);
    } catch (error) {
      console.error("error creating channel:", error);
      alert("failed to create channel.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-amber-100">
      <div className="container flex flex-col lg:flex-row items-center justify-center max-w-5xl px-8 py-10 bg-white rounded-xl shadow-xl">
        {/* left section - image */}
        <div className="w-full lg:w-1/2">
          <img
            src="https://www.indidigital.in/wp-content/uploads/2024/11/youtube-channel-engagement-tips_indidigital.jpg"
            alt="channel engagement"
            className="rounded-lg shadow-md"
          />
        </div>

        {/* right section - form */}
        <div className="w-full lg:w-1/2 p-10">
          <h1 className="text-4xl font-bold mb-8 text-center lg:text-left text-gray-800">
            create your channel
          </h1>
          <form onSubmit={handleCreateChannel} className="flex flex-col gap-6">
            <input
              type="text"
              placeholder="give your channel a name"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              className="border border-gray-300 rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
            />
            <textarea
              placeholder="channel description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-gray-300 rounded-md p-4 h-40 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
            />
            <button
              type="submit"
              className="bg-purple-500 text-white px-6 py-3 rounded-md hover:bg-purple-600 transition duration-200 text-lg"
            >
              create channel
            </button>
          </form>
        </div>
      </div>

      {/* snackbar component */}
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

export default CreateChannel;
