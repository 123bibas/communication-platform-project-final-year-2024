const mongoose = require("mongoose");

// Define a separate schema for the photo
const AttachmentSchema = new mongoose.Schema({
  publicId: {
    type: String,
  },
  url: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now, // Automatically set the date to the current date and time
  },
  fileName: {
    type: String,
  },
  format: {
    type: String,
  },
});
const TaskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
    unique: true,
    trim: true,
    maxlength: [50, "Name can not be more than 50 characters"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
    maxlength: [200, "Description can not be more than 200 characters"],
  },

  attachments: {
    type: [AttachmentSchema],
    required: false, // Array of photo objects
    default: [], // Default to an empty array if no photos are provided
  },
  priority: {
    type: [String],
    required: true,
    default: "Low",
    enum: ["Low", "Medium", "High", "Urgent"],
  },
  type: {
    type: [String],
    required: true,
    default: "Low",
    enum: ["Bug", "New Feature", "Update", "Others"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  stage: {
    type: mongoose.Schema.ObjectId,
    ref: "Stage",
    required: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  assignees: {
    type: [mongoose.Schema.ObjectId],
    ref: "User",
    required: true,
  },
  createdBy: {
    type: [mongoose.Schema.ObjectId],
    ref: "User",
  },
});
module.exports = mongoose.model("Task", TaskSchema);
