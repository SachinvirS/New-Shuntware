import React, { useState } from "react";

export default function GatehouseForm() {
  const [form, setForm] = useState({
    driverName: "",
    trailerNumber: "",
    unitNumber: "",
    notes: "",
    type: "Entry",
    ppe: false,
    currentZone: "ZONE A"
  });
  const [status, setStatus] = useState("");

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await fetch("http://localhost:3001/api/gatehouse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    setStatus(data.message);
    setForm({
      driverName: "",
      trailerNumber: "",
      unitNumber: "",
      notes: "",
      type: "Entry",
      ppe: false,
      currentZone: "ZONE A"
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Gatehouse Entry</h2>
      <form onSubmit={handleSubmit} className="grid gap-2 mb-4">
        <input name="driverName" value={form.driverName} onChange={handleChange} placeholder="Driver Name" className="border p-2" />
        <input name="trailerNumber" value={form.trailerNumber} onChange={handleChange} placeholder="Trailer #" className="border p-2" />
        <input name="unitNumber" value={form.unitNumber} onChange={handleChange} placeholder="Unit #" className="border p-2" />
        <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Notes" className="border p-2" />
        <label><input type="checkbox" name="ppe" checked={form.ppe} onChange={handleChange} /> PPE Checked</label>
        <select name="type" value={form.type} onChange={handleChange} className="border p-2">
          <option value="Entry">Entry</option>
          <option value="Exit">Exit</option>
        </select>
        <select name="currentZone" value={form.currentZone} onChange={handleChange} className="border p-2">
          <option value="ZONE A">ZONE A</option>
          <option value="ZONE A1">ZONE A1</option>
          <option value="ZONE B">ZONE B</option>
          <option value="ZONE C">ZONE C</option>
          <option value="ZONE D">ZONE D</option>
        </select>
        <button className="bg-green-500 text-white px-4 py-2">Submit</button>
      </form>
      {status && <p className="text-sm text-blue-600">{status}</p>}
    </div>
  );
}
