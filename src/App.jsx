// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AccessPage from "./components/FileUploader";
import FileUploader from "./components/FileUploader";
import RequireAuth from "./components/utils/RequireAuth";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AccessPage />} />
        <Route
          path="/upload"
          element={
            <RequireAuth>
              <FileUploader />
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
