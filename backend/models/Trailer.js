// backend/models/Trailer.js
import mongoose from "mongoose";

const trailerSchema = new mongoose.Schema({
  trailerNumber: { type: String, required: true, unique: true },
  unitNumber: String,
  driverName: String,
  currentZone: String,      // e.g., "ZONE A", "ZONE C"
  doorNumber: Number,       // optional: if parked at a specific door
  status: String,           // e.g., "Available", "Needs Move", "Assigned"
  comments: [String],
  history: [
    {
      type: String,         // e.g., "Entered", "Moved", "Exited"
      from: String,
      to: String,
      timestamp: { type: Date, default: Date.now }
    }
  ]
});

const Trailer = mongoose.model("Trailer", trailerSchema);

export default Trailer;
