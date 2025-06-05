// backend/routes/trailers.js
import express from "express";
import Trailer from "../models/Trailer.js";

const router = express.Router();

// Create or update trailer
router.post("/", async (req, res) => {
  const { trailerNumber, unitNumber, driverName, currentZone, doorNumber, status } = req.body;
  try {
    let trailer = await Trailer.findOne({ trailerNumber });

    if (trailer) {
      trailer.unitNumber = unitNumber;
      trailer.driverName = driverName;
      trailer.currentZone = currentZone;
      trailer.doorNumber = doorNumber;
      trailer.status = status;
      trailer.history.push({ type: "Update", from: trailer.currentZone, to: currentZone });
      await trailer.save();
    } else {
      trailer = new Trailer({
        trailerNumber,
        unitNumber,
        driverName,
        currentZone,
        doorNumber,
        status,
        history: [{ type: "Entered", from: "Gate", to: currentZone }]
      });
      await trailer.save();
    }

    res.status(200).json(trailer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all trailers
router.get("/", async (req, res) => {
  try {
    const trailers = await Trailer.find();
    res.json(trailers);
  } catch (err) {
    res.status(500).json({ message: "Error loading trailers" });
  }
});

// Get single trailer
router.get("/:trailerNumber", async (req, res) => {
  try {
    const trailer = await Trailer.findOne({ trailerNumber: req.params.trailerNumber });
    if (!trailer) return res.status(404).send("Not found");
    res.json(trailer);
  } catch (err) {
    res.status(500).json({ message: "Error fetching trailer" });
  }
});

export default router;
