// frontend/src/pages/GateLogViewer.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function GateLogViewer() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/api/gatelogs")
      .then(res => setLogs(res.data))
      .catch(err => console.error("Failed to load gate logs", err));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📋 Gatehouse Log Viewer</h2>
      <div className="overflow-auto">
        <table className="w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Time</th>
              <th className="p-2 border">Type</th>
              <th className="p-2 border">Driver</th>
              <th className="p-2 border">Trailer</th>
              <th className="p-2 border">Unit</th>
              <th className="p-2 border">Zone</th>
              <th className="p-2 border">PPE</th>
              <th className="p-2 border">Notes</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="p-2 border">{new Date(log.timestamp).toLocaleString()}</td>
                <td className="p-2 border">{log.type}</td>
                <td className="p-2 border">{log.driverName}</td>
                <td className="p-2 border">{log.trailerNumber}</td>
                <td className="p-2 border">{log.unitNumber}</td>
                <td className="p-2 border">{log.currentZone}</td>
                <td className="p-2 border">{log.ppe}</td>
                <td className="p-2 border">{log.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
