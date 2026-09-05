import User from "../models/User.js";
export const fetchUserDetails = async (req, res) => {
  try {
    const userId = req.user.id; 
    const user = await User.findById(userId).select("-password"); 
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};