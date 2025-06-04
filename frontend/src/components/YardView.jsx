import React, { useEffect, useState } from "react";

export default function YardView() {
  const [trailers, setTrailers] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/api/trailers")
      .then(res => res.json())
      .then(setTrailers);
  }, []);

  const zones = ["ZONE A", "ZONE A1", "ZONE B", "ZONE C", "ZONE D"];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Yard Layout</h2>

      {selected && (
        <div className="p-3 mb-3 border bg-white rounded shadow">
          <h3 className="font-semibold">Trailer Info</h3>
          <p><strong>Trailer:</strong> {selected.trailerNumber}</p>
          <p><strong>Unit:</strong> {selected.unitNumber}</p>
          <p><strong>Driver:</strong> {selected.driverName}</p>
          <p><strong>Status:</strong> {selected.status}</p>
          <p><strong>Zone:</strong> {selected.currentZone}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {zones.map(zone => (
          <div key={zone} className="bg-gray-100 p-4 rounded shadow">
            <h3 className="font-semibold mb-2">{zone}</h3>
            <div className="flex flex-wrap gap-2">
              {trailers
                .filter(t => t.currentZone === zone)
                .map(t => (
                  <div
                    key={t._id}
                    className="p-2 bg-blue-200 rounded cursor-pointer hover:bg-blue-300"
                    title={`Unit: ${t.unitNumber}\nDriver: ${t.driverName}`}
                    onClick={() => setSelected(t)}
                  >
                    {t.trailerNumber}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
