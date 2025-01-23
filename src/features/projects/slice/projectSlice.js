import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import projectService from "../services/ProjectService";
const initialState = {
  project: {},
  projects: [],
  stages: [],
  stage: {},
  task: {},
  updatedTask: {},
  isError: false,
  isSuccess: false,
  isProjectDelete: false,
  isLoading: false,
  message: "",
  taskActivities: [],
};
const setErrorFromResponse = (error) => {
  let message = "";
  if (error.response) {
    message = error.response.data.message;
  } else {
    message = error.message;
  }
  return message;
};
// create Project
export const createProject = createAsyncThunk(
  "project/create",
  async (data, thunkAPI) => {
    try {
      return await projectService.createProject(data);
    } catch (error) {
      const message = setErrorFromResponse(error);
      return thunkAPI.rejectWithValue(message);
    }
  }
);
// edit Project
export const editProject = createAsyncThunk(
  "project/edit",
  async ({ paramId, data }, thunkAPI) => {
    try {
      return await projectService.editProject(paramId, data);
    } catch (error) {
      const message = setErrorFromResponse(error);
      return thunkAPI.rejectWithValue(message);
    }
  }
);
// get all the project related the user
export const getTeamProject = createAsyncThunk(
  "project/getTeamProject",
  async (_, thunkAPI) => {
    try {
      return await projectService.getAllTeamProjects();
    } catch (error) {
      const message = setErrorFromResponse(error);
      return thunkAPI.rejectWithValue(message);
    }
  }
);
// Delete Project
export const deleteProject = createAsyncThunk(
  "project/deleteProject",
  async (projectId, thunkAPI) => {
    try {
      return await projectService.deleteProject(projectId);
    } catch (error) {
      const message = setErrorFromResponse(error);
      return thunkAPI.rejectWithValue(message);
    }
  }
);
// Get stages By Project Id
export const getStages = createAsyncThunk(
  "project/getStages",
  async (projectId, thunkAPI) => {
    try {
      return await projectService.getStages(projectId);
    } catch (error) {
      const message = setErrorFromResponse(error);
      return thunkAPI.rejectWithValue(message);
    }
  }
);
// Create stage
export const createStage = createAsyncThunk(
  "project/createStage",
  async ({ projectId, data }, thunkAPI) => {
    try {
      return await projectService.createStage(projectId, data);
    } catch (error) {
      const message = setErrorFromResponse(error);
      return thunkAPI.rejectWithValue(message);
    }
  }
);
// Update task
export const addTask = createAsyncThunk(
  "project/addTask",
  async ({ stageId, data }, thunkAPI) => {
    try {
      return await projectService.createTask(stageId, data);
    } catch (error) {
      const message = setErrorFromResponse(error);
      return thunkAPI.rejectWithValue(message);
    }
  }
);
// Update task
export const updateTask = createAsyncThunk(
  "project/updateTask",
  async ({ paramIds, data }, thunkAPI) => {
    try {
      return await projectService.updateTask(paramIds, data);
    } catch (error) {
      const message = setErrorFromResponse(error);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// create task activity
export const createActivity = createAsyncThunk(
  "project/createActivity",
  async ({ paramIds, data }, thunkAPI) => {
    try {
      return await projectService.createActivity(paramIds, data);
    } catch (error) {
      const message = setErrorFromResponse(error);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// get taskactivity
export const getActivities = createAsyncThunk(
  "project/getActivities",
  async (paramIds, thunkAPI) => {
    try {
      return await projectService.getActivities(paramIds);
    } catch (error) {
      const message = setErrorFromResponse(error);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get Task Details task
export const getTaskDetails = createAsyncThunk(
  "project/getTaskDetails",
  async ({ stageId, id }, thunkAPI) => {
    try {
      return await projectService.getTaskDetails(stageId, id);
    } catch (error) {
      const message = setErrorFromResponse(error);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update attachment
export const updateTaskAttachment = createAsyncThunk(
  "project/updateTaskAttachment",
  async ({ paramIds, data }, thunkAPI) => {
    try {
      return await projectService.updateTaskAttachments(paramIds, data);
    } catch (error) {
      const message = setErrorFromResponse(error);
      return thunkAPI.rejectWithValue(message);
    }
  }
);
// Delete task
export const deleteTask = createAsyncThunk(
  "project/deleteTask",
  async (paramIds, thunkAPI) => {
    try {
      return await projectService.deleteTask(paramIds);
    } catch (error) {
      const message = setErrorFromResponse(error);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete Task Attachment
export const deleteTaskAttachment = createAsyncThunk(
  "project/deleteTaskAttachment",
  async ({ paramIds, data }, thunkAPI) => {
    try {
      return await projectService.deleteTaskAttachment(paramIds, data);
    } catch (error) {
      const message = setErrorFromResponse(error);
      return thunkAPI.rejectWithValue(message);
    }
  }
);
const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    RESET(state) {
      state.project = {};
      state.stages = [];
      state.task = {};
      state.updatedTask = {};
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
      state.taskActivities = [];
    },
    RESET_TASK(state) {
      state.projects = [];
      state.project = {};
      state.isProjectDelete = false;
      state.stage = {};
      state.stages = [];
      state.task = {};
      state.updatedTask = {};
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
      state.taskActivities = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Get stages
      .addCase(getStages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getStages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.stages = action.payload.data;
        state.message = action.payload.message;
        toast.success("All tasks");
      })
      .addCase(getStages.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      // get Team Project
      .addCase(getTeamProject.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTeamProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.projects = action.payload.data;
        state.message = action.payload.message;
      })
      .addCase(getTeamProject.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      .addCase(getTaskDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTaskDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        const assigneesList = action.payload.data.assignees.map(
          (assignee) => assignee._id
        );
        state.updatedTask = {
          ...action.payload.data,
          assignees: assigneesList,
        };
      })
      .addCase(getTaskDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      .addCase(deleteProject.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isProjectDelete = true;
        state.message = action.payload.message;
        toast.success("Project Deleted Successfully");
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      .addCase(createStage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createStage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.stage = action.payload.data;
        state.message = action.payload.message;
        toast.success("Stage Created Succesfully");
      })
      .addCase(createStage.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      .addCase(createProject.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.project = action.payload.data;
        state.message = action.payload.message;
        toast.success("Project Created Succesfully");
      })
      .addCase(createProject.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      .addCase(editProject.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.project = action.payload.data;
        state.message = action.payload.message;
        toast.success("Project Edit Succesfully");
      })
      .addCase(editProject.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      .addCase(addTask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.task = action.payload.data;
        state.message = action.payload.message;
        toast.success("Task Created Succesfully");
      })
      .addCase(addTask.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      .addCase(updateTask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.updatedTask = action.payload.data;
        state.message = action.payload.message;
        toast.success("Updated Task Succesfully");
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      .addCase(createActivity.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      .addCase(createActivity.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createActivity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.taskActivities = [action.payload.data, ...state.taskActivities];

        state.message = action.payload.message;
        toast.success("Activity added");
      })
      .addCase(getActivities.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      .addCase(getActivities.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getActivities.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.taskActivities = action.payload.data;
        state.message = action.payload.message;
      })

      .addCase(updateTaskAttachment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateTaskAttachment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.updatedTask = action.payload.data;
        state.message = action.payload.message;
        toast.success("Updated File");
      })
      .addCase(updateTaskAttachment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error("Error");
      })
      .addCase(deleteTask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
        toast.success("Task Deleted Succesfully");
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      .addCase(deleteTaskAttachment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteTaskAttachment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.updatedTask = action.payload.data;
        toast.success("File Deleted Succesfully");
      })
      .addCase(deleteTaskAttachment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      });
  },
});
export const { RESET, RESET_TASK } = projectSlice.actions;
// export const selectUser = (state) => state.project.user;
export default projectSlice.reducer;
