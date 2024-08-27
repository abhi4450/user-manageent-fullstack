import React, { useState, Fragment } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import classes from "./Signup.module.css";

const Signup = () => {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [error, SetError] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("signup");

  const navigate = useNavigate();

  const nameChangeHandler = (event) => {
    setName(event.target.value);
  };
  const genderChangeHandler = (event) => {
    setGender(event.target.value);
  };
  const emailChangeHandler = (event) => {
    setEmail(event.target.value);
  };
  const passwordChangeHandler = (event) => {
    setPassword(event.target.value);
  };
  const mobileChangeHandler = (event) => {
    setMobile(event.target.value);
  };
  const dobChangeHandler = (event) => {
    setDob(event.target.value);
  };
  const addressChangeHandler = (event) => {
    setAddress(event.target.value);
  };

  const formSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      let response = await axios.post("https://user-management-fullstack.onrender.com/api/user/signup", {
        name,
        gender,
        email,
        password,
        mobile,
        dob,
        address,
      });
      if (response.status === 201) {
        alert(response.data.message);
        setStep("verify");
      }
    } catch (error) {
      if (error.response.status === 400) {
        SetError(error.response.data.message);
      } else {
        console.log(error);
      }
    }
  };
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      let response = await axios.post("https://user-management-fullstack.onrender.com/api/verify-otp", {
        email,
        otp,
      });
      alert(response.data.message);
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Fragment>
      <div className={classes.formContainer}>
        {step === "signup" ? (
          <form onSubmit={formSubmitHandler}>
            <h1 className={classes.heading}>Register</h1>
            <div className={classes.formControl}>
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                placeholder="Enter Your Name"
                value={name}
                onChange={nameChangeHandler}
                required
              />
            </div>
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
            {error && <p className={classes.errorMessage}>{error}</p>}
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
            <div className={classes.formControl}>
              <label htmlFor="gender">Gender:</label>
              <select id="gender" value={gender} onChange={genderChangeHandler}>
                <option value="">Select Your Gender</option>
                <option value="Male">male</option>
                <option value="Female">female</option>
                <option value="Other">other</option>
              </select>
            </div>
            <div className={classes.formControl}>
              <label htmlFor="dob">Dob</label>
              <input
                type="date"
                id="dob"
                value={dob}
                onChange={dobChangeHandler}
                required
              />
            </div>
            <div className={classes.formControl}>
              <label htmlFor="mobile">Mobile</label>
              <input
                type="tel"
                id="mobile"
                value={mobile}
                placeholder="Enter Your Number(+91)"
                onChange={mobileChangeHandler}
                required
              />
            </div>
            <div className={classes.formControl}>
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                value={address}
                placeholder="Enter Your Address"
                onChange={addressChangeHandler}
                required
              />
            </div>
            <div className={classes.formActions}>
              <button type="submit">Register</button>
            </div>
            <p>
              Already Signed Up?{" "}
              <NavLink to="/login" className={classes.loginLink}>
                login here
              </NavLink>
            </p>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <h1 className={classes.heading}>Enter the otp you received.</h1>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              required
            />
            <button type="submit">Verify OTP</button>
          </form>
        )}
      </div>
    </Fragment>
  );
};

export default Signup;
