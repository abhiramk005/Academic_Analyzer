import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Login from "./pages/login/Login";
import Home from "./pages/Home/Home";
import Upload from "./pages/upload/Upload";
import Academics from "./pages/student/Academics"; // Import Academics page
import TrackProgress from "./pages/student/Trackprogress";
import Analytics from "./pages/admin/Analytics";
import Reporting from "./pages/admin/Reporting";
import Manual from "./pages/admin/ManualEntry"
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route (Login page) */}
        <Route path="/" element={<Login />} />

        {/* Student home page */}
        <Route path="/studlogin" element={<Home role="student" />} />

        {/* Student academics page (View Academics) */}
        <Route path="/studlogin/backlogs" element={<Academics />} />

        {/* Admin home page */}
        <Route path="/adminlogin" element={<Home role="admin" />} />

        {/* Admin upload page */}
        <Route path="/admin/upload" element={<Upload />} />

        <Route path="/studlogin/track-progress" element={<TrackProgress />} />
        <Route path="/admin/analytics" element={<Analytics />} />
        <Route path="admin/reporting" element={<Reporting/>}/>
        <Route path="admin/manual-entry" element={<Manual/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
