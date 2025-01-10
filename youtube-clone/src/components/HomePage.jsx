import React, { useState } from "react";
import FilterBar from "./FilterBar";
import VideoCard from "./VideoCard";
import { useContext } from "react";
import { VideoContext } from "../Context/VideoContext";

const HomePage = () => {
  const { filteredVideos } = useContext(VideoContext); // get filtered videos from context

  // define available categories for filtering
  const categories = ["All", "education", "horror", "comedy", "sci-fi"];
  const [selectedCategory, setSelectedCategory] = useState("All"); // manage selected category state

  // filter videos based on selected category
  const displayVideos =
    selectedCategory === "All"
      ? filteredVideos // show all videos if "All" is selected
      : filteredVideos.filter((video) => video.category === selectedCategory); // show videos matching the selected category

  return (
    <section className="min-h-screen">
      {/* filter bar component for selecting categories */}
      <FilterBar
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* grid to display video cards */}
      <div className="ml-10 mr-10 p-4 mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-20 gap-y-12">
        {/* check if there are videos to display */}
        {Array.isArray(displayVideos) && displayVideos.length > 0 ? (
          displayVideos.map((video) => (
            <VideoCard key={video.videoId} video={video} />
          ))
        ) : (
          // message shown when no videos are available
          <p className="text-4xl mt-20">Sorry, No videos available</p>
        )}
      </div>
    </section>
  );
};

export default HomePage;
