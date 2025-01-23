import axios from "axios";
const BACKEND_URL = process.env.REACT_APP_BASE_URL;
export const API_URL = `${BACKEND_URL}/api/stages/`;
// Get getStage 
const getStage = async (id) => {
    const response = await axios.get(API_URL + id);
    return response.data;
}
// Get getStages 
const getAllStages = async (id) => {
    const response = await axios.get(API_URL);
    return response.data;
}
// Create stage
const createStage = async (data) => {
    const response = await axios.post(API_URL, data);
    return response.data;
}
const stageService = {
    getAllStages,
    getStage,
    createStage
};
export default stageService;