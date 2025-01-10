import express from "express";
import Users from "../models/userModel.js";
import jwt from "jsonwebtoken";
import Channel from "../models/channelModel.js";

const router = express.Router();

// signup route - this is where users create a new account
router.post("/signup", async (req, res) => {
  const { userName, emailId, password } = req.body;

  try {
    // check if all required fields are present
    if (!userName || !emailId || !password) {
      return res.status(400).json({ message: "some fields are missing" });
    }

    // check if a user already exists with the same email
    const userExist = await Users.findOne({ emailId });
    if (userExist) {
      return res.status(400).json({ message: "user already exists" });
    }

    // create a new user
    const user = new Users({ emailId, userName, password });
    await user.save();

    // send a success message when the user is registered
    return res.status(201).json({ message: "user registered successfully!" });
  } catch (error) {
    console.error("error occurred while registering user:", error);
    // if something goes wrong, send a server error
    return res
      .status(500)
      .json({ message: "error occurred while registering" });
  }
});

// secret key used for signing the jwt token
const secret = "diwakar";

// signin route - this is where users log in
router.post("/signin", async (req, res) => {
  const { emailId, password } = req.body;

  try {
    // check if the required fields are provided
    if (!emailId || !password) {
      return res.status(400).json({ message: "one of the fields is missing" });
    }

    // find the user by email
    const userFound = await Users.findOne({ emailId });
    if (!userFound) {
      return res.status(404).json({ message: "user not found" });
    }
    // check if the provided password is correct
    if (userFound.password !== password) {
      return res.status(401).json({ message: "invalid password" });
    }

    // generate a token for the user after successful login
    const TOKEN = jwt.sign(
      { userName: userFound.userName, emailId: userFound.emailId },
      secret,
      { expiresIn: "1h" }
    );

    // send success response along with the token
    return res.status(200).json({
      message: "login success",
      TOKEN,
    });
  } catch (error) {
    console.error("error during login:", error);
    // handle any unexpected errors
    return res.status(500).json({ message: "internal server error" });
  }
});

// middleware to authenticate the token in requests
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // extracting token from authorization header
  if (!token) return res.status(401).json({ message: "unauthorized" }); // if no token, return unauthorized error

  // verify the token
  jwt.verify(token, "diwakar", (err, user) => {
    if (err) {
      console.error("jwt verification error:", err.message); // log any jwt verification issues
      return res.status(403).json({ message: "forbidden" }); // if token is invalid, return forbidden error
    }
    req.user = user; // store the user info in the request object for future use
    next(); // proceed to the next middleware or route
  });
};

// channel creation route - authenticated users can create a channel
router.post("/channel", authenticateToken, async (req, res) => {
  try {
    const { channelName, description } = req.body; // get the channel name and description
    const username = req.user.userName; // get the username from the token

    // makeing sure both channel name and description are provided
    if (!channelName || !description) {
      return res
        .status(400)
        .json({ message: "channel name and description are required" });
    }

    // find the user by username
    const user = await Users.findOne({ userName: username });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    // create a new channel for the user
    const newChannel = new Channel({
      channelName,
      description,
      owner: username,
    });
    await newChannel.save(); // save the new channel to the database

    // if the user doesn't have any channels yet, initialize an empty array
    if (!user.channel) {
      user.channel = [];
    }

    // add the new channel to the user's list of channels
    user.channel.push(newChannel._id);
    await user.save(); // save the updated user

    // respond with the new channel data
    res
      .status(201)
      .json({ message: "channel created successfully", newChannel });
  } catch (error) {
    console.error("error creating channel:", error);
    // handle errors during channel creation
    res.status(500).json({ message: "error creating channel", error });
  }
});

// route to fetch the channels of a user
router.get("/channel/:username", async (req, res) => {
  try {
    const { username } = req.params; // get the username from the route parameter

    // find the user and populate the channels field with their channels
    const user = await Users.findOne({ userName: username }).populate(
      "channel"
    );
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    // return the user's channels
    res.status(200).json({
      message: "user channels fetched successfully",
      channels: user.channel,
    });
  } catch (error) {
    console.error("error fetching user channels:", error);
    // handle errors when fetching channels
    res.status(500).json({ message: "error fetching channels", error });
  }
});

export default router;
