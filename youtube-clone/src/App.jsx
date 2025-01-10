import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import { Outlet } from "react-router-dom";
import { VideoProvider } from "./Context/VideoContext";
import ChannelProvider from "./Context/ChannelContext";
function App() {


  

  return (
    <VideoProvider>
    <ChannelProvider>
      <div className="bg-gray-100 min-h-screen">
        <Header />
        <Outlet />
      </div>
    </ChannelProvider>
  </VideoProvider>
  );
}

export default App;
