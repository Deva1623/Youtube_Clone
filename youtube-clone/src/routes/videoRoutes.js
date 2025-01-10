import express from "express";
import Video from "../models/videoModel.js"; // Import the Video model
import Channel from "../models/channelModel.js";
import User from "../models/userModel.js";
const router = express.Router();

// GET all videos
router.get("/", async (req, res) => {
  try {
    const videos = await Video.find();
    res.status(200).json(videos); // Return videos as a JSON response
  } catch (err) {
    res.status(500).json({ message: err.message }); // If there's an error, send a 500 status code
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const selectedVideo = await Video.findOne({ videoId: req.params.id });
    if (!selectedVideo) {
      res.status(404).json({ message: "Video not found" });
    }
    res.status(200).json(selectedVideo);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    return;
  }
});

router.get("/recommended", async (req, res) => {
  try {
    const videos = await Video.find({ _id: { $regex: "[02468]$" } }); // Matches IDs ending with an even digit
    res.status(200).json(videos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching recommended videos" });
  }
});

router.post("/:id/comments", async (req, res) => {
  console.log("add comment router hit");
  const { id } = req.params;
  console.log(id);

  const { commentId, userId, text } = req.body; // Comment data from the client

  try {
    const video = await Video.findOne({ videoId: id });
    console.log("video found", video);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // Add the new comment
    const newComment = { commentId, userId, text };
    console.log("newComment", newComment);
    video.comments.push(newComment);
    console.log("pushed");
    // Save the updated video document

    video.markModified("comments");

    await video.save();
    console.log("saved", video.comments);
    res.status(201).json(video.comments);
  } catch (error) {
    res.status(500).json({ message: "Failed to add comment", error });
  }
});

// delete a Comment
router.delete("/:id/comments/:commentId", async (req, res) => {
  const { id, commentId } = req.params;

  try {
    const video = await Video.findOne({ videoId: id });
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // remove the comment by ID
    video.comments = video.comments.filter(
      (comment) => comment.commentId !== commentId
    );

    // Save the updated video document
    await video.save();
    res.status(200).json(video.comments);
  } catch (error) {
    res.status(500).json({ message: "Failed to delete comment", error });
  }
});

// });
router.put("/:id/comments/:commentId", async (req, res) => {
  const { id, commentId } = req.params;
  const { text } = req.body;

  try {
    const video = await Video.findOne({ videoId: id });

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    const comment = video.comments.find(
      (comment) => comment.commentId === commentId
    );
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    comment.text = text; // Update the comment text
    await video.save(); // Save the updated document

    res.status(200).json(video); // Return full video object
  } catch (error) {
    res.status(500).json({ message: "Failed to edit comment", error });
  }
});
//==============================================
router.post("/:username", async (req, res) => {
  console.log("route hit");

  const { username } = req.params;
  console.log("username", username);
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ message: "Video URL is required." });
  }

  try {
    const user = await User.findOne({ userName: username }).populate("channel");
    if (!user || user.channel.length === 0) {
      return res.status(404).json({ message: "User or channel not found." });
    }

    const channel = user.channel[0];
    channel.videos.push({ url });
    await channel.save();

    res.status(200).json({ message: "Video added successfully.", channel });
  } catch (error) {
    console.error("Error adding video:", error);
    res.status(500).json({ message: "Internal server error.", error });
  }
});

router.get("/:username/videos", async (req, res) => {
  const { username } = req.params;

  try {
    // Find the user and populate their channel
    const user = await User.findOne({ userName: username }).populate("channel");

    if (!user || user.channel.length === 0) {
      return res.status(404).json({ message: "User or channel not found." });
    }

    // Get videos from the first channel
    const channel = user.channel[0];
    const videos = channel.videos; // Assuming videos are stored as an array in the channel model

    return res.status(200).json({ videos });
  } catch (error) {
    console.error("Error fetching videos:", error);
    return res.status(500).json({ message: "Internal server error.", error });
  }
});

router.delete("/:username/videos/:videoId", async (req, res) => {
  const { username, videoId } = req.params;

  try {
    // Find the user and their channel
    const user = await User.findOne({ userName: username }).populate("channel");
    if (!user || user.channel.length === 0) {
      return res.status(404).json({ message: "User or channel not found." });
    }

    const channel = user.channel[0];

    // Remove the video by ID
    const videoIndex = channel.videos.findIndex(
      (video) => video._id.toString() === videoId
    );
    if (videoIndex === -1) {
      return res.status(404).json({ message: "Video not found." });
    }

    channel.videos.splice(videoIndex, 1); // Remove the video
    await channel.save(); // Save the updated channel

    return res
      .status(200)
      .json({ message: "Video deleted successfully.", videos: channel.videos });
  } catch (error) {
    console.error("Error deleting video:", error);
    return res.status(500).json({ message: "Internal server error.", error });
  }
});

router.put("/:username/videos/:videoId", async (req, res) => {
  const { username, videoId } = req.params;
  const { newUrl } = req.body; // New video URL

  try {
    // Find the user and their channel
    const user = await User.findOne({ userName: username }).populate("channel");
    if (!user || user.channel.length === 0) {
      return res.status(404).json({ message: "User or channel not found." });
    }

    const channel = user.channel[0];

    // Find the video by ID and update the URL
    const video = channel.videos.find(
      (video) => video._id.toString() === videoId
    );
    if (!video) {
      return res.status(404).json({ message: "Video not found." });
    }

    video.url = newUrl; // Update the video URL
    await channel.save(); // Save the updated channel

    return res
      .status(200)
      .json({ message: "Video updated successfully.", videos: channel.videos });
  } catch (error) {
    console.error("Error updating video:", error);
    return res.status(500).json({ message: "Internal server error.", error });
  }
});

export default router;
