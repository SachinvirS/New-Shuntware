// index.js (ESM version)
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import trailerRoutes from "./routes/trailers.js"; // <-- Import trailer routes

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/shuntware", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Optional: Confirm connection
mongoose.connection.on("connected", () => {
  console.log("✅ Connected to MongoDB");
});

// Trailer move schema (for work queue, not trailer DB)
const trailerMoveSchema = new mongoose.Schema({
  trailer: String,
  from: String,
  to: String,
  priority: String,
  requestedBy: String,
  timestamp: { type: Date, default: Date.now }
});

const TrailerMove = mongoose.model("TrailerMove", trailerMoveSchema);

// Routes
app.get("/", (req, res) => {
  res.send("Shuntware backend running!");
});

app.use("/api/trailers", trailerRoutes); // <-- Trailer API wired in

// Start server
app.listen(port, () => {
  console.log(`🚛 Backend running at http://localhost:${port}`);
});
