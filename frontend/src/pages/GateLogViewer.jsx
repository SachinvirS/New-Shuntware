// frontend/src/pages/GateLogViewer.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function GateLogViewer() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/gatelogs");
      setLogs(res.data);
    } catch (err) {
      console.error("Error fetching gate logs", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📋 Gatehouse Log Viewer</h2>

      {loading ? (
        <p>Loading logs...</p>
      ) : (
        <div className="overflow-auto">
          <table className="min-w-full border text-sm shadow rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Time</th>
                <th className="px-4 py-2 border">Driver</th>
                <th className="px-4 py-2 border">Trailer</th>
                <th className="px-4 py-2 border">Unit</th>
                <th className="px-4 py-2 border">PPE</th>
                <th className="px-4 py-2 border">Zone</th>
                <th className="px-4 py-2 border">Notes</th>
                <th className="px-4 py-2 border">Type</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border">{log.driverName}</td>
                  <td className="px-4 py-2 border">{log.trailerNumber}</td>
                  <td className="px-4 py-2 border">{log.unitNumber}</td>
                  <td className="px-4 py-2 border">{log.ppe}</td>
                  <td className="px-4 py-2 border">{log.currentZone}</td>
                  <td className="px-4 py-2 border">{log.notes}</td>
                  <td className="px-4 py-2 border font-semibold">
                    {log.type === "Entry" ? "🚪 Entry" : "⬅ Exit"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
