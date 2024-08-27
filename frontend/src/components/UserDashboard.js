import React, { useContext } from "react";
import { NavLink, Outlet } from "react-router-dom";
import AuthContext from "../contextApi/AuthContext";
import classes from "./UserDashboard.module.css";

const UserDashboard = (props) => {
  const authCtx = useContext(AuthContext);

  if (!authCtx.isLoggedIn) {
    return <p>Please log in to access the dashboard.</p>;
  }

  return (
    <div className={classes.dashboard}>
      <nav className={classes.nav}>
        <ul>
          <h1>User Dashboard</h1>
          <li>
            <NavLink
              to="user-profile"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
            >
              Profile
            </NavLink>
          </li>
        </ul>
        <button onClick={props.onLogout} className={classes.logoutButton}>
          Logout
        </button>
      </nav>
      <main className={classes.mainContent}>
        <Outlet />
      </main>
    </div>
  );
};

export default UserDashboard;
