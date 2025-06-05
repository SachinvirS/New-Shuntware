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
    ppe,
    notes,
    vehicleCarrier,
    vehiclePlate,
    vehicleNumber,
    trailerNumber,
    trailerCarrier,
    trailerCategory,
    trailerSize,
    trailerProperty,
    seal,
    trailerComments,
    loadAssignment,
    billOfLading,
    trailerLoadProperty,
    trailerLoadComment,
    destination,
    type,
    currentZone
  } = req.body;

  try {
    // Log entry/exit in GateLog
    await GateLog.create({
      driverName,
      ppe,
      notes,
      vehicleCarrier,
      vehiclePlate,
      vehicleNumber,
      trailerNumber,
      trailerCarrier,
      trailerCategory,
      trailerSize,
      trailerProperty,
      seal,
      trailerComments,
      loadAssignment,
      billOfLading,
      trailerLoadProperty,
      trailerLoadComment,
      destination,
      type,
      currentZone
    });

    if (type === "Entry") {
      const existing = await Trailer.findOne({ trailerNumber });

      if (!existing) {
        await Trailer.create({
          trailerNumber,
          unitNumber: vehicleNumber,
          driverName,
          currentZone,
          doorNumber: null,
          status: "IN_YARD",
          comments: [trailerComments],
          history: [{
            type: "Entered",
            from: "Gate",
            to: currentZone
          }]
        });
      }

      return res.json({ message: `✅ Trailer ${trailerNumber} entered yard.` });
    } else {
      // Exit logic: only allow if trailer is already in yard
      const existing = await Trailer.findOne({ trailerNumber });

      if (!existing) {
        return res.status(400).json({ message: `❌ Trailer ${trailerNumber} is not currently in yard.` });
      }

      await Trailer.deleteOne({ trailerNumber });
      return res.json({ message: `🚪 Trailer ${trailerNumber} exited yard.` });
    }

  } catch (err) {
    console.error("❌ Error in gatehouse route:", err);
    res.status(500).json({ message: "Internal error processing gatehouse operation." });
  }
});

app.get("/api/gatelogs", async (req, res) => {
  try {
    const logs = await GateLog.find().sort({ timestamp: -1 }).limit(100); // limit to recent 100
    res.json(logs);
  } catch (err) {
    console.error("❌ Failed to fetch gate logs:", err);
    res.status(500).json({ message: "Internal error loading logs." });
  }
});

// GET all shunt moves
app.get("/api/shuntmoves", async (req, res) => {
  try {
    const moves = await TrailerMove.find().sort({ timestamp: -1 }).limit(100);
    res.json(moves);
  } catch (err) {
    console.error("Failed to fetch shunt moves", err);
    res.status(500).json({ message: "Internal error" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚛 Backend running at http://localhost:${port}`);
});

// ✅ Shunt move logger (auto-created when trailer is dragged)
app.post("/api/shuntmove", async (req, res) => {
  const { trailer, from, to, requestedBy, priority } = req.body;

  try {
    const move = new TrailerMove({
      trailer,
      from,
      to,
      requestedBy,
      priority: priority || "NORMAL"
    });

    await move.save();
    res.status(201).json({ message: "Shunt move created", move });
  } catch (err) {
    console.error("Failed to create shunt move", err);
    res.status(500).json({ message: "Error creating move" });
  }
});
