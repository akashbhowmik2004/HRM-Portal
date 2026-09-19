import Notification from "../models/Notification.js";

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({ success: true, notifications });
  } catch (error) {
    console.error("Get Notifications Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const dismissNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // We can either mark it as read or delete it. Let's delete it so it's gone for good.
    await Notification.findOneAndDelete({ _id: id, userId });
    
    res.status(200).json({ success: true, message: "Notification dismissed" });
  } catch (error) {
    console.error("Dismiss Notification Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    await Notification.updateMany({ userId, isRead: false }, { isRead: true });
    res.status(200).json({ success: true, message: "All notifications dismissed" });
  } catch (error) {
    console.error("Mark All Read Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
