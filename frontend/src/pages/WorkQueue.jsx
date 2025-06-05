// frontend/src/pages/WorkQueue.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function WorkQueue() {
  const [moves, setMoves] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/api/shuntmoves")
      .then(res => setMoves(res.data))
      .catch(err => console.error("Error fetching moves", err));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🚚 Shunt Move Queue</h2>
      <table className="w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Time</th>
            <th className="p-2 border">Trailer</th>
            <th className="p-2 border">From</th>
            <th className="p-2 border">To</th>
            <th className="p-2 border">Priority</th>
            <th className="p-2 border">Requested By</th>
          </tr>
        </thead>
        <tbody>
          {moves.map((move, i) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="p-2 border">{new Date(move.timestamp).toLocaleString()}</td>
              <td className="p-2 border">{move.trailer}</td>
              <td className="p-2 border">{move.from}</td>
              <td className="p-2 border">{move.to}</td>
              <td className={`p-2 border ${move.priority === 'URGENT' ? 'text-red-600 font-bold' : ''}`}>
                {move.priority || "NORMAL"}
              </td>
              <td className="p-2 border">{move.requestedBy || "System"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
