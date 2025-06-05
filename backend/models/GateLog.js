// backend/models/GateLog.js
import mongoose from "mongoose";

const gateLogSchema = new mongoose.Schema({
  driverName: String,
  ppe: Boolean,
  notes: String,
  vehicleCarrier: String,
  vehiclePlate: String,
  vehicleNumber: String,
  trailerNumber: String,
  trailerCarrier: String,
  trailerCategory: String,
  trailerSize: String,
  trailerProperty: String,
  seal: String,
  trailerComments: String,
  loadAssignment: String,
  billOfLading: String,
  trailerLoadProperty: String,
  trailerLoadComment: String,
  destination: String,
  type: String, // "Entry" or "Exit"
  currentZone: String,
  timestamp: { type: Date, default: Date.now }
});

const GateLog = mongoose.model("GateLog", gateLogSchema);
export default GateLog;
