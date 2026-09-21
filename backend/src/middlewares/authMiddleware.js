import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();


const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  console.log("Token from cookies:", token); 
  try {
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "You are not authorised",
      });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: "You are not authorised",
        });
      } else {
        req.user = decodedToken;
        next();
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You do not have the required role",
      });
    }
    next();
  };
};

export default requireAuth;