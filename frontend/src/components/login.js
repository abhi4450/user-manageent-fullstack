import React, { useState, Fragment, useContext } from "react";
import axios from "axios";
import classes from "./login.module.css";
import { useNavigate } from "react-router-dom";
import AuthContext from "../contextApi/AuthContext";
import { NavLink } from "react-router-dom";
import ForgotPasswordModal from "./ForgotPasswordModal";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const authCtx = useContext(AuthContext);

  const navigate = useNavigate();

  const emailChangeHandler = (event) => {
    setEmail(event.target.value);
  };

  const passwordChangeHandler = (event) => {
    setPassword(event.target.value);
  };

  const formSubmitHanlder = async (event) => {
    event.preventDefault();
    setError("");

    try {
      let response = await axios.post("http://localhost:5000/api/user/login", {
        email,
        password,
      });
      if (response.status === 200) {
        alert(response.data.message);
        console.log("Response", response.data);
        authCtx.loginHandler(response.data);
        navigate("/user-profile");
      }
    } catch (error) {
      if (error.response.status === 401) {
        setError(error.response.data.message);
      } else if (error.response.status === 404) {
        setError(error.response.data.message);
      } else {
        console.log(error);
      }
    }
    setEmail("");
    setPassword("");
  };

  const showModalHandler = () => {
    setShowModal(true);
  };
  const closeModalHandler = () => {
    setShowModal(false);
  };

  return (
    <Fragment>
      <div className={classes.formContainer}>
        <form onSubmit={formSubmitHanlder}>
          <h1>Login</h1>
          <div className={classes.formControl}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              placeholder="Enter Your Email"
              value={email}
              onChange={emailChangeHandler}
              required
            />
          </div>

          <div className={classes.formControl}>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              placeholder="Enter Your Password"
              value={password}
              onChange={passwordChangeHandler}
              required
            />
          </div>
          <NavLink onClick={showModalHandler}>
            Forgot Password?
          </NavLink>

          <div className={classes.formActions}>
            <button type="submit">Login</button>
          </div>
          <p>
            New User?{" "}
            <NavLink className={classes.signupLink} to="/">
              signup here
            </NavLink>
          </p>
          {error && <p className={classes.errorMessage}>{error}</p>}
        </form>
        {showModal && <ForgotPasswordModal onClose={closeModalHandler} />}
      </div>
    </Fragment>
  );
};

export default Login;
