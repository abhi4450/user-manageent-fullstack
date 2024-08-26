import React, { Fragment } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from "./components/signup";
import Login from "./components/login";
import Profile from "./components/profile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user-profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
