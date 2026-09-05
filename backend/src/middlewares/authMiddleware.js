import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();


const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  console.log("Token from cookies:", token); // Debugging line
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

export default requireAuth;