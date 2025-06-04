const mongoose = require("mongoose");

const gateLogSchema = new mongoose.Schema({
  driver: String,
  trailer: String,
  unit: String,
  notes: String,
  type: String, // Entry or Exit
  ppe: Boolean,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("GateLog", gateLogSchema);
