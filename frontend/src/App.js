import React, { Fragment, useContext } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Profile from "./components/Profile";
import UserDashboard from "./components/UserDashboard";
import AuthContext from "./contextApi/AuthContext";

function App() {
  const authCtx = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user-profile" element={<Profile />} />
        <Route
          path="/user-dashboard"
          element={
            authCtx.isLoggedIn ? (
              <UserDashboard onLogout={authCtx.logoutHandler} />
            ) : (
              <Login />
            )
          }
        >
          <Route path="user-profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
