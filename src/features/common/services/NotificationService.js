import axios from "axios";
const BACKEND_URL = process.env.REACT_APP_BASE_URL;
export const API_URL = `${BACKEND_URL}/api/notifications/`;
// Get notifications of a  User
const getNotifications = async (id) => {
    const response = await axios.get(API_URL + id);
    return response.data;
}
// Read notifications of a  User
const readNotifications = async () => {
    const response = await axios.get(API_URL + "seen");
    return response.data;
};
const notificationService = {
    getNotifications,
    readNotifications
};
export default notificationService;