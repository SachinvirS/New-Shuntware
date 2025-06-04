import React, { useEffect, useState } from "react";
import axios from "axios";

export default function GateLogViewer() {
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/gatelogs");
      setLogs(res.data);
    } catch (err) {
      console.error("Error fetching logs", err);
    }
  };

  const filteredLogs = logs.filter(log =>
    log.trailerNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.driverName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">📘 Gate Log Viewer</h2>

      <input
        type="text"
        placeholder="Search by trailer or driver..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border rounded w-full"
      />

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="px-4 py-2">Trailer</th>
              <th className="px-4 py-2">Driver</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Zone</th>
              <th className="px-4 py-2">Time</th>
              <th className="px-4 py-2">Notes</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log, idx) => (
              <tr key={idx} className="border-t hover:bg-gray-100">
                <td className="px-4 py-2">{log.trailerNumber}</td>
                <td className="px-4 py-2">{log.driverName}</td>
                <td className="px-4 py-2">{log.type}</td>
                <td className="px-4 py-2">{log.currentZone}</td>
                <td className="px-4 py-2">{new Date(log.timestamp).toLocaleString()}</td>
                <td className="px-4 py-2">{log.notes || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
