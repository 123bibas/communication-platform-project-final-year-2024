import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import TitleCard from '../../components/Cards/TitleCard'
import { socketGetUsers } from '../../socket/Socket'
import authService from '../user/services/UserService'
import BarChart from './components/BarChart'
import DashboardStats from './components/DashboardStats'
import DoughnutChart from './components/DoughnutChart'
import UserChannels from './components/UserChannels'
import dashboardService from './services/DashboardService'
function Dashboard() {
    const [priorityData, setPriorityData] = useState(null)
    const [typeData, setTypeData] = useState(null)
    const [projectManagerData, setProjectManagerData] = useState(null)
    const [activeUsers, setActiveUsers] = useState(null)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleProjectData = (val) => {
        const project = val
        navigate(`/app/edit-project`, { state: project })
    }
    useEffect(() => {
        const getProjectWithManager = async () => {
            const data = await dashboardService.getAllProjectWithManager()
            setProjectManagerData(data.data)
        }
        const getPriorities = async () => {
            const data = await dashboardService.getAllTaskPriorities()
            setPriorityData(data.data)
        }
        const getTypes = async () => {
            const data = await dashboardService.getAllTaskTypes()
            setTypeData(data.data)
        }
        socketGetUsers((data) => {
            const filteredData = data.map((val) => val.userId)
            console.log(filteredData)
            const getActiveUserInfo = async () => {
                const userList = await authService.getMembers(filteredData)
                console.log("userList", userList)
                setActiveUsers(userList.data)
            }
            getActiveUserInfo()
        })
        getProjectWithManager()
        getPriorities()
        getTypes()
    }, [])
    return (
        <>
            <div className="grid lg:grid-cols-1 mt-8  grid-cols-1 gap-6">
                <DashboardStats />
            </div>
            <div className="grid lg:grid-cols-1 mt-8 grid-cols-1 gap-6">
                <TitleCard title='Online Users'>
                    <div className="flex">
                        {activeUsers && activeUsers.map((user) => (
                            <div className="tooltip" data-tip={user.name}>
                                <div className="avatar online m-1">
                                    <div className="w-16 rounded-full">
                                        <img src={`${user.photo}`} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </TitleCard>
            </div>
            <div className="grid lg:grid-cols-1 mt-4  grid-cols-1 gap-6">
                {projectManagerData && <UserChannels data={projectManagerData} handleSubmit={handleProjectData} title='All Projects' />}</div>
            <div className="grid lg:grid-cols-2 mt-4 grid-cols-1 gap-6">
                {priorityData && <DoughnutChart chartData={priorityData} title='Priority' />}
                {typeData && <DoughnutChart chartData={typeData} title='Task Type' />}
            </div>
            <div className="grid lg:grid-cols-2 mt-4 grid-cols-1 gap-6">
                {priorityData && <BarChart chartData={priorityData} title={'Ticket Priority'} />}
                {typeData && <BarChart chartData={typeData} title={'Ticket Type'} />}
            </div>
        </>
    )
}
export default Dashboard