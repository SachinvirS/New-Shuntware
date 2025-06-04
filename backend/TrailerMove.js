const mongoose = require("mongoose");

const trailerMoveSchema = new mongoose.Schema({
  trailer: String,
  from: String,
  to: String,
  priority: String,
  requestedBy: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("TrailerMove", trailerMoveSchema);
