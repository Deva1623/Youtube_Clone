import React, { createContext, useState, useEffect } from "react";

// create context
export const VideoContext = createContext();

// provider component
export const VideoProvider = ({ children }) => {
  const [videos, setVideos] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch("http://localhost:5555/videos");
        const data = await response.json();
        setVideos(data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };
    fetchVideos();
  }, []);

  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <VideoContext.Provider value={{ videos, filteredVideos, setSearchText }}>
      {children}
    </VideoContext.Provider>
  );
};
