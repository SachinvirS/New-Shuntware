// frontend/src/pages/GateLogViewer.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function GateLogViewer() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/gatelogs");
      setLogs(res.data);
    } catch (err) {
      console.error("Failed to fetch gate logs", err);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">📋 Gatehouse Entry/Exit Logs</h2>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border px-3 py-2">Time</th>
              <th className="border px-3 py-2">Driver</th>
              <th className="border px-3 py-2">Trailer</th>
              <th className="border px-3 py-2">Unit</th>
              <th className="border px-3 py-2">PPE</th>
              <th className="border px-3 py-2">Type</th>
              <th className="border px-3 py-2">Zone</th>
              <th className="border px-3 py-2">Notes</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id} className="hover:bg-gray-50">
                <td className="border px-3 py-2">{new Date(log.timestamp).toLocaleString()}</td>
                <td className="border px-3 py-2">{log.driverName}</td>
                <td className="border px-3 py-2">{log.trailerNumber}</td>
                <td className="border px-3 py-2">{log.unitNumber}</td>
                <td className="border px-3 py-2">{log.ppe}</td>
                <td className="border px-3 py-2">{log.type}</td>
                <td className="border px-3 py-2">{log.currentZone}</td>
                <td className="border px-3 py-2 whitespace-pre-wrap">{log.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
