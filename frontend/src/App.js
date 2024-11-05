import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import Dashboard from "./components/Dashboard";
import RequestStatus from "./components/RequestStatus";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/status" element={<RequestStatus />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
