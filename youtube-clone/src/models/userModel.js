import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  emailId: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  channel: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
    },
  ],
});

const Users = mongoose.model("Users", userSchema);
export default Users;
