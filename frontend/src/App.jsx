import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/signup";
import FileInput from "./pages/FileInput";
import UploadInterface from "./pages/UploadInterface";
import Dashboard from "./pages/Dashboard";
import TemplatesPage from "./pages/Templates";
import DownloadPage from "./pages/downloadPage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/story" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/fileinput" element={<FileInput />} />
        <Route path="/download" element={<DownloadPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload-interface" element={<UploadInterface />} />
        <Route path="/templates" element={<TemplatesPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
