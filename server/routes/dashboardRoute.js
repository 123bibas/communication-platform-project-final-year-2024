const express = require("express")
const router = express.Router()
const { protect, adminOnly } = require("../middleware/authMiddleware")
const { getTaskPriority, getTaskType, getProjectWithManagerType, getProjectTaskAndUserCount } = require("../controllers/dashboardController")
router.get("/priority", protect, adminOnly, getTaskPriority),
    router.get("/type", protect, adminOnly, getTaskType),
    router.get("/project", protect, adminOnly, getProjectWithManagerType),
    router.get("/count", protect, adminOnly, getProjectTaskAndUserCount),
    // router.get("/:id", protect, getProjectById)
    module.exports = router