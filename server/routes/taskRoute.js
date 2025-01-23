const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  protect,
  adminOnly,
  managerAndAdminOnlyly,
} = require("../middleware/authMiddleware");

const uploadFunc = require("../multer/multerConfig");
const {
  createTask,
  getAllTasks,
  getTaskById,
  getTaskDetails,
  updateTask,
  deleteTaskById,
  reorderTaskWithinStage,
  updateTaskToNewStage,
  updateTaskAttachments,
  deleteTaskAttachment,
  createActivity,
  getActivities,
} = require("../controllers/taskController");
const multer = require("multer");
router.get("/", protect, getAllTasks);
router.get("/:id", protect, getTaskById);
router.get("/:id/details", protect, getTaskDetails);
router.get("/:id/activity", protect, getActivities);
router.post("/", protect, createTask);

router.put("/:id", protect, updateTask);
router.put("/:id/attachment", protect, deleteTaskAttachment);
router.post("/:id/activity", protect, createActivity);

// router.put(
//   "/:id/file",
//   uploadFunc.single("files"),
//   protect,
//   updateTaskAttachments
// );

router.put(
  "/:id/file",
  uploadFunc.single("file"),
  protect,
  updateTaskAttachments
);
router.put("/:id/newStage", protect, updateTaskToNewStage);
router.put("/:id/reorder", protect, reorderTaskWithinStage);
router.delete("/:id", protect, deleteTaskById);

module.exports = router;
