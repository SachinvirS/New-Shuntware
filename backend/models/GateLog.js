// backend/models/GateLog.js
import mongoose from "mongoose";

const gateLogSchema = new mongoose.Schema({
  driverName: String,
  trailerNumber: String,
  unitNumber: String,
  carrier: String,
  licensePlate: String,
  seal: String,
  location: String,
  ppe: String,
  notes: String,
  type: String, // Entry or Exit
  currentZone: String,
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("GateLog", gateLogSchema);
