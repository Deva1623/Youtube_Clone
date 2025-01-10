import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
  channelName: {
    type: String,
    required: true,
    trim: true,
  },
  channelBanner: {
    type: String,
    default:
      "https://img.freepik.com/free-photo/tranquil-summer-sunset-mountain-silhouette-generated-by-ai_188544-19648.jpg", // Default banner if none provided
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  owner: {
    type: String,
    required: true,
  },
  channelProfileImage: {
    type: String,
    default:
      "https://png.pngtree.com/png-clipart/20231019/original/pngtree-user-profile-avatar-png-image_13369989.png", // Default banner if none provided
  },
  subscribers: {
    type: Number,
    default: 0, // default subscriber count is 0
  },
  videos: [
    {
      url: { type: String, required: true },
      uploadedAt: { type: Date, default: Date.now },
    },
  ],
});

const Channel = mongoose.model("Channel", channelSchema);

export default Channel;
