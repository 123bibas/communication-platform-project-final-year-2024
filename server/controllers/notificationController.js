const asyncHandler = require('../middleware/async')
const Notification = require('../models/notificationModel')
const postNotification = async (data) => {
    const notification = await Notification.create(data)
    console.log(notification)
}
//@desc     Get all notifications of a user
//@route    GET /api/v1/notification/:id 
//@access   Private   
const getNotifications = asyncHandler(async (req, res) => {
    const { id } = req.params
    const notifications = await Notification.find({ user: id }).sort({ createdAt: -1 }).populate({
        path: 'updatedBy',
        select: 'name photo'
    })
    res.status(200).json({ success: true, message: "All User Notifications", data: notifications });
})
//@desc     Read all notifications of a user
//@route    GET /api/v1/notification/:id 
//@access   Private   
const readNotifications = asyncHandler(async (req, res) => {
    const updatedNotifications = await Notification.updateMany({ user: req.user, read: false }, { $set: { read: true } })
    const notifications = await Notification.find({ user: req.user }).sort({ createdAt: -1 }).populate({
        path: 'updatedBy',
        select: 'name photo'
    })
    res.status(200).json({ success: true, message: "All User Notifications", data: notifications });
})
module.exports = {
    postNotification,
    getNotifications,
    readNotifications
};