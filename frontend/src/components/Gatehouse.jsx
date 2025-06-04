// frontend/src/components/Gatehouse.jsx
import React, { useState } from "react";
import axios from "axios";

export default function Gatehouse() {
  const [type, setType] = useState("Entry");
  const [form, setForm] = useState({
    driverName: "",
    trailerNumber: "",
    unitNumber: "",
    notes: "",
    ppe: "",
    currentZone: "ZONE A"
  });

  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3001/api/gatehouse", {
        ...form,
        type
      });
      setMessage(res.data.message);
      setForm({
        driverName: "",
        trailerNumber: "",
        unitNumber: "",
        notes: "",
        ppe: "",
        currentZone: "ZONE A"
      });
    } catch (err) {
      console.error("Gatehouse error", err);
      setMessage("❌ Failed to log gatehouse entry.");
    }
  };

return (
  <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
    <h2 className="text-2xl font-bold mb-4">🚪 Gatehouse Entry / Exit</h2>

    {status && <div className="mb-4 text-green-600">{status}</div>}

    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="driverName"
        value={form.driverName}
        onChange={handleChange}
        placeholder="Driver Name"
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="text"
        name="trailerNumber"
        value={form.trailerNumber}
        onChange={handleChange}
        placeholder="Trailer Number"
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="text"
        name="unitNumber"
        value={form.unitNumber}
        onChange={handleChange}
        placeholder="Unit Number"
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        name="ppe"
        value={form.ppe}
        onChange={handleChange}
        placeholder="PPE Status (e.g., OK)"
        className="w-full p-2 border rounded"
      />
      <textarea
        name="notes"
        value={form.notes}
        onChange={handleChange}
        placeholder="Notes (optional)"
        className="w-full p-2 border rounded"
        rows={3}
      />

      <select
        name="type"
        value={form.type}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      >
        <option value="">Select Type</option>
        <option value="Entry">Entry</option>
        <option value="Exit">Exit</option>
      </select>

      <select
        name="currentZone"
        value={form.currentZone}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      >
        <option value="">Select Zone</option>
        <option value="ZONE A">ZONE A</option>
        <option value="ZONE A1">ZONE A1</option>
        <option value="ZONE B">ZONE B</option>
        <option value="ZONE C">ZONE C</option>
        <option value="ZONE D">ZONE D</option>
      </select>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Submit
      </button>
    </form>
  </div>
);
