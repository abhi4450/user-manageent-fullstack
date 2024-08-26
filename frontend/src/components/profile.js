import React, { useContext } from "react";
import AuthContext from "../contextApi/AuthContext";

const Profile = () => {
  const authCtx = useContext(AuthContext);
  

  if (!authCtx.isLoggedIn) {
    return <p>Please log in to access the dashboard.</p>;
  }

  return <h1>hello profile</h1>;
};

export default Profile;
