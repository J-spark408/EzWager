import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AccessPage from "./components/AccessPage";
import FileUpload from "./components/FileUploader";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AccessPage />} />
        <Route path="/upload" element={<FileUpload />} />
      </Routes>
    </Router>
  );
}

export default App;
