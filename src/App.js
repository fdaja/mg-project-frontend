import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ConfirmEmail from "./pages/ConfirmEmail";
import UserProfile from "./pages/UserProfile"; // Import the new UserProfile component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/confirm-email" element={<ConfirmEmail />} />
        <Route path="/profile" element={<UserProfile />} /> {/* Add this */}
      </Routes>
    </Router>
  );
}

export default App;
