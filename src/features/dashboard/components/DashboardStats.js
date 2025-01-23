import CircleStackIcon from '@heroicons/react/24/outline/CircleStackIcon'
import CreditCardIcon from "@heroicons/react/24/outline/CreditCardIcon"
import UserGroupIcon from '@heroicons/react/24/outline/UserGroupIcon'
import UsersIcon from '@heroicons/react/24/outline/UsersIcon'
import { useEffect, useState } from "react"
import { socketGetUsers } from '../../../socket/Socket'
import dashboardService from "../services/DashboardService"
function DashboardStats({ }) {
    const [projectCount, setProjectCount] = useState(0)
    const [taskCount, setTaskCount] = useState(0)
    const [userCount, setUserCount] = useState(0)
    const [activeUsersCount, setActiveUsersCount] = useState(0)
    useEffect(() => {
        const getCounts = async () => {
            const data = await dashboardService.getProjectTaskAndUserCount()
            setProjectCount(data.data.projectCount)
            setTaskCount(data.data.taskCount)
            setUserCount(data.data.userCount)
        }
        socketGetUsers((data) => {
            setActiveUsersCount(data.length)
        })
        getCounts()
    }, [])
    return (
        <div className="stats shadow">
            <div className="stat">
                <div className="stat-figure text-secondary"> <UserGroupIcon className='w-8 h-8' /></div>
                <div className="stat-title">Total Users</div>
                <div className="stat-value text-success">{userCount}</div>
                {/* <div className={"stat-desc  " + getDescStyle()}>{description}</div> */}
            </div>
            <div className="stat">
                <div className="stat-figure text-secondary"><CreditCardIcon className='w-8 h-8' /></div>
                <div className="stat-title">Total Task</div>
                <div className="stat-value text-success">{taskCount}</div>
                {/* <div className={"stat-desc  " + getDescStyle()}>{description}</div> */}
            </div>
            <div className="stat">
                <div className="stat-figure text-secondary"><CircleStackIcon className='w-8 h-8' /></div>
                <div className="stat-title">Total Project</div>
                <div className="stat-value text-success">{projectCount}</div>
                {/* <div className={"stat-desc  " + getDescStyle()}>{description}</div> */}
            </div>
            <div className="stat">
                <div className="stat-figure text-secondary"><UsersIcon className='w-8 h-8' /></div>
                <div className="stat-title">Online Users</div>
                <div className="stat-value text-success">{activeUsersCount}</div>
                {/* <div className={"stat-desc  " + getDescStyle()}>{description}</div> */}
            </div>
        </div>
    )
}
export default DashboardStats