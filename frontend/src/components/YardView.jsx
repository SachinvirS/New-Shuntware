// frontend/src/components/YardView.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const zones = ["ZONE A", "ZONE A1", "ZONE B", "ZONE C", "ZONE D"];
const shippingDoors = Array.from({ length: 58 }, (_, i) => 60 + i); // 60-117
const receivingDoors = Array.from({ length: 36 }, (_, i) => 11 + i); // 11-46

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
    if (!trailer || trailer.currentZone === zone || trailer.doorNumber === zone) return;

    try {
      const update = isNaN(zone)
        ? { currentZone: zone, doorNumber: null }
        : { doorNumber: parseInt(zone), currentZone: null };

      await axios.put(`http://localhost:3001/api/trailers/${trailerId}`, update);

      await axios.post("http://localhost:3001/api/shuntmove", {
        trailer: trailer.trailerNumber,
        from: trailer.currentZone || `DOOR ${trailer.doorNumber}`,
        to: isNaN(zone) ? zone : `DOOR ${zone}`,
        requestedBy: localStorage.getItem("username") || "Yard Manager",
        priority: "NORMAL"
      });

      fetchTrailers();
    } catch (err) {
      console.error("Error during trailer move", err);
    }
  };

  const filteredTrailers = trailers.filter(t =>
    t.trailerNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const TrailerCard = ({ trailer }) => (
    <div
      key={trailer._id}
      draggable
      onDragStart={e => handleDragStart(e, trailer._id)}
      onClick={() => setSelectedTrailer(trailer)}
      className="p-2 bg-blue-500 text-white rounded cursor-pointer relative group mb-2"
    >
      {trailer.trailerNumber}
      <div className="absolute left-full ml-2 top-0 z-10 bg-white text-black text-xs rounded shadow p-2 w-48 hidden group-hover:block">
        <p><strong>Unit:</strong> {trailer.unitNumber || "N/A"}</p>
        <p><strong>Driver:</strong> {trailer.driverName || "N/A"}</p>
        <p><strong>Status:</strong> {trailer.status || "N/A"}</p>
        <p><strong>Zone:</strong> {trailer.currentZone}</p>
        <p><strong>Door:</strong> {trailer.doorNumber || "—"}</p>
      </div>
    </div>
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

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        {zones.map(zone => (
          <div
            key={zone}
            onDrop={e => handleDrop(e, zone)}
            onDragOver={e => e.preventDefault()}
            className="bg-gray-100 border rounded-lg p-4 min-h-[160px] shadow"
          >
            <h3 className="text-lg font-semibold mb-2">{zone}</h3>
            {filteredTrailers.filter(t => t.currentZone === zone).map(trailer => (
              <TrailerCard trailer={trailer} key={trailer._id} />
            ))}
          </div>
        ))}
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-bold mb-2">🚪 Shipping Doors (60–117)</h3>
        <div className="grid grid-cols-6 gap-2">
          {shippingDoors.map(door => (
            <div
              key={door}
              onDrop={e => handleDrop(e, door)}
              onDragOver={e => e.preventDefault()}
              className="bg-yellow-100 border rounded p-2 min-h-[60px] text-center shadow"
            >
              <strong>Door {door}</strong>
              {filteredTrailers.filter(t => t.doorNumber === door).map(trailer => (
                <TrailerCard trailer={trailer} key={trailer._id} />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-bold mb-2">📥 Inbound Doors (11–46)</h3>
        <div className="grid grid-cols-6 gap-2">
          {receivingDoors.map(door => (
            <div
              key={door}
              onDrop={e => handleDrop(e, door)}
              onDragOver={e => e.preventDefault()}
              className="bg-blue-50 border rounded p-2 min-h-[60px] text-center shadow"
            >
              <strong>Door {door}</strong>
              {filteredTrailers.filter(t => t.doorNumber === door).map(trailer => (
                <TrailerCard trailer={trailer} key={trailer._id} />
              ))}
            </div>
          ))}
        </div>
      </div>

      {selectedTrailer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-2">📦 Trailer Details</h3>
            <p><strong>Trailer #:</strong> {selectedTrailer.trailerNumber}</p>
            <p><strong>Unit #:</strong> {selectedTrailer.unitNumber || "—"}</p>
            <p><strong>Driver:</strong> {selectedTrailer.driverName || "—"}</p>
            <p><strong>Status:</strong> {selectedTrailer.status || "—"}</p>
            <p><strong>Zone:</strong> {selectedTrailer.currentZone}</p>
            <p><strong>Door:</strong> {selectedTrailer.doorNumber || "—"}</p>
            <p><strong>Comments:</strong></p>
            <ul className="list-disc list-inside">
              {selectedTrailer.comments?.length > 0 ? (
                selectedTrailer.comments.map((c, idx) => <li key={idx}>{c}</li>)
              ) : (
                <li>No comments</li>
              )}
            </ul>
            <button
              onClick={() => setSelectedTrailer(null)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
