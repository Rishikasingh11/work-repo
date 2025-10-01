import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import OrphelinsMatches from "./routes/operations/OrphelinsMatches";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/operations/orphelinMatch" element={<OrphelinsMatches />} />
        <Route path="/" element={<Navigate to="/operations/orphelinMatch" replace />} />
        <Route path="*" element={<Navigate to="/operations/orphelinMatch" replace />} />
      </Routes>
    </Router>
  );
};

export default App;

