// index.js (ESM version)
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/shuntware", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const trailerMoveSchema = new mongoose.Schema({
  trailer: String,
  from: String,
  to: String,
  priority: String,
  requestedBy: String,
  timestamp: { type: Date, default: Date.now }
});

const TrailerMove = mongoose.model("TrailerMove", trailerMoveSchema);

app.get("/", (req, res) => {
  res.send("Shuntware backend running!");
});

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});

