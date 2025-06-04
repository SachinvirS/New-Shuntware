import React, { useState, useEffect } from "react";

export default function Gatehouse() {
  const [form, setForm] = useState({ driver: "", trailer: "", unit: "", notes: "", type: "Entry", ppe: false });
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/gatehouse")
      .then(res => res.json())
      .then(setLogs);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:3001/api/gatehouse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const saved = await res.json();
    setLogs([saved, ...logs]);
    setForm({ driver: "", trailer: "", unit: "", notes: "", type: "Entry", ppe: false });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Gatehouse Entry</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 max-w-2xl mb-6">
        <input name="driver" value={form.driver} onChange={handleChange} placeholder="Driver Name" className="p-2 border" required />
        <input name="trailer" value={form.trailer} onChange={handleChange} placeholder="Trailer #" className="p-2 border" required />
        <input name="unit" value={form.unit} onChange={handleChange} placeholder="Unit #" className="p-2 border" />
        <select name="type" value={form.type} onChange={handleChange} className="p-2 border">
          <option>Entry</option>
          <option>Exit</option>
        </select>
        <label className="col-span-2">
          <input type="checkbox" name="ppe" checked={form.ppe} onChange={handleChange} /> PPE Checked
        </label>
        <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Notes" className="p-2 border col-span-2" />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 col-span-2">Submit</button>
      </form>
      <div className="space-y-2">
        {logs.map((log, idx) => (
          <div key={idx} className="border p-3 rounded bg-gray-100">
            <strong>{log.type}</strong> - {log.driver} - Trailer {log.trailer} - Unit {log.unit} - {log.ppe ? "✅ PPE" : "❌ No PPE"}<br />
            <small>{new Date(log.timestamp).toLocaleString()} — {log.notes}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
