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
      console.error("Error fetching gate logs", err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🚪 Gatehouse Log History</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2 border">Date/Time</th>
              <th className="px-4 py-2 border">Driver</th>
              <th className="px-4 py-2 border">Trailer #</th>
              <th className="px-4 py-2 border">Unit #</th>
              <th className="px-4 py-2 border">Zone</th>
              <th className="px-4 py-2 border">Type</th>
              <th className="px-4 py-2 border">PPE</th>
              <th className="px-4 py-2 border">Notes</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td className="px-4 py-2 border text-center" colSpan="8">No logs found.</td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="px-4 py-2 border">{log.driverName}</td>
                  <td className="px-4 py-2 border">{log.trailerNumber}</td>
                  <td className="px-4 py-2 border">{log.unitNumber}</td>
                  <td className="px-4 py-2 border">{log.currentZone}</td>
                  <td className="px-4 py-2 border">{log.type}</td>
                  <td className="px-4 py-2 border">{log.ppe}</td>
                  <td className="px-4 py-2 border">{log.notes}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
