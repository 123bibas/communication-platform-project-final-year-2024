const express = require("express")
const router = express.Router()
const stageRouter = require('./stageRoute')
// Re-route into other resource routers
router.use('/:projectId/stages', stageRouter)
const {
    protect,
    adminOnly,
    managerAndAdminOnly,
} = require("../middleware/authMiddleware")
const {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProjectById,
    getAllTeamProjects
} = require("../controllers/projectController")
router.get("/", protect, getAllProjects),
    router.get("/user", protect, getAllTeamProjects)
router.get("/:id", protect, getProjectById)
router.post("/", protect, adminOnly, createProject)
router.put("/:id", protect, managerAndAdminOnly, updateProject)
router.delete("/:id", protect, adminOnly, deleteProjectById)
module.exports = router
