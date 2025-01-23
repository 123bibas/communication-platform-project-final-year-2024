const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../middleware/errorMiddleware')
const Project = require('../models/projectModel');
const Task = require('../models/taskModel');
// @desc    Create a new project
// @route   POST /projects
// @access  Private
const createProject = asyncHandler(async (req, res) => {
    const { name, description, manager } = req.body;
    const project = new Project({ name, description, manager });
    await project.save();
    res.status(201).json({ success: true, message: "Project Created Successfully", data: project });
});
// @desc    Get all projects
// @route   GET /projects
// @access  Private
const getAllProjects = asyncHandler(async (req, res) => {
    const projects = await Project.find().populate('managers');
    res.status(200).json({ success: true, data: projects });
});
// @desc    Get all projects
// @route   GET /projects/user
// @access  Private
const getAllTeamProjects = asyncHandler(async (req, res) => {
    const userId = req.user._id
    if (req.user.role === 'team') {
        const result = await Task.aggregate([
            {
                $lookup: {
                    from: 'stages',
                    localField: 'stage',
                    foreignField: '_id',
                    as: 'stage'
                }
            },
            {
                $unwind: '$stage'
            },
            {
                $match: {
                    assignees: userId
                }
            },
            {
                $group: {
                    _id: '$stage.project',
                    project: {
                        $first: '$stage.project'
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    project: 1
                }
            }
        ]);
        const projects = result.map((item) => ({
            project: item.project,
        }));
        const finalResponse = []
        for (let i = 0; i < projects.length; i++) {
            const project = await Project.findById(projects[i].project, 'name description ')
                .populate({
                    path: 'manager',
                    select: 'name  photo'
                })
                .exec();
            finalResponse.push(project)
        }
        res.status(200).json({ success: true, message: "All project related to the team", data: finalResponse })
    }
    if (req.user.role === 'manager') {
        const projects = await Project.find({ manager: userId }).select('name description')
            .populate({
                path: 'manager',
                select: 'name  photo'
            })
        res.status(200).json({ success: true, message: "All project related to the team", data: projects })
    }
    if (req.user.role === 'admin') {
        const projects = await Project.find().select('name description')
            .populate({
                path: 'manager',
                select: 'name  photo'
            })
        res.status(200).json({ success: true, message: "All project related to the team", data: projects })
    }
});
// @desc    Get a single project by ID
// @route   GET /projects/:id
// @access  Private
const getProjectById = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id).populate('manager');
    if (!project) {
        throw new ErrorResponse(`Project not found with ID: ${req.params.id}`, 404);
    }
    res.status(200).json({ success: true, data: project });
});
// @desc    Update an existing project
// @route   PUT /projects/:id
// @access  Private
const updateProject = asyncHandler(async (req, res) => {
    const { name, description, manager } = req.body;
    let managerId = manager;
    if (req.user.role === 'manager') {
        managerId = req.user._id
    }
    const project = await Project.findByIdAndUpdate(
        req.params.id,
        { $set: { name, description, managerId } },
        { new: true }
    );
    if (!project) {
        throw new ErrorResponse(`Project not found with ID: ${req.params.id}`, 404);
    }
    res.status(200).json({ success: true, data: project });
});
// @desc    Delete a project by ID
// @route   DELETE /projects/:id
// @access  Private
const deleteProjectById = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);
    if (!project) {
        throw new ErrorResponse(`Project not found with ID: ${req.params.id}`, 404);
    }
    project.remove(req.params.id)
    res.status(200).json({ success: true, data: {} });
});
module.exports = {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProjectById,
    getAllTeamProjects
};