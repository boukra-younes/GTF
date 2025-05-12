import { useState } from "react";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Home from "./components/Home";
import UsersTable from "./components/userstable/UsersTable";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Admin from "./components/Admin";
import Notifications from "./components/Notifications";
import PendingUsers from "./components/userstable/Pending";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<Admin />}>
          <Route path="users" element={<UsersTable />} />
          <Route path="pending" element={<PendingUsers />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
