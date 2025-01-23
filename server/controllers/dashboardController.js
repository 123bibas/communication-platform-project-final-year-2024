const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../middleware/errorMiddleware')
const Project = require('../models/projectModel');
const Task = require('../models/taskModel');
const User = require('../models/userModel');
// @desc    Get Task Priority List
// @route   GET /dashboard/priority
// @access  Private
const getTaskPriority = asyncHandler(async (req, res) => {
    const result = await Task.aggregate([
        {
            $group: {
                _id: '$priority',
                count: { $sum: 1 }
            }
        },
    ]);
    const priorityListWithCounts = result.map(({ _id, count }) => ({ type: _id, number: count }));
    res.status(200).json({ success: true, message: "All Priorities List", data: priorityListWithCounts });
})
// @desc    Get Task Type List
// @route   GET /dashboard/type
// @access  Private
const getTaskType = asyncHandler(async (req, res) => {
    const result = await Task.aggregate([
        {
            $group: {
                _id: '$type',
                count: { $sum: 1 }
            }
        },
    ]);
    const typeListWithCounts = result.map(({ _id, count }) => ({ type: _id, number: count }));
    res.status(200).json({ success: true, message: "All Ticket Tyoe List", data: typeListWithCounts });
})
// @desc    Get Task Type List
// @route   GET /dashboard/type
// @access  Private
const getProjectWithManagerType = asyncHandler(async (req, res) => {
    const projects = await Project.find().select('name description')
        .populate({
            path: 'manager',
            select: 'name  photo'
        })
    res.status(200).json({ success: true, message: "All Projects With their Manager List", data: projects });
});
// @desc    Get Data Count of Ticket, Project and Users
// @route   GET /dashboard/count
// @access  Private
const getProjectTaskAndUserCount = asyncHandler(async (req, res) => {
    const projectCount = await Project.countDocuments()
    const taskCount = await Task.countDocuments()
    const userCount = await User.countDocuments()
    res.status(200).json({ success: true, message: "All Ticket, Project and Users Counts", data: { projectCount, taskCount, userCount } });
});
module.exports = {
    getTaskPriority,
    getTaskType,
    getProjectWithManagerType,
    getProjectTaskAndUserCount
};