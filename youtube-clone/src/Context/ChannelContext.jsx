import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const ChannelContext = createContext();

const ChannelProvider = ({ children }) => {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // function to fetch channel data from the server
  const fetchChannels = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Please sign in.");
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
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch channel data.");
      }

      const data = await response.json();
      setChannels(data.channels || []);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // fetch channels on component mount
  useEffect(() => {
    fetchChannels();
  }, []);

  return (
    <ChannelContext.Provider
      value={{
        channels,
        setChannels,
        loading,
        setLoading,
        error,
        setError,
        fetchChannels,
      }}
    >
      {children}
    </ChannelContext.Provider>
  );
};

export default ChannelProvider;
