import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true
    },
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    githubLink: {
      type: String
    },
    linkedinLink: {
      type: String
    },
    liveLink: {
      type: String
    },
    score: {
      type: Number,
      min: 0,
      max: 5
    },
    feedback: {
      type: String
    }
  }
);

export default mongoose.model("Project", projectSchema);