import mongoose from "mongoose";
import User from "./src/models/User.js";

mongoose.connect("mongodb://localhost:27017/HRMPortal").then(async () => {
  try {
    const users = await User.find({ role: { $in: ["admin", "hr"] }, status: "Active" });
    console.log("Found users:", users.map(u => `${u.name} - ${u.role} - ${u.status}`));
  } catch (error) {
    console.error(error);
  }
  process.exit(0);
});
