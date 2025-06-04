import React, { useState } from "react";

export default function Login() {
  const [user, setUser] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    alert(`Logged in as ${user.username} (mock login)`);
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 border rounded bg-white shadow">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input name="username" value={user.username} onChange={handleChange} placeholder="Username" className="w-full p-2 border" required />
        <input name="password" type="password" value={user.password} onChange={handleChange} placeholder="Password" className="w-full p-2 border" required />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 w-full">Login</button>
      </form>
    </div>
  );
}
