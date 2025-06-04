const handleSubmit = async (e) => {
  e.preventDefault();
  const entry = { ...form, timestamp: new Date().toLocaleString() };
  setLog([entry, ...log]);
  setForm({ driver: "", trailer: "", unit: "", notes: "", type: "Entry", ppe: false });

  // Send trailer to backend
  try {
    await fetch("http://localhost:3001/api/trailers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        trailerNumber: form.trailer,
        unitNumber: form.unit,
        driverName: form.driver,
        currentZone: form.type === "Entry" ? "ZONE A" : "EXIT",
        doorNumber: "", // Optional for now
        status: form.type === "Entry" ? "In Yard" : "Exited"
      })
    });
  } catch (err) {
    console.error("Failed to save trailer:", err);
  }
};
