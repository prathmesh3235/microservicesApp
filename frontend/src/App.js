import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
