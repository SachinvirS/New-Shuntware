import React, { useState } from "react";

const initialZones = {
  "Zone A": ["53R4001", "36F2210"],
  "Zone B": ["82280", "70243"],
  "Dock 1": [],
  "Dock 2": []
};

export default function YardView() {
  const [zones, setZones] = useState(initialZones);
  const [dragging, setDragging] = useState(null);

  const handleDragStart = (trailer, zone) => {
    setDragging({ trailer, from: zone });
  };

  const handleDrop = (zone) => {
    if (!dragging) return;
    const updated = { ...zones };
    updated[dragging.from] = updated[dragging.from].filter(t => t !== dragging.trailer);
    updated[zone].push(dragging.trailer);
    setZones(updated);
    setDragging(null);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Live Yard View</h2>
      <div className="grid grid-cols-2 gap-6">
        {Object.entries(zones).map(([zone, trailers]) => (
          <div key={zone} onDragOver={(e) => e.preventDefault()} onDrop={() => handleDrop(zone)} className="border rounded p-4 bg-gray-50">
            <h3 className="font-semibold text-lg mb-2">{zone}</h3>
            {trailers.map((t, idx) => (
              <div key={idx}
                draggable
                onDragStart={() => handleDragStart(t, zone)}
                className="p-2 bg-white border rounded mb-2 shadow cursor-move"
              >
                {t}
              </div>
            ))}
            {trailers.length === 0 && <div className="text-sm text-gray-400">No trailers</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
