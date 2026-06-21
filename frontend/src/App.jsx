import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import About from "./pages/About.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Elections from "./pages/Elections.jsx";
import Voting from "./pages/Voting.jsx";
import Results from "./pages/Results.jsx";
import Admin from "./pages/Admin.jsx";
import Profile from "./pages/Profile.jsx";
import History from "./pages/History.jsx";
import Settings from "./pages/Settings.jsx";
import Help from "./pages/Help.jsx";

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/about" element={<About />} />

      {/* App (sidebar) */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/elections" element={<Elections mode="vote" />} />
      <Route path="/results" element={<Elections mode="results" />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/history" element={<History />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/help" element={<Help />} />
      <Route path="/admin" element={<Admin />} />

      {/* Focused */}
      <Route path="/vote/:id" element={<Voting />} />
      <Route path="/results/:id" element={<Results />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
