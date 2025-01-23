import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import notificationService from '../../common/services/NotificationService';
const initialState = {
    isNotificationLoading: false,
    isNotificationSent: false,
    isNotificationReceived: false,
    message: "",
    notification: null,
    notifications: null,
    isNotificationError: false
}
const setErrorFromResponse = (error) => {
    let message = ""
    if (error.response) {
        message = error.response.data.message
    }
    else {
        message = error.message
    }
    return message
}
// Get notification
export const getNotifications = createAsyncThunk(
    "notification",
    async (id, thunkAPI) => {
        try {
            return await notificationService.getNotifications(id);
        } catch (error) {
            const message = setErrorFromResponse(error)
            return thunkAPI.rejectWithValue(message)
        }
    }
)
// Get notification
export const readNotifications = createAsyncThunk(
    "notification/read",
    async (thunkAPI) => {
        try {
            return await notificationService.readNotifications();
        } catch (error) {
            const message = setErrorFromResponse(error)
            return thunkAPI.rejectWithValue(message)
        }
    }
)
const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        RESET_NOTIFICATION_STATE(state) {
            state.isNotificationSent = false
            state.isNotificationReceived = false
            state.notification = null
            state.notifications = []
            state.isNotificationError = false
            state.isNotificationLoading = false
        },
        SET_NOTIFICATIONS(state, action) {
            const array = [];
            state.notifications.push(action.payload)
        },
    },
    extraReducers: (builder) => {
        builder
            // GET NOTIFICATIONS
            .addCase(getNotifications.pending, (state) => {
                state.isNotificationLoading = true;
            })
            .addCase(getNotifications.fulfilled, (state, action) => {
                state.isNotificationLoading = false;
                state.isNotificationRecieved = true;
                state.message = action.payload.message
                state.notifications = action.payload.data
                // toast.success(action.payload.message)
            })
            .addCase(getNotifications.rejected, (state, action) => {
                state.isNotificationLoading = false;
                state.isNotificationError = true;
                state.message = action.payload;
                console.log(action.payload)
                toast.error(action.payload);
            })
            // Read Notifications
            .addCase(readNotifications.pending, (state) => {
                state.isNotificationLoading = true;
            })
            .addCase(readNotifications.fulfilled, (state, action) => {
                state.isNotificationLoading = false;
                state.isNotificationRecieved = true;
                state.message = action.payload.message
                state.notifications = action.payload.data
                // toast.success(action.payload.message)
            })
            .addCase(readNotifications.rejected, (state, action) => {
                state.isNotificationLoading = false;
                state.isNotificationError = true;
                state.message = action.payload;
                console.log(action.payload)
                toast.error(action.payload);
            })
    },
});
export const { RESET_NOTIFICATION_STATE, SET_NOTIFICATIONS } =
    notificationSlice.actions;
// export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
// export const selectUser = (state) => state.auth.user;
export default notificationSlice.reducer;