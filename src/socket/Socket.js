import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { getNotifications } from "../features/common/slice/NotificationSlice";
let socketInstance;
export const initializeSocket = (token, user) => {
    socketInstance = io('https://projeeto.onrender.com/', {
        query: { token },
    });
    socketInstance.emit("new-user-add", user._id)
    socketInstance.on('disconnect', () => {
        console.log('Disconnected from server!');
    });
}
export const socketSendUserNotification = (userToSend, type) => {
    socketInstance.emit("send-notification", userToSend, type)
}
export const socketGetNotifications = (user, dispatch) => {
    socketInstance.on("get-notification", (data) => {
        toast.success("New Notification")
        dispatch(getNotifications(user._id))
    })
}
export const socketGetUsers = (handleData) => {
    socketInstance.emit("get-active-users")
    socketInstance.on("get-users", (data) => {
        handleData(data);
    })
};