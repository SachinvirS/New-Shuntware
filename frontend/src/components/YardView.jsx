import React, { useState, useEffect } from "react";

export default function YardView() {
  const [trailers, setTrailers] = useState([]);
  const [selected, setSelected] = useState(null);

  const zones = ["ZONE A", "ZONE A1", "ZONE B", "ZONE C", "ZONE D"];

  useEffect(() => {
    fetch("http://localhost:3001/api/trailers")
      .then(res => res.json())
      .then(setTrailers);
  }, []);

  const handleDrop = async (e, zone) => {
    const trailerId = e.dataTransfer.getData("trailerId");
    const from = e.dataTransfer.getData("currentZone");
    if (!trailerId || from === zone) return;

    // Update trailer's zone
    await fetch(`http://localhost:3001/api/trailers/${trailerId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentZone: zone })
    });

    // Log move
    const trailer = trailers.find(t => t._id === trailerId);
    await fetch("http://localhost:3001/api/moves", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        trailer: trailer.trailerNumber,
        from,
        to: zone,
        priority: "NORMAL",
        requestedBy: "System"
      })
    });

    // Refresh
    const updated = await fetch("http://localhost:3001/api/trailers").then(r => r.json());
    setTrailers(updated);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Yard View</h2>
      <div className="grid grid-cols-2 gap-6">
        {zones.map(zone => (
          <div
            key={zone}
            onDragOver={e => e.preventDefault()}
            onDrop={e => handleDrop(e, zone)}
            className="bg-gray-100 p-4 rounded shadow"
          >
            <h3 className="text-lg font-semibold mb-2">{zone}</h3>
            <div className="flex flex-wrap gap-2">
              {trailers
                .filter(t => t.currentZone === zone)
                .map(t => (
                  <div
                    key={t._id}
                    className="p-2 bg-blue-200 rounded cursor-move hover:bg-blue-300"
                    title={`Unit: ${t.unitNumber}\nDriver: ${t.driverName}`}
                    draggable
                    onClick={() => setSelected(t)}
                    onDragStart={e => {
                      e.dataTransfer.setData("trailerId", t._id);
                      e.dataTransfer.setData("currentZone", t.currentZone);
                    }}
                  >
                    {t.trailerNumber}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="mt-6 p-4 border rounded shadow bg-white">
          <h4 className="text-lg font-bold mb-2">Trailer Info</h4>
          <p><strong>Trailer #:</strong> {selected.trailerNumber}</p>
          <p><strong>Unit #:</strong> {selected.unitNumber}</p>
          <p><strong>Driver:</strong> {selected.driverName}</p>
          <p><strong>Status:</strong> {selected.status}</p>
          <p><strong>Zone:</strong> {selected.currentZone}</p>
        </div>
      )}
    </div>
  );
}
