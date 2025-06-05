// frontend/src/components/YardView.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const zones = ["ZONE A", "ZONE A1", "ZONE B", "ZONE C", "ZONE D"];
const shippingDoors = Array.from({ length: 58 }, (_, i) => i + 60); // 60–117
const inboundDoors = Array.from({ length: 36 }, (_, i) => i + 11);  // 11–46

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
      setTrailers(res.data.filter(t => t.status === "IN_YARD"));
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
    if (!trailer || trailer.currentZone === zone) return;

    try {
      await axios.put(`http://localhost:3001/api/trailers/${trailerId}`, {
        currentZone: zone
      });

      await axios.post("http://localhost:3001/api/shuntmove", {
        trailer: trailer.trailerNumber,
        from: trailer.currentZone,
        to: zone,
        requestedBy: localStorage.getItem("username") || "Yard Manager",
        priority: "NORMAL"
      });

      fetchTrailers();
    } catch (err) {
      console.error("Error moving trailer", err);
    }
  };

  const filteredTrailers = trailers.filter(t =>
    t.trailerNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">🚛 Yard Live View</h2>

      <input
        type="text"
        placeholder="Search trailer number..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {zones.map((zone) => (
          <div
            key={zone}
            onDrop={(e) => handleDrop(e, zone)}
            onDragOver={(e) => e.preventDefault()}
            className="bg-gray-100 border rounded p-3 min-h-[180px] shadow-md"
          >
            <h3 className="text-lg font-bold mb-2">{zone}</h3>
            {filteredTrailers
              .filter((t) => t.currentZone === zone)
              .map((trailer) => (
                <div
                  key={trailer._id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, trailer._id)}
                  onClick={() => setSelectedTrailer(trailer)}
                  title={`Unit: ${trailer.unitNumber || "N/A"}\nStatus: ${trailer.status || "Unknown"}`}
                  className="bg-blue-200 cursor-move p-2 mb-2 rounded shadow hover:bg-blue-300"
                >
                  {trailer.trailerNumber}
                </div>
              ))}
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold text-gray-700 mb-1">Inbound Doors</h3>
          <div className="grid grid-cols-6 gap-2">
            {inboundDoors.map((door) => (
              <div key={door} className="text-sm bg-gray-200 text-center p-1 rounded">{door}</div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-gray-700 mb-1">Shipping Doors</h3>
          <div className="grid grid-cols-6 gap-2">
            {shippingDoors.map((door) => (
              <div key={door} className="text-sm bg-gray-200 text-center p-1 rounded">{door}</div>
            ))}
          </div>
        </div>
      </div>

      {selectedTrailer && (
        <div className="mt-6 p-4 border rounded bg-white shadow-lg">
          <h3 className="text-xl font-bold mb-2">📦 Trailer Info</h3>
          <p><strong>Trailer Number:</strong> {selectedTrailer.trailerNumber}</p>
          <p><strong>Unit Number:</strong> {selectedTrailer.unitNumber || "N/A"}</p>
          <p><strong>Driver:</strong> {selectedTrailer.driverName || "Unknown"}</p>
          <p><strong>Zone:</strong> {selectedTrailer.currentZone}</p>
          <p><strong>Status:</strong> {selectedTrailer.status}</p>
          <p><strong>Door Number:</strong> {selectedTrailer.doorNumber || "Not at a door"}</p>
          <p><strong>Comments:</strong> {selectedTrailer.comments?.join(", ") || "None"}</p>
          <button
            className="mt-3 px-4 py-2 bg-gray-600 text-white rounded"
            onClick={() => setSelectedTrailer(null)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
