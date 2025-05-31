import { useState } from "react";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import Home from "./pages/Home/Home";
import UsersTable from "./components/admin/userstable/UsersTable";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Admin from "./pages/admin/Admin";
import Notifications from "./components/Notifications";
import PendingUsers from "./components/admin/userstable/Pending";
import UserSettings from "./components/UserSettings";
import Dashboard from "./components/admin/Dashboard";
import ActivityLog from "./components/admin/ActivityLog";
import TravailForm from "./components/responsable/travail/TravailForm";
import Responsable from "./pages/responsable/Responsable";
import ProjectResponsable from "./components/responsable/ProjectsResponsable";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<Admin />}>
          <Route path="users" element={<UsersTable />} />
          <Route path="pending" element={<PendingUsers />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="settings" element={<UserSettings />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="activity" element={<ActivityLog />} />
           
        </Route>
        <Route path="/responsable" element={<Responsable />}>
          <Route path="add" element={<TravailForm />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="projects" element={<ProjectResponsable/>} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
