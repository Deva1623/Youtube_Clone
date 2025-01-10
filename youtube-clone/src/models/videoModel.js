import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    commentId: { type: String, required: true },
    userId: { type: String, required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const videoSchema = new mongoose.Schema({
  videoId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  thumbnailUrl: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  channelId: { type: String, required: true },
  uploader: { type: String, required: true },
  views: { type: Number, required: true },
  likes: { type: Number, required: true },
  dislikes: { type: Number, required: true },
  uploadDate: { type: Date, required: true },

  comments: [commentSchema],
});

const Video = mongoose.model("Video", videoSchema);

export default Video;
