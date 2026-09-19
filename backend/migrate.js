import mongoose from "mongoose";
import User from "./src/models/User.js";

mongoose.connect("mongodb://localhost:27017/HRMPortal").then(async () => {
  try {
    const res = await User.updateMany(
      { status: { $exists: false } },
      { $set: { status: "Active" } }
    );
    console.log("Migration result:", res);
  } catch (error) {
    console.error(error);
  }
  process.exit(0);
});
