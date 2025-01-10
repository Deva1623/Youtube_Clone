import { fetchVideoStart, fetchVideoSuccess, fetchVideoFailure, fetchRecommendedSuccess } from "./videoSlice";

// let's fetch a specific video using its ID
export const fetchVideo = (videoId) => async (dispatch) => {
  dispatch(fetchVideoStart()); // first, we mark the start of the fetching process
  try {
    const response = await fetch(`http://localhost:5555/videos/${videoId}`); // making the request to get the video data
    const data = await response.json(); // parsing the response data
    dispatch(fetchVideoSuccess(data)); // dispatching the action to store the fetched video data
  } catch (error) {
    dispatch(fetchVideoFailure(error.message)); // if something goes wrong, we'll catch the error and dispatch a failure
  }
};

// fetch recommended videos
export const fetchRecommended = () => async (dispatch) => {
  try {
    const response = await fetch("http://localhost:5555/videos"); // sending a request to get recommended videos
    const data = await response.json(); // parsing the list of recommended videos
    dispatch(fetchRecommendedSuccess(data)); // dispatching the action to store the recommended videos
  } catch (error) {
    console.error("Oops, there was an error fetching the recommended videos:", error.message); // log any error that happens
  }
};

// add a new comment to a video
export const addCommentToVideo = (videoId, comment) => async (dispatch) => {
  try {
    const response = await fetch(
      `http://localhost:5555/videos/${videoId}/comments`, // making the request to add a comment to the video
      {
        method: "POST", // using POST to send the new comment
        headers: { "Content-Type": "application/json" }, // setting the content type to JSON
        body: JSON.stringify(comment), // sending the comment data as a stringified JSON
      }
    );
    const newComment = await response.json(); // getting the newly added comment
    dispatch(addComment(newComment)); // dispatching the action to update the store with the new comment
  } catch (error) {
    console.error("Something went wrong while adding the comment:", error.message); // if it fails, we'll log the error
  }
};

// delete a comment from a video
export const deleteCommentFromVideo = (videoId, commentId) => async (dispatch) => {
  try {
    await fetch(
      `http://localhost:5555/videos/${videoId}/comments/${commentId}`, // making the request to delete the comment
      {
        method: "DELETE", // using DELETE to remove the comment
      }
    );
    dispatch(deleteComment(commentId)); // dispatching the action to update the store and remove the comment
  } catch (error) {
    console.error("Oops, there was an error deleting the comment:", error.message); // log any error that happens
  }
};

// edit a comment for a video
export const editCommentForVideo = (videoId, commentId, updatedText) => async (dispatch) => {
  try {
    const response = await fetch(
      `http://localhost:5555/videos/${videoId}/comments/${commentId}`, // sending the request to edit the comment
      {
        method: "PUT", // we're using PUT to update the comment (PATCH could be used for partial updates)
        headers: {
          "Content-Type": "application/json", // setting the content type to JSON
        },
        body: JSON.stringify({ text: updatedText }), // sending the updated comment text
      }
    );

    if (!response.ok) {
      throw new Error("Failed to edit the comment"); // if the response is not OK, throw an error
    }

    const updatedVideo = await response.json(); // expecting the updated video data with the updated comments
    dispatch(
      setVideoData({ video: updatedVideo, comments: updatedVideo.comments }) // updating the Redux store with the new video and comments
    );
  } catch (error) {
    console.error("Something went wrong while editing the comment:", error.message); // logging errors if something goes wrong
  }
};
