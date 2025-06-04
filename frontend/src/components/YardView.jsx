import React, { useEffect, useState } from "react";
import axios from "axios";

const zones = ["ZONE A", "ZONE A1", "ZONE B", "ZONE C", "ZONE D"];

export default function YardView() {
  const [trailers, setTrailers] = useState([]);
  const [selectedTrailer, setSelectedTrailer] = useState(null);

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
    try {
      await axios.put(`http://localhost:3001/api/trailers/${trailerId}`, { zone });
      fetchTrailers();
      // Optionally: create a shunt job here
    } catch (err) {
      console.error("Error updating trailer zone", err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">🧭 Live Yard View</h2>
      <div className="grid grid-cols-5 gap-4">
        {zones.map(zone => (
          <div
            key={zone}
            onDrop={e => handleDrop(e, zone)}
            onDragOver={e => e.preventDefault()}
            className="bg-gray-100 border rounded-lg p-2 min-h-[150px]"
          >
            <h3 className="text-lg font-semibold mb-2">{zone}</h3>
            {trailers
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
        <div className="mt-4 p-4 bg-white border rounded shadow">
          <h3 className="text-lg font-bold">📦 Trailer Details</h3>
          <p><strong>Trailer:</strong> {selectedTrailer.trailerNumber}</p>
          <p><strong>Zone:</strong> {selectedTrailer.zone}</p>
          <p><strong>Status:</strong> {selectedTrailer.status}</p>
          <p><strong>Unit:</strong> {selectedTrailer.unitNumber || "N/A"}</p>
          <button
            className="mt-2 px-4 py-1 bg-gray-500 text-white rounded"
            onClick={() => setSelectedTrailer(null)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}

const handleDrop = async (e, zone) => {
  const trailerId = e.dataTransfer.getData("trailerId");
  const trailer = trailers.find(t => t._id === trailerId);
  if (!trailer || trailer.zone === zone) return;

  try {
    // 1. Update trailer's zone
    await axios.put(`http://localhost:3001/api/trailers/${trailerId}`, { zone });

    // 2. Create a new shunt move log
    await axios.post("http://localhost:3001/api/shuntmove", {
      trailer: trailer.trailerNumber,
      from: trailer.zone,
      to: zone,
      requestedBy: "Yard Manager", // Replace with actual logged-in user later
      priority: "NORMAL"
    });

    fetchTrailers(); // Refresh UI
  } catch (err) {
    console.error("Error during trailer move", err);
  }
};
