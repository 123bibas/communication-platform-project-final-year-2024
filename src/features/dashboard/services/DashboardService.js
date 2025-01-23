import axios from "axios";
const BACKEND_URL = process.env.REACT_APP_BASE_URL;
export const API_URL = `${BACKEND_URL}/api/dashboard/`;
// Get All Priorities
const getAllTaskPriorities = async () => {
    const response = await axios.get(API_URL + "priority");
    return response.data;
};
// Get All Types
const getAllTaskTypes = async () => {
    const response = await axios.get(API_URL + "type");
    return response.data;
};
// Get Projects With Manager
const getAllProjectWithManager = async () => {
    const response = await axios.get(API_URL + "project");
    return response.data;
};
// Get Project, Ticket and User Count
const getProjectTaskAndUserCount = async () => {
    const response = await axios.get(API_URL + "count");
    return response.data;
};
const dashboardService = {
    getAllTaskPriorities,
    getAllTaskTypes,
    getAllProjectWithManager,
    getProjectTaskAndUserCount
}
export default dashboardService