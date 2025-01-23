const mongoose = require("mongoose");
const notificationSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        message: { type: String, required: true },
        read: { type: Boolean, default: false },
        type: { type: String, required: true },
        details: { type: Object }
    },
    { timestamps: true }
);
const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification
