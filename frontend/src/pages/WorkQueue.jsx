import React, { useState, useEffect } from "react";

export default function WorkQueue() {
  const [moves, setMoves] = useState([]);
  const [form, setForm] = useState({ trailer: "", from: "", to: "", priority: "NORMAL", requestedBy: "" });

  useEffect(() => {
    fetch("http://localhost:3001/api/moves")
      .then(res => res.json())
      .then(setMoves);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:3001/api/move", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const saved = await res.json();
    setMoves([saved, ...moves]);
    setForm({ trailer: "", from: "", to: "", priority: "NORMAL", requestedBy: "" });
  };

  const colors = {
    EMERGENCY: "bg-red-200",
    HIGH: "bg-yellow-200",
    NORMAL: "bg-green-100"
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Work Queue</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 max-w-2xl mb-6">
        <input name="trailer" value={form.trailer} onChange={handleChange} placeholder="Trailer #" className="p-2 border" required />
        <input name="from" value={form.from} onChange={handleChange} placeholder="From" className="p-2 border" required />
        <input name="to" value={form.to} onChange={handleChange} placeholder="To" className="p-2 border" required />
        <input name="requestedBy" value={form.requestedBy} onChange={handleChange} placeholder="Requested By" className="p-2 border" />
        <select name="priority" value={form.priority} onChange={handleChange} className="p-2 border">
          <option value="NORMAL">Normal</option>
          <option value="HIGH">High</option>
          <option value="EMERGENCY">Emergency</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 col-span-2">Submit Move</button>
      </form>
      <div className="space-y-2">
        {moves.map((move, idx) => (
          <div key={idx} className={`p-3 rounded border ${colors[move.priority]}`}>
            <strong>{move.trailer}</strong>: {move.from} → {move.to}  
            <br /><small>{move.priority} — Requested by {move.requestedBy}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
