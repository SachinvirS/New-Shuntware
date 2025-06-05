// frontend/src/components/GatehouseForm.jsx
import React, { useState } from "react";
import axios from "axios";

export default function GatehouseForm() {
  const [formData, setFormData] = useState({
    driverName: "",
    trailerNumber: "",
    unitNumber: "",
    currentZone: "",
    doorNumber: "",
    status: "IN_YARD",
    ppe: "",
    type: "Entry",
    reason: "",
    notes: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.trailerNumber || !formData.driverName) {
      return setMessage("🚫 Trailer number and driver name are required.");
    }

    try {
      // Validate for exit: make sure trailer is in yard
      if (formData.type === "Exit") {
        const res = await axios.get(`http://localhost:3001/api/trailers/${formData.trailerNumber}`);
        if (!res.data || res.data.status !== "IN_YARD") {
          return setMessage("❌ Cannot exit — trailer not found in yard.");
        }
      }

      // GateLog entry
      await axios.post("http://localhost:3001/api/gatehouse", formData);

      // Update/create trailer
      if (formData.type === "Entry") {
        await axios.post("http://localhost:3001/api/trailers", formData);
      }

      setMessage(`✅ ${formData.type} recorded for trailer ${formData.trailerNumber}`);
      setFormData({
        driverName: "",
        trailerNumber: "",
        unitNumber: "",
        currentZone: "",
        doorNumber: "",
        status: "IN_YARD",
        ppe: "",
        type: "Entry",
        reason: "",
        notes: ""
      });
    } catch (err) {
      console.error(err);
      setMessage("❌ Error processing gatehouse action.");
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">🚪 Gatehouse Trailer Entry/Exit</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <input name="driverName" value={formData.driverName} onChange={handleChange} placeholder="Driver Name" className="border p-2 rounded" required />
          <input name="trailerNumber" value={formData.trailerNumber} onChange={handleChange} placeholder="Trailer Number" className="border p-2 rounded" required />
          <input name="unitNumber" value={formData.unitNumber} onChange={handleChange} placeholder="Unit Number" className="border p-2 rounded" />
          <input name="currentZone" value={formData.currentZone} onChange={handleChange} placeholder="Zone (e.g., ZONE A)" className="border p-2 rounded" />
          <input name="doorNumber" value={formData.doorNumber} onChange={handleChange} placeholder="Door #" type="number" className="border p-2 rounded" />
          <input name="ppe" value={formData.ppe} onChange={handleChange} placeholder="PPE (e.g., Safety Vest)" className="border p-2 rounded" />
        </div>
        <select name="type" value={formData.type} onChange={handleChange} className="border p-2 rounded w-full">
          <option value="Entry">Entry</option>
          <option value="Exit">Exit</option>
        </select>
        <input name="reason" value={formData.reason} onChange={handleChange} placeholder="Reason for Entry/Exit" className="border p-2 rounded w-full" />
        <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Additional Notes" className="border p-2 rounded w-full" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
      </form>
      {message && <p className="mt-3 text-sm text-gray-800">{message}</p>}
    </div>
  );
}
