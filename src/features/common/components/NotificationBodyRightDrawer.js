import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getNotifications } from "../slice/NotificationSlice"
import moment from 'moment'
import projectService from "../../projects/services/ProjectService"
import { useNavigate } from "react-router-dom"
function NotificationBodyRightDrawer() {
    const navigate = useNavigate();
    const [notificationList, setNotificationList] = useState([])
    const { notifications } = useSelector(
        (state) => state.notification
    )
    useEffect(() => {
        if (notifications) {
            setNotificationList(notifications)
            console.log("notifications", notifications)
        }
    }, [notifications])
    const handleShow = async (details) => {
        // check if details is task added or updated
        if (details.stageId && details.taskId) {
            const response = await projectService.getTaskById({
                stageId: details.stageId,
                id: details.taskId
            })
            console.log("response", response.data)
            navigate(`/app/task`, { state: response.data })
        }
    }
    return (
        <>
            {notificationList &&
                notificationList.map((notification, i) => {
                    return <div key={i} className={"grid mt-3 card bg-base-200 rounded-box p-3" + (!notification.read ? " bg-blue-100" : "")}>
                        <span>
                            <div className={"alert shadow-lg" + (!notification.read ? " bg-blue-100" : "")}>
                                <div>
                                    <img src={notification.updatedBy.photo} className="w-10 rounded-full" />
                                </div>
                                <div>
                                    <h3 className="font-bold">{notification.message}</h3>
                                    <div className="text-xs text-secondary">{moment(notification.createdAt).fromNow()}</div>
                                    <br />
                                </div>
                            </div>
                        </span>
                        {notification.details !== undefined &&
                            <button onClick={() => handleShow(notification.details)} className="btn">Show</button>
                        }
                    </div>
                })
            }
        </>
    )
}
export default NotificationBodyRightDrawer