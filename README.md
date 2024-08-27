Here's a template for a GitHub README file that provides an overview of your project, instructions for getting started, and details on how to use it. You can customize it according to your project's specific needs.

User Management System

# Overview

The User Management System is a MERN stack application designed for managing user profiles. It includes features for user registration, login, profile management, and more. This project leverages React for the frontend, Node.js and Express for the backend, and MongoDB for the database.

# Features

- User Authentication: Implement OTP flow in Signup API. (Sending Real sms through Email to user is required) , log in, and log out functionalities.
- Profile Management: View and update user profiles.
- Responsive Design: Mobile and desktop-friendly interfaces.
- Data Validation: Ensures data integrity and security.

# Technologies Used

Frontend: React, React Router, Axios
Backend: Node.js, Express
Database: MongoDB
Authentication: JWT
Styling: CSS Modules,
Utilities: SendInBlue("sib-api-v3-sdk": "^8.5.0", for email), Twilio for sending OTP

# Getting Started

Prerequisites
Node.js (>= 14.x)
MongoDB (>= 4.x)
An API key for Twilio
An email service setup (SendInBlue)

# Installation

Clone the Repository

- git clone https://github.com/abhi4450/user-management-fullstack.git

## SetUp backend

- cd backend
- npm install
- npm start
- Create a .env file in the backend directory with the following environment variables:
  PORT=5000
  MONGO_URI='YOUR MONGO_URI' (I CONNECTED THROUGH MONGODB ATLAS)
  TWILIO_ACCOUNT_SID='YOUR ACCOUNT SID'
  TWILIO_PHONE_NUMBER="..."
  SIB_API_KEY=""
  EMAIL_USER='YOUR EMAIL-ID'
  ADMIN_USER='YOUR EMAIL-ID'


## SetUp frontend

- cd ..
- cd frontend
- npm install
- npm start

## Configuration

API Endpoints: Ensure that your frontend API base URL matches the backend server URL. Update the AxiosInstance configuration in frontend/src/services/api.js.
Usage
Sign Up: Register a new user by providing necessary details.
Login: Log in with your credentials to access the dashboard.
Forgot Password: click on forgot password to receive the link to reset password.
Profile Management: View and update your profile information from the user dashboard.

# API Documentation

**Live Server URL**: https://user-management-fullstack.onrender.com

**Base URL for non-auth routes**: https://user-management-fullstack.onrender.com/api

## Signup API

**Endpoint**: POST https://user-management-fullstack.onrender.com/api/user/signup

**Description**: Registers a new user in the system.

Headers:
Content-Type: application/json

Request Body:

{
"name": "John Doe",
"mobile": "1234567890",
"email": "johndoe@example.com",
"dob": "1990-01-01",
"gender": "Male",
"address": "123 Main Street, Anytown, USA",
"password": "Password123"
}

## Login API:

**Endpoint**: POST /api/user/login

**Description**: Authenticates a user using jwt and returns an authentication token.

**Headers**:
Content-Type: application/json

**Request Body**:

{
"email": "johndoe@example.com",
"password": "Password123"
}

## Profile API:

**EndPoint**:
GET /api/user/profile,

**Description**: Retrieves the profile information of the currently logged-in user.

**Headers**:

Authorization:<token>

PUT /api/user/update-profile

**Description**: Updates the profile information of the currently logged-in user.

**Headers**:

Content-Type: application/json
Authorization: Bearer <token>

**Request Body**:

{
"name": "John Doe Updated",
"mobile": "0987654321",
"email": "johnupdated@example.com",
"dob": "1991-01-01",
"gender": "Male",
"address": "456 Elm Street, Anytown, USA"
}

## Forgotpassword API:

**EndPoint**: POST /api/forgot-password

**Description**: Sends a password reset link to the user's email.

**Headers**:
Content-Type: application/json

**Request Body**:
{
"email": "johndoe@example.com"
}

# Acknowledgements

React: A JavaScript library for building user interfaces.
Node.js: A JavaScript runtime built on Chrome's V8 JavaScript engine.
MongoDB Atlas: A NoSQL database.
Twilio: For OTP to mobile.
SendInBlue(brevo.com): for email services
