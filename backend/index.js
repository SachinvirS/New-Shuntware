const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const TrailerMove = require("./models/TrailerMove");
const GateLog = require("./models/GateLog");

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/shuntware");

app.post("/api/move", async (req, res) => {
  const move = new TrailerMove(req.body);
  await move.save();
  res.json(move);
});

app.get("/api/moves", async (req, res) => {
  const moves = await TrailerMove.find().sort({ timestamp: -1 });
  res.json(moves);
});

app.post("/api/gatehouse", async (req, res) => {
  const log = new GateLog(req.body);
  await log.save();
  res.json(log);
});

app.get("/api/gatehouse", async (req, res) => {
  const logs = await GateLog.find().sort({ timestamp: -1 });
  res.json(logs);
});

app.listen(process.env.PORT || 3001, () => {
  console.log("Backend running on port 3001");
});
