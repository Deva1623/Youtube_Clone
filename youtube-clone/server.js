import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import videoRoutes from './src/routes/videoRoutes.js'; // Import video routes
import userRoutes from './src/routes/userRoutes.js'; // Import user routes

const app = express();
const port = 5555;
const mongoUrl = 'mongodb://localhost:27017/YoutubeClone';


app.use(express.json());

app.use(express.json()); // For parsing JSON bodies
app.use(cors({ origin: 'http://localhost:5173', credentials: true })); // Enable CORS
app.use(cors());



app.options("*", cors());

// app.use(cors({
//   origin: 'http://localhost:5173', // Your frontend URL
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));


mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

app.use('/videos', videoRoutes); // Use the routes defined in src/routes/videoRoutes.js

app.use('/', userRoutes);



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
