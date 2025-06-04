// frontend/src/components/YardView.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const zones = ["ZONE A", "ZONE A1", "ZONE B", "ZONE C", "ZONE D"];

export default function YardView() {
  const [trailers, setTrailers] = useState([]);
  const [selectedTrailer, setSelectedTrailer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTrailers();
  }, []);

  const fetchTrailers = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/trailers");
      setTrailers(res.data);
    } catch (err) {
      console.error("Error fetching trailers", err);
    }
  };

  const handleDragStart = (e, trailerId) => {
    e.dataTransfer.setData("trailerId", trailerId);
  };

  const handleDrop = async (e, zone) => {
    const trailerId = e.dataTransfer.getData("trailerId");
    const trailer = trailers.find(t => t._id === trailerId);
    if (!trailer || trailer.zone === zone) return;

    try {
      await axios.put(`http://localhost:3001/api/trailers/${trailerId}`, { zone });
      await axios.post("http://localhost:3001/api/shuntmove", {
        trailer: trailer.trailerNumber,
        from: trailer.zone,
        to: zone,
        requestedBy: localStorage.getItem("username") || "Yard Manager",
        priority: "NORMAL"
      });
      fetchTrailers();
    } catch (err) {
      console.error("Error during trailer move", err);
    }
  };

  const handleExit = async (trailerId) => {
    try {
      await axios.post("http://localhost:3001/api/gatehouse", {
        trailerNumber: trailers.find(t => t._id === trailerId)?.trailerNumber,
        type: "Exit",
        driverName: localStorage.getItem("username") || "Gate Operator",
        unitNumber: "",
        notes: "Exited manually from YardView",
        ppe: "Yes",
        currentZone: "YARD"
      });
      fetchTrailers();
    } catch (err) {
      console.error("Error exiting trailer", err);
    }
  };

  const filteredTrailers = trailers.filter(t =>
    t.trailerNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">🧭 Live Yard View</h2>

      <input
        type="text"
        placeholder="Search trailer..."
        className="mb-4 p-2 border rounded w-full"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {zones.map(zone => (
          <div
            key={zone}
            onDrop={e => handleDrop(e, zone)}
            onDragOver={e => e.preventDefault()}
            className="bg-gray-100 border rounded-lg p-4 min-h-[160px] shadow"
          >
            <h3 className="text-lg font-semibold mb-2">{zone}</h3>
            {filteredTrailers
              .filter(t => t.zone === zone)
              .map(trailer => (
                <div
                  key={trailer._id}
                  draggable
                  onDragStart={e => handleDragStart(e, trailer._id)}
                  onClick={() => setSelectedTrailer(trailer)}
                  title={`Click for details\nUnit: ${trailer.unitNumber || "N/A"}\nStatus: ${trailer.status}`}
                  className="cursor-move bg-blue-200 rounded p-2 mb-2 shadow hover:bg-blue-300"
                >
                  {trailer.trailerNumber}
                </div>
              ))}
          </div>
        ))}
      </div>

      {selectedTrailer && (
        <div className="mt-6 p-4 bg-white border rounded shadow">
          <h3 className="text-lg font-bold mb-2">📦 Trailer Details</h3>
          <p><strong>Trailer:</strong> {selectedTrailer.trailerNumber}</p>
          <p><strong>Zone:</strong> {selectedTrailer.zone}</p>
          <p><strong>Status:</strong> {selectedTrailer.status}</p>
          <p><strong>Unit:</strong> {selectedTrailer.unitNumber || "N/A"}</p>
          <p><strong>Last Move:</strong> {selectedTrailer.updatedAt ? new Date(selectedTrailer.updatedAt).toLocaleString() : "Unknown"}</p>
          <button
            className="mt-3 mr-2 px-4 py-2 bg-gray-600 text-white rounded"
            onClick={() => setSelectedTrailer(null)}
          >
            Close
          </button>
          <button
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded"
            onClick={() => handleExit(selectedTrailer._id)}
          >
            Mark as Exit
          </button>
        </div>
      )}
    </div>
  );
}
