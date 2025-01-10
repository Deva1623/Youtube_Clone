import { useState } from "react";
import { useNavigate } from "react-router-dom";

const VideoCard = ({ video }) => {
  const [isPlaying, setIsPlaying] = useState(false); // state to track if the video is playing or not
  const navigate = useNavigate(); // hook to navigate to another route

  // function to handle the play button click
  const handlePlay = () => {
    setIsPlaying(true); // set the video to play
  };

  // function to open the video page when the thumbnail is clicked
  const openVideo = () => {
    navigate(`/videos/${video.videoId}`); // navigate to the video detail page
  };

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg shadow-blue-400 hover:scale-105 duration-200 hover:shadow-purple-400">
      {/* video thumbnail or embed player */}
      <div className="relative w-full aspect-video" onClick={openVideo}>
        {!isPlaying ? (
          <>
            {/* show the video thumbnail with a play button */}
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="w-full h-full object-cover rounded-md cursor-pointer"
            />
            <button
              onClick={handlePlay} // play video on click
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg"
            >
              {/* play button icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-black hover:bg-amber-300 hover:rounded-full"
              >
                <polygon points="5,3 19,12 5,21" />
              </svg>
            </button>
          </>
        ) : (
          // show the embedded video player when the video is playing
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded-md"
            src={`https://www.youtube.com/embed/${video.videoUrl}?autoplay=1`} // embed the video with autoplay enabled
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        )}
      </div>

      {/* video title and uploader info */}
      <h2 className="mt-2 text-lg font-bold">{video.title}</h2>
      <p className="text-sm text-gray-600">{video.uploader}</p>

      <div className="flex gap-2 items-center">
        <p className="text-sm text-gray-500">
          {video.views} <i className="fas fa-eye bg-white text-md"></i> |
        </p>
        <p className="text-sm">
          {new Date(video.uploadDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
    </div>
  );
};

export default VideoCard;
