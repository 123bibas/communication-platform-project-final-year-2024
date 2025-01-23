const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const Task = require("../models/taskModel");
const Project = require("../models/projectModel");
const Stage = require("../models/stageModel");
const { postNotification } = require("./notificationController");
const User = require("../models/userModel");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const crypto = require("crypto");
const Activity = require("../models/activityModel");
// @desc    Create a new task
// @route   POST /projects/:projectId/stages/:stageId/tasks
// @access  Private

const createTask = asyncHandler(async (req, res) => {
  const { name, description, priority, type, stage, assignees } = req.body;
  const task = new Task({
    name,
    description,
    priority,
    type,
    stage,
    assignees,
    createdBy: req.user,
  });
  await task.save();
  if (assignees) {
    for (const assignee of assignees) {
      const user = await User.findById(assignee);
      const notificationData = {
        user: user,
        updatedBy: req.user,
        message: `You have been assigned to new Task `,
        type: "ticket-added",
        read: "false",
        details: {
          stageId: stage,
          taskId: task._id,
        },
      };
      await postNotification(notificationData);
    }
  }
  res.status(201).json({ success: true, data: task });
});
// @desc    Get all tasks
// @route   GET /projects/:projectId/stages/:stageId/tasks
// @access  Private
const getAllTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find().populate("assignees");
  res.status(200).json({ success: true, data: tasks });
});
// @desc    Get a single task by ID
// @route   GET /projects/:projectId/stages/:stageId/tasks/:id
// @access  Private
const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate("assignees", "_id")
    .lean();
  const assigneeIds = task.assignees.map((assignee) => assignee._id);
  if (!task) {
    throw new ErrorResponse("Task not found with ID: ${req.params.id}", 404);
  }
  task.assignees = assigneeIds;
  res.status(200).json({ success: true, data: task });
});

// @desc    Get a single task detail by ID
// @route   GET /projects/:projectId/stages/:stageId/tasks/:id/detail
// @access  Private
const getTaskDetails = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id).populate(
    "assignees",
    "attachments"
  );

  res.status(200).json({ success: true, data: task });
});
// @desc    Update an existing task
// @route   PUT '/projects/:projectId/stages/:stageId/tasks/:id/file'
// @access  Private

const updateTaskAttachments = asyncHandler(async (req, res) => {
  const file = req.file; // Access the file from the FormData object
  const id = req.params.id;

  const task = await Task.findById(id);

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API,
    api_secret: process.env.CLOUDINARY_SECRET,
  });

  const tmpFile = `./temp/${file.originalname}`;
  try {
    fs.writeFileSync(tmpFile, file.buffer);
    const fileResponse = await cloudinary.uploader.upload(tmpFile, {
      public_id: `${id}_${crypto.randomUUID()}_${file.originalname}`,
    });
    fs.unlinkSync(tmpFile);
    // const fileResponse = await cloudinary.uploader.upload(file.buffer, {
    //   public_id: `${id}_${file.originalName}}`,
    // });
    task.attachments.push({
      url: fileResponse.secure_url,
      date: Date.now(),
      fileName: fileResponse.original_filename,
      format: fileResponse.format,
      publicId: fileResponse.public_id,
    });

    await task.save();

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    fs.readdirSync("./temp").forEach((file) => {
      const filePath = `./temp/${file}`;
      fs.unlinkSync(filePath);
    });
  }
});
// @desc    Update an existing task
// @route   PUT /projects/:projectId/stages/:stageId/tasks/:id
// @access  Private

const updateTask = asyncHandler(async (req, res) => {
  const { name, description, priority, type, stage, assignees } = req.body;
  const task = await Task.findById(req.params.id).populate(
    "assignees",
    "attachments"
  );
  if (!task) {
    throw new ErrorResponse("Task not found with ID: ${req.params.id}", 404);
  } else {
    task.name = name;
    task.description = description;
    task.priority = priority;
    task.type = type;
    task.stage = stage;
    task.assignees = assignees;
  }
  if (assignees && task.assignees) {
    const previousAssignees = task.assignees.map((assignee) => assignee._id);
    const newAssignees = assignees.filter((userId) => {
      if (!previousAssignees) {
        return true;
      }
      return !previousAssignees.includes(userId);
    });
    for (const assignee of newAssignees) {
      const user = await User.findById(assignee);
      const notificationData = {
        user: user,
        updatedBy: req.user,
        message: `You have been assigned to a Task `,
        type: "ticket-added",
        read: "false",
        details: {
          stageId: stage,
          taskId: task._id,
        },
      };
      await postNotification(notificationData);
    }
  }
  //check if the assignee exist in previous task and save notification for only newly assigned users
  await task.save();
  const updatedTask = await Task.findById(task._id)
    .populate("assignees", "attachments")
    .lean();
  let taskToReturn = updatedTask;
  taskToReturn.assignees = updatedTask.assignees.map(
    (assignee) => assignee._id
  );
  res.status(200).json({
    success: true,
    message: "Task updated succesfully",
    data: taskToReturn,
  });
});

// @desc    Delete project attachment
// @route   DELETE /projects/:projectId/stages/:stageId/tasks/:id/attachment
// @access  Private
const deleteTaskAttachment = asyncHandler(async (req, res) => {
  const taskId = req.params.id;
  const task = await Task.findById(taskId);
  if (!task) {
    throw new ErrorResponse("Task not found with ID: ${taskId}", 404);
  }

  const attachmentId = req.body.publicId; // Assuming you're passing the attachment ID in the request body
  const attachment = task.attachments.find((a) => a.publicId === attachmentId);

  if (!attachment) {
    throw new ErrorResponse("Attachment not found", 404);
  }

  // Delete attachment from Cloudinary
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API,
    api_secret: process.env.CLOUDINARY_SECRET,
  });
  await cloudinary.uploader.destroy(attachment.publicId);

  // Remove attachment from task document
  task.attachments.pull(attachment);
  await task.save();

  res.status(200).json({ success: true, data: task });
});

