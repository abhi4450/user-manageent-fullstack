import React, { useState, useContext } from "react";
import UserContext from "../contextApi/UserContext";
import classes from "./Profile.module.css";
import { AxiosInstance } from "../services/api";

const Profile = () => {
  const { user, setUser } = useContext(UserContext);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user ? user.name : "",
    gender: user ? user.gender : "",
    address: user ? user.address : "",
    email: user ? user.email : "",
    dob: user ? user.dob : "",
    mobile: user ? user.mobile : "",
  });

  console.log("formData", formData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await AxiosInstance.put(
        "/user/update-profile",
        formData
      );
      if (response.status === 200) {
        console.log("Fetched user profile:", response.data);
        setUser(response.data);
        setIsEditing(false);
      }
    } catch (error) {
      console.log("error updating", error);
    }
  };

  return (
    <div className={classes["user-profile"]}>
      {!isEditing ? (
        <>
          <h2>Profile Information</h2>
          <p>
            <strong>Name:</strong> {user?.name}
          </p>
          <p>
            <strong>Gender:</strong> {user?.gender}
          </p>
          <p>
            <strong>Address:</strong> {user?.address}
          </p>
          <p>
            <strong>Email:</strong> {user?.email}
          </p>
          <p>
            <strong>Date of Birth:</strong> {user?.dob}
          </p>
          <p>
            <strong>Mobile:</strong> {user?.mobile}
          </p>
          <button
            onClick={() => setIsEditing(true)}
            className={classes["update-button"]}
          >
            Update Profile
          </button>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <h2>Update Profile</h2>
          <div className={classes["form-group"]}>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
          <div className={classes["form-group"]}>
            <label htmlFor="gender">Gender:</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className={classes["form-group"]}>
            <label htmlFor="address">Address:</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
            />
          </div>
          <div className={classes["form-group"]}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className={classes["form-group"]}>
            <label htmlFor="dob">Date of Birth:</label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
            />
          </div>
          <div className={classes["form-group"]}>
            <label htmlFor="mobile">Mobile:</label>
            <input
              type="text"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit" className={classes["update-button"]}>
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className={classes["cancel-button"]}
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default Profile;
