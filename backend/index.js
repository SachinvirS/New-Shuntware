// backend/index.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import trailerRoutes from "./routes/trailers.js";
import GateLog from "./models/GateLog.js";
import Trailer from "./models/Trailer.js";

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/shuntware", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("✅ Connected to MongoDB");
});

// For storing trailer moves (work queue)
const trailerMoveSchema = new mongoose.Schema({
  trailer: String,
  from: String,
  to: String,
  priority: String,
  requestedBy: String,
  timestamp: { type: Date, default: Date.now }
});

const TrailerMove = mongoose.model("TrailerMove", trailerMoveSchema);

// Basic route
app.get("/", (req, res) => {
  res.send("Shuntware backend running!");
});

// Use modular trailer routes
app.use("/api/trailers", trailerRoutes);

// 🚧 Gatehouse endpoint with trailer sync
app.post("/api/gatehouse", async (req, res) => {
  const {
    driverName,
    trailerNumber,
    unitNumber,
    notes,
    ppe,
    type,
    currentZone
  } = req.body;

  try {
    // Save to GateLog always
    await GateLog.create({
      driverName,
      trailerNumber,
      unitNumber,
      notes,
      ppe,
      type,
      currentZone
    });

    if (type === "Entry") {
      // Avoid duplicate trailers
      const exists = await Trailer.findOne({ trailerNumber });
      if (!exists) {
        await Trailer.create({
          trailerNumber,
          zone: currentZone,
          status: "IN_YARD"
        });
      }
      return res.json({ message: `✅ Trailer ${trailerNumber} added to yard.` });
    } else {
      // Trailer exited
      await Trailer.deleteOne({ trailerNumber });
      return res.json({ message: `🚪 Trailer ${trailerNumber} removed from yard.` });
    }

  } catch (err) {
    console.error("❌ Error in gatehouse route:", err);
    res.status(500).json({ message: "Internal error processing gatehouse entry." });
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚛 Backend running at http://localhost:${port}`);
});
