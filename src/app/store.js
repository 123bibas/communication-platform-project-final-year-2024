import { configureStore } from '@reduxjs/toolkit'
import headerSlice from '../features/common/headerSlice'
import rightDrawerSlice from '../features/common/rightDrawerSlice'
import notificationReducer from "../features/common/slice/NotificationSlice"
import projectSlice from '../features/projects/slice/projectSlice'
import authReducer from "../features/user/slice/authSlice"
const combinedReducer = {
  header: headerSlice,
  auth: authReducer,
  notification: notificationReducer,
  rightDrawer: rightDrawerSlice,
  project: projectSlice
}
export default configureStore({
  reducer: combinedReducer
}, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())