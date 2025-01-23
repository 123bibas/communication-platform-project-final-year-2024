// // Move task to another stage
// const  updateTaskToNewStage
//   // Reorder tasks within a stage
//   const reorderTaskWithinStage 
import axios from "axios";
const BACKEND_URL = process.env.REACT_APP_BASE_URL;
export const API_URL = `${BACKEND_URL}/api/stages/`;
// Get getStage 
const getTask = async (id) => {
    const response = await axios.get(API_URL + id);
    return response.data;
}
// Get getTasks 
const getAllTasks = async (id) => {
    const response = await axios.get(API_URL);
    return response.data;
}
// Create stage
const createTask = async (data) => {
    const response = await axios.post(API_URL, data);
    return response.data;
}
const stageService = {
    getAllTasks,
    getStage,
    createTask
};
export default stageService;