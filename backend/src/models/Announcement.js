import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema({
    headline: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
},{timestamps: true});

const Announcement = mongoose.model("Announcement", announcementSchema);
export default Announcement;