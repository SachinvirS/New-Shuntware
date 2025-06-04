import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Gatehouse from "./pages/Gatehouse";
import WorkQueue from "./pages/WorkQueue";
import YardView from "./pages/YardView";
import Login from "./pages/Login";
import GateLogViewer from "./pages/GateLogViewer"; // ✅ New import

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex">
        <aside className="w-60 bg-gray-800 text-white p-4 space-y-2">
          <h1 className="text-xl font-bold mb-4">Shuntware</h1>
          <Link className="block hover:bg-gray-700 px-2 py-1 rounded" to="/">Gatehouse</Link>
          <Link className="block hover:bg-gray-700 px-2 py-1 rounded" to="/work">Work Queue</Link>
          <Link className="block hover:bg-gray-700 px-2 py-1 rounded" to="/yard">Yard View</Link>
          <Link className="block hover:bg-gray-700 px-2 py-1 rounded" to="/gatelogs">Gate Logs</Link> {/* ✅ New link */}
          <Link className="block hover:bg-gray-700 px-2 py-1 rounded" to="/login">Login</Link>
        </aside>
        <main className="flex-1 p-6 bg-white overflow-y-auto">
          <Routes>
            <Route path="/" element={<Gatehouse />} />
            <Route path="/work" element={<WorkQueue />} />
            <Route path="/yard" element={<YardView />} />
            <Route path="/gatelogs" element={<GateLogViewer />} /> {/* ✅ New route */}
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
