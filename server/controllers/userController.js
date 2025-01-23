const asyncHandler = require("../middleware/async");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { generateToken, hashToken } = require("../utils");
var parser = require("ua-parser-js");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const ErrorResponse = require("../utils/errorResponse");
const Token = require("../models/tokenModel");
const crypto = require("crypto");
const Cryptr = require("cryptr");
const cloudinary = require("cloudinary").v2;
const { OAuth2Client } = require("google-auth-library");
const {
  sendNotification,
  postNotification,
} = require("./notificationController");
const cryptr = new Cryptr(process.env.CRYPTR_KEY);
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  // Validation
  if (!name || !email || !password) {
    throw new ErrorResponse("Please fill in all the required fields.", 400);
  }
  if (password.length < 6) {
    throw new ErrorResponse("Password must be up to 6 characters.", 400);
  }
  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new ErrorResponse("Email already in use.", 400);
  }
  // Get UserAgent
  const ua = parser(req.headers["user-agent"]);
  const userAgent = [ua.ua];
  //   Create new user
  const user = await User.create({
    name,
    email,
    password,
    userAgent,
  });
  if (user) {
    req.body.email = user.email;
    await verificationEmailHandler(req.body.email);
    res.status(201).json({
      success: true,
      message: "User Registration Successful",
      data: {},
    });
  } else {
    throw new ErrorResponse("Invalid user data", 400);
  }
});
// Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //   Validation
  if (!email || !password) {
    throw new ErrorResponse("Please add email and password", 400);
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new ErrorResponse("User not found, please signup", 404);
  }
  const passwordIsCorrect = await bcrypt.compare(password, user.password);
  if (!passwordIsCorrect) {
    throw new ErrorResponse("Invalid email or password", 400);
  }
  if (!passwordIsCorrect) {
    throw new ErrorResponse("Invalid email or password", 400);
  }
  if (!user.isVerified) {
    throw new ErrorResponse("Account has not been verified", 401);
  }
  // Trgger 2FA for unknow UserAgent
  const ua = parser(req.headers["user-agent"]);
  const thisUserAgent = ua.ua;
  console.log(thisUserAgent);
  const allowedAgent = user.userAgent.includes(thisUserAgent);
  if (!allowedAgent) {
    // Genrate 6 digit code
    const loginCode = Math.floor(100000 + Math.random() * 900000);
    console.log(loginCode);
    // Encrypt login code before saving to DB
    const encryptedLoginCode = cryptr.encrypt(loginCode.toString());
    // Delete Token if it exists in DB
    let userToken = await Token.findOne({ userId: user._id });
    if (userToken) {
      await userToken.deleteOne();
    }
    // Save Tokrn to DB
    await new Token({
      userId: user._id,
      lToken: encryptedLoginCode,
      createdAt: Date.now(),
      expiresAt: Date.now() + 60 * (60 * 1000), // 60mins
    }).save();
    throw new ErrorResponse("New browser or device detected", 400);
  }
  if (user && passwordIsCorrect) {
    // Generate Token
    const userInfo = {
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
    const token = generateToken(userInfo);
    // Send HTTP-only cookie
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400 * 10), // 1 day
      sameSite: "none",
      secure: true,
    });
    const { _id, name, email, phone, bio, photo, role, isVerified } = user;
    res.status(200).json({
      success: true,
      message: "Login Successful",
      data: {
        _id,
        name,
        email,
        phone,
        bio,
        photo,
        role,
        isVerified,
        token,
      },
    });
  } else {
    throw new ErrorResponse("Something went wrong, please try again", 500);
  }
});
// Send Login Code
const sendLoginCode = asyncHandler(async (req, res) => {
  const { email } = req.params;
  const user = await User.findOne({ email });
  if (!user) {
    throw new ErrorResponse("User not found", 404);
  }
  // Find Login Code in DB
  let userToken = await Token.findOne({
    userId: user._id,
    expiresAt: { $gt: Date.now() },
  });
  if (!userToken) {
    throw new ErrorResponse(
      "Invalid or Expired token, please login again",
      404
    );
  }
  const loginCode = userToken.lToken;
  const decryptedLoginCode = cryptr.decrypt(loginCode);
  // Send Login Code
  const subject = "Login Access Code - Projeeto";
  const send_to = email;
  const sent_from = process.env.EMAIL_USER;
  const reply_to = "projeeto@gmail.com";
  const template = "loginCode";
  const name = user.name;
  const link = decryptedLoginCode;
  try {
    await sendEmail(
      subject,
      send_to,
      sent_from,
      reply_to,
      template,
      name,
      link
    );
    res.status(200).json({
      success: true,
      message: `Access code sent to ${email}`,
      data: {},
    });
  } catch (error) {
    throw new ErrorResponse("Email not sent, please try again", 500);
  }
});
// Login With Code
const loginWithCode = asyncHandler(async (req, res) => {
  const { email } = req.params;
  const { loginCode } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new ErrorResponse("User not found", 404);
  }
  if (!user.isVerified) {
    throw new ErrorResponse("User not verified", 401);
  }
  // Find user Login Token
  const userToken = await Token.findOne({
    userId: user.id,
    expiresAt: { $gt: Date.now() },
  });
  if (!userToken) {
    throw new ErrorResponse(
      "Invalid or Expired Token, please login again",
      404
    );
  }
  const decryptedLoginCode = cryptr.decrypt(userToken.lToken);
  if (loginCode !== decryptedLoginCode) {
    throw new ErrorResponse("Incorrect login code, please try again");
  } else {
    // Register userAgent
    const ua = parser(req.headers["user-agent"]);
    const thisUserAgent = ua.ua;
    user.userAgent.push(thisUserAgent);
    await user.save();
    // Generate Token
    const userInfo = {
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
    const token = generateToken(userInfo);
    // Send HTTP-only cookie
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400 * 10), // 1 day
      sameSite: "none",
      secure: true,
    });
    const { _id, name, email, phone, bio, photo, role, isVerified } = user;
    res.status(200).json({
      success: true,
      message: "Login successful with the login code",
      data: {
        _id,
        name,
        email,
        phone,
        bio,
        photo,
        role,
        isVerified,
        token,
      },
    });
  }
});
// Send Verification Email
const sendVerificationEmail = asyncHandler(async (req, res) => {
  try {
    await verificationEmailHandler(req.body.email);
    res.status(200).json({
      success: true,
      message: "Verification Email Sent",
      data: {},
    });
  } catch (error) {
    throw new ErrorResponse("Email not sent, please try again", 500);
  }
});
// Verify User
const verifyUser = asyncHandler(async (req, res) => {
  const { verificationToken } = req.params;
  const hashedToken = hashToken(verificationToken);
  const userToken = await Token.findOne({
    vToken: hashedToken,
    expiresAt: { $gt: Date.now() },
  });
  if (!userToken) {
    throw new ErrorResponse("Invalid or Expired Token", 404);
  }
  // Find User
  const user = await User.findOne({ _id: userToken.userId });
  if (user.isVerified) {
    throw new ErrorResponse("User is already verified", 400);
  }
  // Now verify user
  user.isVerified = true;
  await user.save();
  res.status(200).json({
    success: true,
    message: "User has been verified",
    data: {},
  });
});
// Logout User
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0), // 1 day
    sameSite: "none",
    secure: true,
  });
  return res.status(200).json({
    success: true,
    message: "Logout successful",
    data: {},
  });
});
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    const { _id, name, email, phone, bio, photo, role, isVerified } = user;
    res.status(200).json({
      success: true,
      message: `This is ${name} user `,
      data: {
        _id,
        name,
        email,
        phone,
        bio,
        photo,
        role,
        isVerified,
      },
    });
  } else {
    throw new ErrorResponse("User not found", 404);
  }
});
// Update User
const updateUser = asyncHandler(async (req, res) => {
  const { photo } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User couldnot be found",
      data: {},
    });
  }

  // Configuration
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API,
    api_secret: process.env.CLOUDINARY_SECRET,
  });
  const imageResponse = await cloudinary.uploader.upload(photo, {
    public_id: `${user.name}_Profile`,
  });
  if (user) {
    const { name, email, phone, bio, photo, role, isVerified } = user;
    user.email = email;
    user.name = name;
    user.phone = req.body.phone || phone;
    user.bio = req.body.bio || bio;
    user.photo = imageResponse.secure_url || photo;
    const updatedUser = await user.save();
    res.status(200).json({
      success: true,
      message: "User Updated Succesfully",
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        bio: updatedUser.bio,
        photo: updatedUser.photo,
        role: updatedUser.role,
        isVerified: updatedUser.isVerified,
      },
    });
  } else {
    throw new ErrorResponse("User not found", 404);
  }
});
// Delete User
const deleteUser = asyncHandler(async (req, res) => {
  const user = User.findById(req.params.id);
  if (!user) {
    throw new ErrorResponse("User not found", 404);
  }
  await user.remove();
  res.status(200).json({
    success: true,
    message: "User deleted successfully",
    data: {},
  });
});
// Get Users
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort("-createdAt").select("-password");
  if (!users) {
    throw new ErrorResponse("Something went wrong", 500);
  }
  res.status(200).json(res.advancedResults);
});
// Get Login Status
const loginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    throw new ErrorResponse("Invalid token", 500);
  }
  // Verify token
  const verified = jwt.verify(token, process.env.JWT_SECRET);
  if (verified) {
    return res
      .status(200)
      .json({ success: true, message: "User is Logged in", data: true });
  }
  throw new ErrorResponse("Invalid token", 500);
});
const upgradeUser = asyncHandler(async (req, res) => {
  const { role, id } = req.body;
  const user = await User.findById(id);
  if (!user) {
    throw new ErrorResponse("User not found", 404);
  }
  const allowedRoles = ["admin", "manager", "user", "team", "suspended"];
  const isRoleAllowed = allowedRoles.includes(role);
  if (!isRoleAllowed) {
    throw new ErrorResponse(`The ${role} is not allowed`, 400);
  }
  user.role = role;
  await user.save();
  const notificationData = {
    user: user,
    updatedBy: req.user,
    message: `Your role has been upgraded to ${user.role} `,
    type: "role-update",
    read: "false",
  };
  await postNotification(notificationData);
  try {
    await sendEmail(
      (subject = "Role Chnage"),
      (send_to = user.email),
      (sent_from = process.env.EMAIL_USER),
      (reply_to = "projeeto@gmail.com"),
      (template = "changeRole"),
      (name = user.name),
      (link = process.env.FRONTEND_URL)
    );
  } catch (e) {
    res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      data: {},
    });
  }
  res.status(200).json({
    success: true,
    message: `User role updated to ${role}`,
    data: {},
  });
});
// Send Automated emails
const sendAutomatedEmail = asyncHandler(async (req, res) => {
  const {
    subject,
    send_to,
    reply_to = "projeeto@gmail.com",
    template = "general",
    url = "",
    message,
  } = req.body;
  if (!subject || !send_to || !reply_to || !template) {
    throw new ErrorResponse("Missing email parameter", 500);
  }
  // Get user
  const user = await User.findOne({ email: send_to });
  if (!user) {
    throw new ErrorResponse("User not found", 404);
  }
  const sent_from = process.env.EMAIL_USER;
  const name = user.name;
  const link = `${process.env.FRONTEND_URL}${url}`;
  try {
    await sendEmail(
      subject,
      send_to,
      sent_from,
      reply_to,
      template,
      name,
      link,
      message
    );
    res.status(200).json({ success: true, message: "Email Sent", data: {} });
  } catch (error) {
    throw new ErrorResponse("Email not sent, please try again", 500);
  }
});
// Send Automated general emails to Users
const sendEmailToUsers = asyncHandler(async (req, res) => {
  const {
    subject,
    reply_to = "projeeto@gmail.com",
    url = "",
    message,
    usersToSend,
  } = req.body;
  const template = "general";
  if (!subject || !usersToSend || !reply_to || !template) {
    throw new ErrorResponse("Missing email parameter", 500);
  }
  //loops in all the users to send
  try {
    for (let i = 0; i < usersToSend.length; i++) {
      // Get user
      const user = await User.findById(usersToSend[i]);
      if (user) {
        const sent_from = process.env.EMAIL_USER;
        const name = user.name;
        const link = `${process.env.FRONTEND_URL}${url}`;
        await sendEmail(
          subject,
          (send_to = user.email),
          sent_from,
          reply_to,
          template,
          name,
          link,
          message
        );
      }
    }
    res.status(200).json({ success: true, message: "Email Sent", data: {} });
  } catch (error) {
    throw new ErrorResponse("Email not sent, please try again", 500);
  }
});
// Forgot Password
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new ErrorResponse("No user with this email", 404);
  }
  // Delete Token if it exists in DB
  let token = await Token.findOne({ userId: user._id });
  if (token) {
    await token.deleteOne();
  }
  //   Create Verification Token and Save
  const resetToken = crypto.randomBytes(32).toString("hex") + user._id;
  console.log(resetToken);
  // Hash token and save
  const hashedToken = hashToken(resetToken);
  await new Token({
    userId: user._id,
    rToken: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 60 * (60 * 1000), // 60mins
  }).save();
  // Construct Reset URL
  const resetUrl = `${process.env.FRONTEND_URL}/resetPassword/${resetToken}`;
  // Send Email
  const subject = "Password Reset Request - Projeeto";
  const send_to = user.email;
  const sent_from = process.env.EMAIL_USER;
  const reply_to = "projeeto@gmail.com";
  const template = "forgotPassword";
  const name = user.name;
  const link = resetUrl;
  try {
    await sendEmail(
      subject,
      send_to,
      sent_from,
      reply_to,
      template,
      name,
      link
    );
    res
      .status(200)
      .json({ success: true, message: "Password Reset Email Sent", data: {} });
  } catch (error) {
    throw new ErrorResponse("Email not sent, please try again", 500);
  }
});
// Reset Password
const resetPassword = asyncHandler(async (req, res) => {
  const { resetToken } = req.params;
  const { password } = req.body;
  console.log(resetToken);
  console.log(password);
  const hashedToken = hashToken(resetToken);
  const userToken = await Token.findOne({
    rToken: hashedToken,
    expiresAt: { $gt: Date.now() },
  });
  if (!userToken) {
    throw new ErrorResponse("Invalid or Expired Token", 404);
  }
  // Find User
  const user = await User.findOne({ _id: userToken.userId });
  // Now Reset password
  user.password = password;
  await user.save();
  res.status(200).json({
    success: true,
    message: "Password Reset Successful, please login",
    data: {},
  });
});
// Change Password
const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, password } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ErrorResponse("User not found", 404);
  }
  if (!oldPassword || !password) {
    throw new ErrorResponse("Please enter old and new password", 400);
  }
  // Check if old password is correct
  const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password);
  // Save new password
  if (user && passwordIsCorrect) {
    user.password = password;
    await user.save();
    res.status(200).json({
      success: true,
      message: "Password changed successful",
      data: {},
    });
  } else {
    throw new ErrorResponse("Old password is incorrect", 400);
  }
});
const loginWithGoogle = asyncHandler(async (req, res) => {
  const { userToken } = req.body;
  //   console.log(userToken);
  const ticket = await client.verifyIdToken({
    idToken: userToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  const { name, email, picture, sub } = payload;
  const password = Date.now() + sub;
  // Get UserAgent
  const ua = parser(req.headers["user-agent"]);
  const userAgent = [ua.ua];
  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    //   Create new user
    const newUser = await User.create({
      name,
      email,
      password,
      photo: picture,
      isVerified: true,
      userAgent,
    });
    if (newUser) {
      // Generate Token
      const userInfo = {
        _id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      };
      const token = generateToken(userInfo);
      // Send HTTP-only cookie
      res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400 * 10), // 1 day
        sameSite: "none",
        secure: true,
      });
      const { _id, name, email, phone, bio, photo, role, isVerified } = newUser;
      res.status(201).json({
        success: true,
        message: "Login with Google Succesful",
        data: {
          _id,
          name,
          email,
          phone,
          bio,
          photo,
          role,
          isVerified,
          token,
        },
      });
    }
  }
  // User exists, login
  if (user) {
    const userInfo = {
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
    const token = generateToken(userInfo);
    // Send HTTP-only cookie
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400 * 10), // 1 day
      sameSite: "none",
      secure: true,
    });
    const { _id, name, email, phone, bio, photo, role, isVerified } = user;
    res.status(201).json({
      success: true,
      message: "Login with Google Successful",
      data: {
        _id,
        name,
        email,
        phone,
        bio,
        photo,
        role,
        isVerified,
        token,
      },
    });
  }
});
const verificationEmailHandler = async (email) => {
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new ErrorResponse("User not found", 404);
  }
  if (user.isVerified) {
    throw new ErrorResponse("User already verified", 400);
  }
  // Delete Token if it exists in DB
  let token = await Token.findOne({ userId: user._id });
  if (token) {
    await token.deleteOne();
  }
  //   Create Verification Token and Save
  const verificationToken = crypto.randomBytes(32).toString("hex") + user._id;
  console.log(verificationToken);
  // Hash token and save
  const hashedToken = hashToken(verificationToken);
  await new Token({
    userId: user._id,
    vToken: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 60 * (60 * 1000), // 60mins
  }).save();
  // Construct Verification URL
  const verificationUrl = `${process.env.FRONTEND_URL}/verify/${verificationToken}`;
  // Send Email
  const subject = "Verify Your Account - Projeeto";
  const send_to = user.email;
  const sent_from = process.env.EMAIL_USER;
  const reply_to = "projeeto@gmail.com";
  const template = "verifyEmail";
  const name = user.name;
  const link = verificationUrl;
  try {
    await sendEmail(
      subject,
      send_to,
      sent_from,
      reply_to,
      template,
      name,
      link
    );
  } catch (error) {
    throw new ErrorResponse("Email not sent, please try again", 500);
  }
};
const getAllManagers = asyncHandler(async (req, res) => {
  const allManagers = await User.find({ role: "manager" }).select(
    "name email photo"
  );
  res.status(200).json({
    message: "All managers ",
    success: true,
    data: allManagers,
  });
});
const getAllTeamMembers = asyncHandler(async (req, res) => {
  const allTeamMembers = await User.find({ role: "team" }).select(
    "name email photo"
  );
  res.status(200).json({
    message: "All team ",
    success: true,
    data: allTeamMembers,
  });
});
const getAllMembersById = asyncHandler(async (req, res) => {
  const { ids } = req.body;
  const users = [];
  for (let i = 0; i < ids.length; i++) {
    const user = await User.findById(ids[i]).select("name email photo");
    users.push(user);
  }
  res.status(200).json({
    message: "All Members  ",
    success: true,
    data: users,
  });
});
module.exports = {
  getAllManagers,
  getAllTeamMembers,
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  getAllMembersById,
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
  sendEmailToUsers,
};
