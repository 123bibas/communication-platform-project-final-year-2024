const mongoose = require("mongoose");
const AcitivitySchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, "Please add a name"],
    trim: true,
    maxlength: [1000, "Name can not be more than 1000 characters"],
  },
  sender: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  task: {
    type: mongoose.Schema.ObjectId,
    ref: "Task",
    required: true,
  },
});

module.exports = mongoose.model("Activity", AcitivitySchema);
