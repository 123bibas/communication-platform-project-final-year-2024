const express = require("express");
const router = express.Router();
const {
  protect,
  adminOnly,
  managerAndAdminOnlyly,
} = require("../middleware/authMiddleware");
const {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  updateUser,
  deleteUser,
  getUsers,
  loginStatus,
  upgradeUser,
  sendAutomatedEmail,
  sendVerificationEmail,
  verifyUser,
  forgotPassword,
  resetPassword,
  changePassword,
  sendLoginCode,
  loginWithCode,
  loginWithGoogle,
  getAllManagers,
  getAllTeamMembers,
  getAllMembersById,
  sendEmailToUsers
} = require("../controllers/userController");
const advancedResults = require("../middleware/advancedResult");
const User = require("../models/userModel");
const uploadFunc = require("../multer/multerConfig");
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/getUser", protect, getUser)
router.get("/getManagers", protect, adminOnly, getAllManagers)
router.get("/getTeam", protect, getAllTeamMembers)
router.post("/members", protect, adminOnly, getAllMembersById)
router.patch("/updateUser", uploadFunc.single('photo'), protect, updateUser);
router.delete("/:id", protect, adminOnly, deleteUser);
router.get("/getUsers", protect, adminOnly, advancedResults(User), getUsers);
router.get("/loginStatus", loginStatus);
router.post("/upgradeUser", protect, adminOnly, upgradeUser);
router.post("/sendAutomatedEmail", protect, sendAutomatedEmail)
router.post("/sendEmail", protect, adminOnly, sendEmailToUsers)
router.post("/sendVerificationEmail", sendVerificationEmail);
router.patch("/verifyUser/:verificationToken", verifyUser);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:resetToken", resetPassword);
router.patch("/changePassword", protect, changePassword);
router.post("/sendLoginCode/:email", sendLoginCode);
router.post("/loginWithCode/:email", loginWithCode);
router.post("/google/callback", loginWithGoogle);
module.exports = router;
