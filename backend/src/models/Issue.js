import mongoose from "mongoose";

const issueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    issue: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Open", "Resolved"],
      default: "Open",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Issue", issueSchema);
