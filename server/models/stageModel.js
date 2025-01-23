const mongoose = require("mongoose");
const StageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],

      trim: true,
      maxlength: [20, "Name can not be more than 20 characters"],
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
      maxlength: [50, "Description can not be more than 50 characters"],
    },
    color: {
      type: String,
      required: false,
      trim: true,
      default: "neutral",
      maxlength: [20, "Color can not be more than 20 characters"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    order: {
      type: Number,
      default: 0,
    },
    project: {
      type: mongoose.Schema.ObjectId,
      ref: "Project",
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
// Reverse populate with virtuals
StageSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "stage",
  justOne: false,
});
//cascade delete task when a project is deleted
StageSchema.pre("remove", async function (next) {
  console.log("task being removed from stage", this._id);
  await this.model("Task").deleteMany({ task: this._id });
  next();
});
module.exports = mongoose.model("Stage", StageSchema);
