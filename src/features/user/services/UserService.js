import axios from "axios";
const BACKEND_URL = process.env.REACT_APP_BASE_URL;
export const API_URL = `${BACKEND_URL}/api/users/`;
// Validate email
export const validateEmail = (email) => {
    return email.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
// Register User
const register = async (userData) => {
    const response = await axios.post(API_URL + "register", userData);
    console.log(response.data)
    return response.data;
};
// Login User
const login = async (userData) => {
    const response = await axios.post(API_URL + "login", userData);
    console.log(response.data)
    return response.data;
};
// Logout User
const logout = async () => {
    const response = await axios.get(API_URL + "logout");
    return response.data;
};
// Get Login Status
const getLoginStatus = async () => {
    const response = await axios.get(API_URL + "loginStatus");
    return response.data;
};
// Get user profile
const getUser = async () => {
    const response = await axios.get(API_URL + "getUser");
    return response.data;
};
// Update profile
const updateUser = async (userData) => {
    const response = await axios.patch(API_URL + "updateUser", userData);
    return response.data;
};
// Send Verification Email
const sendVerificationEmail = async () => {
    const response = await axios.post(API_URL + "sendVerificationEmail");
    return response.data;
};
// Verify User
const verifyUser = async (verificationToken) => {
    const response = await axios.patch(
        `${API_URL}verifyUser/${verificationToken}`
    );
    return response.data;
};
// Change Password
const changePassword = async (userData) => {
    const response = await axios.patch(API_URL + "changePassword", userData);
    return response.data;
};
// Reset Password
const resetPassword = async (userData, resetToken) => {
    const response = await axios.patch(
        `${API_URL}resetPassword/${resetToken}`,
        userData
    );
    return response.data;
};
// fORGOT Password
const forgotPassword = async (userData) => {
    const response = await axios.post(API_URL + "forgotPassword", userData);
    return response.data;
};
// Get Users
const getUsers = async (advQuery) => {
    const response = await axios.get(API_URL + "getUsers", {
        params: {
            search: advQuery.search,
            page: advQuery.page,
            limit: advQuery.limit,
            sort: advQuery.sort,
        }
    });
    return response.data;
};
//Get Managers
const getManagers = async () => {
    const response = await axios.get(API_URL + "getManagers");
    return response.data;
};
//Get Managers
const getTeamMembers = async () => {
    const response = await axios.get(API_URL + "getTeam");
    return response.data;
};
//Get Memebers by Ids
const getMembers = async (ids) => {
    const response = await axios.post(API_URL + "members", { ids });
    return response.data;
};
// Delete User
const deleteUser = async (id) => {
    const response = await axios.delete(API_URL + id);
    return response.data;
};
// Upgrade User
const upgradeUser = async (userData) => {
    const response = await axios.post(API_URL + "upgradeUser", userData);
    return response.data;
};
// Send Login Code
const sendLoginCode = async (email) => {
    const response = await axios.post(API_URL + `sendLoginCode/${email}`);
    return response.data;
};
// Login With Code
const loginWithCode = async (code, email) => {
    const response = await axios.post(API_URL + `loginWithCode/${email}`, code);
    return response.data;
};
// Login With Googlr
const loginWithGoogle = async (userToken) => {
    const response = await axios.post(API_URL + "google/callback", userToken);
    return response.data;
};
// Send Email to users
const sendEmailToUsers = async (data) => {
    const response = await axios.post(API_URL + "sendEmail", data);
    return response.data;
};
const authService = {
    register,
    login,
    logout,
    getLoginStatus,
    getUser,
    updateUser,
    sendVerificationEmail,
    verifyUser,
    changePassword,
    forgotPassword,
    resetPassword,
    getUsers,
    getMembers,
    getManagers,
    getTeamMembers,
    deleteUser,
    upgradeUser,
    sendLoginCode,
    loginWithCode,
    loginWithGoogle,
    sendEmailToUsers,
};
export default authService;
