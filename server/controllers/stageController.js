const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../middleware/errorMiddleware");
const Stage = require("../models/stageModel");
// @desc    Create a new stage
// @route   POST /stages
// @access  Private
const createStage = asyncHandler(async (req, res) => {
  const { name, description, color, order, project } = req.body;
  const stage = new Stage({ name, description, color, order, project });
  await stage.save();
  res.status(201).json({ success: true, data: stage });
});
// @desc    Get all stages
// @route   GET /stages
// @access  Private
const getAllStages = asyncHandler(async (req, res) => {
  const stages = await Stage.find({ project: req.params.projectId }).populate({
    path: "tasks",
    options: { sort: { order: 1 } },
    select:
      "name description priority type createdAt updatedAt stage order assignees createdBy", // Include only these fields
  });
  if (!stages) {
    throw new ErrorResponse(`Stage not found with ID: ${req.params.id}`, 404);
  }
  res.status(200).json({ success: true, data: stages });
});
// @desc    Get a single stage by ID
// @route   GET /stages/:id
// @access  Private
const getStageById = asyncHandler(async (req, res) => {
  const stage = await Stage.find({ project: req.params.id }).populate({
    path: "tasks",
    options: { sort: { order: 1 } },
    projection: { attachments: 0 }, // Exclude attachments field
  });
  if (!stage) {
    throw new ErrorResponse(`Stage not found with ID: ${req.params.id}`, 404);
  }
  res.status(200).json({ success: true, data: stage });
});
// @desc    Update an existing stage
// @route   PUT /stages/:id
// @access  Private
const updateStage = asyncHandler(async (req, res) => {
  const { name, description, color, order, project } = req.body;
  const stage = await Stage.findByIdAndUpdate(
    req.params.id,
    { $set: { name, description, color, order, project } },
    { new: true }
  );
  if (!stage) {
    throw new ErrorResponse(`Stage not found with ID: ${req.params.id}`, 404);
  }
  res.status(200).json({ success: true, data: stage });
});
module.exports = {
  createStage,
  getAllStages,
  getStageById,
  updateStage,
};
