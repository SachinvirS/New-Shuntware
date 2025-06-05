// frontend/src/pages/Gatehouse.jsx
import React, { useState } from "react";
import axios from "axios";

export default function Gatehouse() {
  const [type, setType] = useState("Entry");
  const [form, setForm] = useState({
    driverName: "",
    trailerNumber: "",
    unitNumber: "",
    ppe: "",
    notes: "",
    carrier: "",
    licensePlate: "",
    location: "",
    seal: "",
    currentZone: "ZONE A"
  });

  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
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
        ppe: "",
        notes: "",
        carrier: "",
        licensePlate: "",
        location: "",
        seal: "",
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

      {message && <div className="mb-4 text-blue-700">{message}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="driverName" value={form.driverName} onChange={handleChange} placeholder="Driver Name" className="w-full p-2 border rounded" required />
        <input name="trailerNumber" value={form.trailerNumber} onChange={handleChange} placeholder="Trailer Number" className="w-full p-2 border rounded" required />
        <input name="unitNumber" value={form.unitNumber} onChange={handleChange} placeholder="Unit Number" className="w-full p-2 border rounded" />
        <input name="licensePlate" value={form.licensePlate} onChange={handleChange} placeholder="License Plate" className="w-full p-2 border rounded" />
        <input name="carrier" value={form.carrier} onChange={handleChange} placeholder="Carrier (e.g., UPS, FedEx)" className="w-full p-2 border rounded" />
        <input name="location" value={form.location} onChange={handleChange} placeholder="Location / Dock / Bay #" className="w-full p-2 border rounded" />
        <input name="seal" value={form.seal} onChange={handleChange} placeholder="Seal Number (if any)" className="w-full p-2 border rounded" />
        <input name="ppe" value={form.ppe} onChange={handleChange} placeholder="PPE (e.g., OK, Not OK)" className="w-full p-2 border rounded" />
        <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Notes" rows={3} className="w-full p-2 border rounded" />
        
        <select name="type" value={type} onChange={e => setType(e.target.value)} className="w-full p-2 border rounded" required>
          <option value="Entry">Entry</option>
          <option value="Exit">Exit</option>
        </select>

        <select name="currentZone" value={form.currentZone} onChange={handleChange} className="w-full p-2 border rounded" required>
          <option value="ZONE A">ZONE A</option>
          <option value="ZONE A1">ZONE A1</option>
          <option value="ZONE B">ZONE B</option>
          <option value="ZONE C">ZONE C</option>
          <option value="ZONE D">ZONE D</option>
        </select>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Submit
        </button>
      </form>
    </div>
  );
}
