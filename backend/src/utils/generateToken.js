// jwtTokenGenerator.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
// Function to generate a JWT token
const generateToken = (user) => {
  const tokenData = { user };
  const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
    expiresIn: "2d",
  });
  return token;
};

// Function to set a cookie with the JWT token
const setTokenCookie = (res, token) => {
  return res.cookie("token", token, {
    expiresIn: "2d",
    httpOnly: true,
  });
};

// Function to remove the JWT cookie
const removeTokenCookie = (res) => {
  return res.cookie("token", "", { maxAge: 0 });
};

export { generateToken, setTokenCookie, removeTokenCookie };
