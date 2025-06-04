import mongoose from "mongoose";

const gateLogSchema = new mongoose.Schema({
  driverName: String,
  trailerNumber: String,
  unitNumber: String,
  notes: String,
  ppe: Boolean,
  type: { type: String, enum: ["Entry", "Exit"] },
  currentZone: String,
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("GateLog", gateLogSchema);
