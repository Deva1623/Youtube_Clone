import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setLoading,
  setVideoData,
  setRecommendedVideos,
  setError,
} from "../redux-store/videoSlice"; // import actions
import SnackBar from "./snackbar";

const VideoPage = () => {
  const { id } = useParams(); // extract videoId from the URL
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [newComment, setNewComment] = useState(""); // state for new comment
  const [editingCommentId, setEditingCommentId] = useState(null); // state for comment being edited
  const [editedCommentText, setEditedCommentText] = useState(""); // state for edited comment text

  // access redux state for video data, comments, etc.
  const { video, comments, recommended, loading, error } = useSelector(
    (state) => state.video
  );

  const token = localStorage.getItem("authToken");
  let loggedInUser = "";

  // decode token to extract user information
  if (token) {
    const decodedToken = jwt_decode(token);
    loggedInUser = decodedToken.username;
  }

  const [snackBar, setSnackBar] = useState({
    show: false,
    message: "",
    type: "info",
  });

  // function to display snackbar with message and type
  const showSnackBar = (message, type = "info") => {
    setSnackBar({ show: true, message, type });
  };

  // navigate to another video when recommended video is clicked
  const openVideo = (videoId) => {
    console.log("video id from recommended", videoId);
    navigate(`/videos/${videoId}`);
    console.log("navigating");
  };

  // fetch video data from API when the component is mounted or video id changes
  useEffect(() => {
    const fetchVideo = async () => {
      dispatch(setLoading(true)); // set loading state to true
      try {
        const response = await fetch(`http://localhost:5555/videos/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch video");
        }
        const data = await response.json();
        dispatch(setVideoData({ video: data, comments: data.comments || [] }));
      } catch (err) {
        dispatch(setError(err.message));
      } finally {
        dispatch(setLoading(false)); // set loading state to false
      }
    };

    fetchVideo();
  }, [id, dispatch]);

  // fetch recommended videos
  useEffect(() => {
    const fetchRecommendedVideos = async () => {
      try {
        const response = await fetch("http://localhost:5555/videos");
        if (!response.ok) {
          throw new Error("Failed to fetch recommended videos");
        }
        const data = await response.json();
        dispatch(setRecommendedVideos(data)); // update recommended videos in redux
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchRecommendedVideos();
  }, [dispatch]);

  // handle loading, error, and video display
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!video) {
    return <div>Video not found!</div>;
  }

  // decode JWT token for extracting payload data
  const decodeToken = (token) => {
    if (!token) return null;
    try {
      const payloadPart = JSON.parse(atob(token.split(".")[1])); // decode JWT payload
      return payloadPart;
    } catch (error) {
      console.error("Invalid token:", error.message);
      return null;
    }
  };

  //=========================================================
  // handle adding a new comment
  const handleAddComment = async () => {
    console.log("sending comment with video id:", id);

    if (newComment.trim()) {
      const token = localStorage.getItem("token"); // get token from local storage
      const decodedToken = decodeToken(token);

      const newCommentData = {
        commentId: Date.now().toString(), // generate unique comment ID
        userId: decodedToken?.userName || "Anonymous", // extract userName from token or fallback
        text: newComment,
      };

      console.log(newCommentData);

      const response = await fetch(
        `http://localhost:5555/videos/${id}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newCommentData),
        }
      );

      if (!response.ok) {
        showSnackBar("something went wrong or token expired", "warning");
        throw new Error("Failed to add comment");
      }

      const updatedComments = await response.json();
      console.log("comments", updatedComments);

      dispatch(setVideoData({ video, comments: updatedComments })); // update redux store with new comments
      setNewComment(""); // clear the textarea
      showSnackBar("Comment added.", "success");
    }
  };

  // handle deleting a comment
  const handleDeleteComment = async (commentId) => {
    const wannaDelete = window.confirm(
      "Are you sure you want to delete this comment?"
    );

    if (!wannaDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5555/videos/${id}/comments/${commentId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorDetails = await response.json();
        console.error("Error details:", errorDetails);
        throw new Error("Failed to delete comment");
      }

      const updatedComments = await response.json();
      dispatch(setVideoData({ video, comments: updatedComments })); // update redux store with updated comments
      showSnackBar("Comment deleted.", "info");
    } catch (err) {
      console.error(err.message);
    }
  };

  // handle editing a comment
  const handleEditComment = async (commentId, updatedText) => {
    try {
      if (!updatedText || updatedText.trim() === "") {
        console.log("empty text not allowed");
        return;
      }

      const response = await fetch(
        `http://localhost:5555/videos/${id}/comments/${commentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: updatedText }),
        }
      );

      if (!response.ok) {
        const errorDetails = await response.json();
        console.error("Error details:", errorDetails);
        throw new Error("Failed to edit comment");
      }

      const updatedVideo = await response.json(); // full video object from backend
      dispatch(
        setVideoData({ video: updatedVideo, comments: updatedVideo.comments })
      ); // update redux with edited comments
      setEditingCommentId(null);
      setEditedCommentText("");
      showSnackBar("Comment Edited.", "info");
    } catch (err) {
      showSnackBar("Something went wrong please re-login.", "error");
      console.error("Error editing comment:", err.message);
    }
  };

  return (
    <div className="flex flex-col md:flex-row mt-20">
      {/* Main Content Section */}
      <div className="w-full md:w-2/3 p-4">
        {/* Video Player */}
        <iframe
          src={`https://www.youtube.com/embed/${video.videoUrl}`}
          title={video.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-68 md:h-96"
        ></iframe>

        {/* Video Details */}
        <h1 className="text-2xl font-bold mt-4">{video.title}</h1>
        <p className="mt-2 flex items-center space-x-4">
          <span className="font-bold">Channel:</span> {video.uploader}
          <button className="bg-gray-600 text-white rounded-full px-4 py-2 hover:bg-gray-800">
            Subscribe
          </button>
          <button className="flex items-center justify-center p-4 gap-2 bg-gray-200 rounded-full text-gray-700 hover:bg-gray-300">
            <i className="fas fa-thumbs-up text-blue-400"></i>
            {video.likes}
          </button>
          <button className="flex items-center justify-center p-4 gap-2 bg-gray-200 rounded-full text-gray-700 hover:bg-gray-300">
            <i className="fas fa-thumbs-down text-orange-400"></i>
            {video.dislikes}
          </button>
        </p>
        <p className="mt-2">
          <span className="font-bold">Views:</span> {video.views}
          <i className="fas fa-eye ml-1 mb-2"></i>
        </p>

        {/* Video Description */}
        <div className="border-4 border-gray-200 h-32 shadow-lg shadow-gray-400">
          <h2 className="bg-amber-200 rounded-md font-bold">Description:</h2>
          <p className="text-gray-700 mt-2 text-lg">{video.description}</p>
        </div>

        {/* Comments Section */}
        <div className="border-4 w-full h-auto mt-4">
          <h2 className="text-white font-bold pl-2 py-2 bg-blue-600">
            Comments
          </h2>

          {/* Add Comment */}
          <div className="flex flex-col p-4 border-b-4">
            <textarea
              className="w-full p-2 border-2 border-gray-400 rounded resize-none"
              rows="2"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            ></textarea>
            <button
              onClick={handleAddComment}
              className="mt-2 bg-green-700 hover:bg-purple-500 text-white px-4 py-2 rounded w-56"
            >
              Add Comment
            </button>
          </div>

          {/* List of Comments */}
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.commentId} className="mb-4 p-2 border-b-4">
                <p className="font-bold">{comment.userId}</p>
                <div className="flex justify-between items-center">
                  <p className="text-gray-700 flex-grow  overflow-x-auto mr-4 ">
                    {comment.text}
                  </p>
                  <div className="flex space-x-2">
                    {/* Edit Comment */}
                    {editingCommentId === comment.commentId ? (
                      <>
                        <textarea
                          className="w-56 h-20  p-2 border rounded resize-none"
                          rows="1"
                          value={editedCommentText}
                          onChange={(e) => setEditedCommentText(e.target.value)}
                          onBlur={() => {
                            if (!editedCommentText.trim()) {
                              setEditingCommentId(null); // Exit edit mode if no changes are made
                              setEditedCommentText("");
                            }
                          }}
                          autoFocus
                        ></textarea>
                        <button
                          onClick={() =>
                            handleEditComment(
                              comment.commentId,
                              editedCommentText
                            )
                          }
                          className="text-white bg-teal-600 px-4 py-2 rounded-md"
                        >
                          Save
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingCommentId(comment.commentId);
                          setEditedCommentText(comment.text);
                        }}
                        className="text-white bg-purple-700 hover:bg-purple-500 px-4 py-2 rounded-md"
                      >
                        <i className="fas fa-pencil-alt"></i> Edit
                      </button>
                    )}
                    {/* Delete Comment */}
                    <button
                      onClick={() => handleDeleteComment(comment.commentId)}
                      className="text-white bg-red-500 hover:bg-pink-400  px-4 py-2 rounded-md"
                    >
                      <i className="fas fa-trash-alt"></i> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <h1 className="text-gray-500 text-center mt-4">
              No comments yet...
            </h1>
          )}
        </div>
      </div>

      {/* Recommended Videos Section */}
      <div className="w-full md:w-1/3 p-4 bg-gray-100 overflow-y-auto h-screen sticky top-0">
        <h2 className="font-bold text-lg mb-4">Recommended Videos</h2>
        {recommended.length > 0 ? (
          recommended.map((video) => (
            <div
              onClick={() => openVideo(video.videoId)}
              key={video.id}
              className="mb-4 flex items-start cursor-pointer hover:bg-gray-200 p-2 rounded"
            >
              <img
                src={video.thumbnailUrl}
                alt={`${video.title} Thumbnail`}
                className="w-32 h-22 object-cover mr-4 rounded"
              />
              <div>
                <h3 className="text-sm font-medium">{video.title}</h3>
                <p className="text-xs text-gray-600">
                  Channel: {video.uploader}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No recommended videos available.</p>
        )}
      </div>

      {/* SnackBar */}
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

export default VideoPage;