// @desc    Delete a task by ID
// @route   DELETE /projects/:projectId/stages/:stageId/tasks/:id
// @access  Private
const deleteTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) {
    throw new ErrorResponse("Task not found with ID: ${req.params.id}", 404);
  }
  res.status(200).json({ success: true, data: {} });
});
// @desc    Update a task to New Stage
// @route   UPDATE /projects/:projectId/stages/:stageId/tasks/:id/newStage
// @access  Private
const updateTaskToNewStage = asyncHandler(async (req, res) => {
  const { stageId, id } = req.params;
  const { toStageId, newOrder } = req.body;
  // Find the task that is being reordered
  const taskIdToUpdate = id;
  // Reorder the task in both the original and new stages
  await reorderTaskBetweenStages(taskIdToUpdate, stageId, toStageId, newOrder);
  res
    .status(200)
    .json({ success: true, message: "Reorderd task successful", data: {} });
});
// @desc    Reorder tasks
// @route   UPDATE /projects/:projectId/stages/:stageId/tasks/:id/newStage
// @access  Private
const reorderTaskWithinStage = asyncHandler(async (req, res) => {
  const { stageId, id } = req.params;
  const { newPosition } = req.body;
  reorderTask(id, stageId, newPosition);
  res
    .status(200)
    .json({ success: true, message: "Reorderd task successful", data: {} });
});

// @desc    Create a new task
// @route   POST /projects/:projectId/stages/:stageId/tasks/activity
// @access  Private

const createActivity = asyncHandler(async (req, res) => {
  const { description } = req.body;

  const task = await Task.findById(req.params.id);

  if (!task) {
    throw new ErrorResponse("Task not found with ID: ${req.params.id}", 404);
  }

  const activity = new Activity({
    description,
    sender: req.user,
    task: task._id,
  });

  await activity.save();

  const populatedActivity = await Activity.populate(activity, {
    path: "sender",
    select: "name photo", // Select only the name and photo fields
  });

  res.status(201).json({ success: true, data: populatedActivity });
});

// @desc    Get activities by task ID
// @route   GET /projects/:projectId/stages/:stageId/tasks/:taskId/activities
// @access  Private

const getActivities = asyncHandler(async (req, res) => {
  const taskId = req.params.id;

  const activities = await Activity.find({ task: taskId })
    .populate("sender", "name photo") // Populate sender field with name and photo
    .sort({ createdAt: -1 }); // Sort activities by creation date in descending order

  if (!activities) {
    throw new ErrorResponse(
      "No activities found for task with ID: ${taskId}",
      404
    );
  }

  res.status(200).json({ success: true, data: activities });
});
const reorderTask = async (taskIdToUpdate, stageId, newOrder) => {
  // Find the task that is being updated
  const taskToUpdate = await Task.findById(taskIdToUpdate);
  // Get the original order of the task that is being updated
  const originalTaskOrder = taskToUpdate.order;
  // Find all tasks in the same stage as the updated task, and whose orders need to be adjusted
  const tasksToUpdate = await Task.find({
    stage: stageId,
    order: { $gte: Math.min(originalTaskOrder, newOrder) },
    _id: { $ne: taskIdToUpdate },
  });
  // Increment or decrement the order of each of those tasks by 1, depending on whether the task is moving up or down
  for (let i = 0; i < tasksToUpdate.length; i++) {
    const task = tasksToUpdate[i];
    if (newOrder > originalTaskOrder) {
      if (task.order > originalTaskOrder && task.order <= newOrder) {
        task.order -= 1;
      }
    } else {
      if (task.order >= newOrder && task.order < originalTaskOrder) {
        task.order += 1;
      }
    }
  }
  // Set the new order of the affected task
  taskToUpdate.order = newOrder;
  // Save all modified tasks to the database
  const updatePromises = tasksToUpdate.map((task) => task.save());
  updatePromises.push(taskToUpdate.save());
  await Promise.all(updatePromises);
};
const reorderTaskBetweenStages = async (
  taskId,
  originalStageId,
  newStageId,
  newOrder
) => {
  try {
    const originalStage = await Stage.findById(originalStageId).populate(
      "tasks"
    );
    const newStage = await Stage.findById(newStageId).populate("tasks");
    const task = await Task.findById(taskId);
    // Remove task from original stage
    originalStage.tasks.splice(originalStage.tasks.indexOf(task._id), 1);
    // Update order of remaining tasks in original stage
    for (let i = task.order + 1; i < originalStage.tasks.length; i++) {
      const t = await Task.findById(originalStage.tasks[i]);
      if (t) {
        t.order--;
        await t.save();
      }
    }
    // Add task to new stage at specified position
    task.stage = newStage;
    task.order = newOrder;
    newStage.tasks.splice(newOrder, 0, task._id);
    // Update order of remaining tasks in new stage
    for (let i = newOrder + 1; i < newStage.tasks.length; i++) {
      const t = await Task.findById(newStage.tasks[i]);
      if (t) {
        t.order++;
        await t.save();
      }
    }
    await Promise.all([originalStage.save(), newStage.save(), task.save()]);
    console.log(`Task order updated for task ${taskId}`);
  } catch (err) {
    console.log(err);
  }
};
module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTaskAttachments,
  updateTask,
  deleteTaskById,
  updateTaskToNewStage,
  reorderTaskWithinStage,
  getTaskDetails,
  deleteTaskAttachment,
  createActivity,
  getActivities,
};
