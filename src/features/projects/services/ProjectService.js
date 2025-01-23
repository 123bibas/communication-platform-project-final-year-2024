import axios from "axios";
const BACKEND_URL = process.env.REACT_APP_BASE_URL;
const API_URL = `${BACKEND_URL}/api`;
// Projects
// Get getProject
const getProject = async (id) => {
  const response = await axios.get(API_URL + "/projects/" + id);
  return response.data;
};
// Get getProjects
const getAllProjects = async (id) => {
  const response = await axios.get(API_URL + "/projects");
  return response.data;
};
// Get getProjects
const getAllTeamProjects = async () => {
  const response = await axios.get(API_URL + "/projects/user");
  return response.data;
};
// Create project
const createProject = async (data) => {
  const response = await axios.post(API_URL + "/projects", data);
  return response.data;
};
// Edit project
const editProject = async (id, data) => {
  const response = await axios.put(API_URL + "/projects/" + id, data);
  return response.data;
};
// Delete Project
const deleteProject = async (id) => {
  const response = await axios.delete(API_URL + "/projects" + `/${id}`);
  return response.data;
};
//Stages
// Get getStagesByProjectId
const getStages = async (id) => {
  const response = await axios.get(API_URL + "/projects/" + id + "/stages");
  return response.data;
};
const createStage = async (id, data) => {
  const response = await axios.post(
    API_URL + "/projects/" + id + "/stages",
    data
  );
  return response.data;
};
//Tasks
// Move task to another stage
const updateTaskToNewStage = async (paramIds, data) => {
  const response = await axios.put(
    `${API_URL}/stages/${paramIds.stageId}/tasks/${paramIds.id}/newStage`,
    data
  );
  return response.data;
};
// Reorder tasks within a stage
const reorderTaskWithinStage = async (paramIds, data) => {
  const response = await axios.put(
    `${API_URL}/stages/${paramIds.stageId}/tasks/${paramIds.id}/reorder`,
    data
  );
  return response.data;
};

const getTaskById = async (paramIds) => {
  const response = await axios.get(
    `${API_URL}/stages/${paramIds.stageId}/tasks/${paramIds.id}`
  );
  return response.data;
};

const getTaskDetails = async (stageId, id) => {
  const response = await axios.get(
    `${API_URL}/stages/${stageId}/tasks/${id}/details`
  );
  return response.data;
};
// Create task
const createTask = async (stageId, data) => {
  const response = await axios.post(`${API_URL}/stages/${stageId}/tasks`, data);
  return response.data;
};
//Update Task
const updateTask = async (paramIds, data) => {
  const response = await axios.put(
    `${API_URL}/stages/${paramIds.stageId}/tasks/${paramIds.id}`,
    data
  );
  return response.data;
};

//Cretae Acitivty
const createActivity = async (paramIds, data) => {
  const response = await axios.post(
    `${API_URL}/stages/${paramIds.stageId}/tasks/${paramIds.id}/activity`,
    data
  );
  return response.data;
};

//Cretae Acitivty
const getActivities = async (paramIds) => {
  const response = await axios.get(
    `${API_URL}/stages/${paramIds.stageId}/tasks/${paramIds.id}/activity`
  );
  return response.data;
};

//Update Task
const deleteTaskAttachment = async (paramIds, data) => {
  const response = await axios.put(
    `${API_URL}/stages/${paramIds.stageId}/tasks/${paramIds.id}/attachment`,
    data
  );
  return response.data;
};

// Update Task
const updateTaskAttachments = async (paramIds, formData) => {
  try {
    console.log("mydata", formData);
    const response = await axios.put(
      `${API_URL}/stages/${paramIds.stageId}/tasks/${paramIds.id}/file`,
      formData
    );
    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

//Update Task
const deleteTask = async (paramIds) => {
  const response = await axios.delete(
    `${API_URL}/stages/${paramIds.stageId}/tasks/${paramIds.id}`
  );
  return response.data;
};
const projectService = {
  getAllProjects,
  getProject,
  createProject,
  getStages,
  updateTaskToNewStage,
  reorderTaskWithinStage,
  updateTask,
  deleteTask,
  createTask,
  getTaskById,
  getAllTeamProjects,
  createStage,
  deleteProject,
  editProject,
  updateTaskAttachments,
  getTaskDetails,
  deleteTaskAttachment,
  createActivity,
  getActivities,
};
export default projectService;
