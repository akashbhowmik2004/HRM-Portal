import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },

    otpHash: {
        type: String,
        required: true
    },

    expiresAt: {
        type: Date,
        required: true
    },

    attempts: {
        type: Number,
        default: 0
    }
});
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 300 }); // Automatically delete expired OTPs after 5 minutes

export default mongoose.model("OTP", otpSchema);