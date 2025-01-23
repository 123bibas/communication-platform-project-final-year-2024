import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import TitleCard from "../../../components/Cards/TitleCard"
import { socketSendUserNotification } from "../../../socket/Socket"
import { showNotification } from '../../common/headerSlice'
import { RESET, getUsers, upgradeUser } from "../../user/slice/authSlice"
const TopSideButtons = () => {
    const dispatch = useDispatch()
    const addNewTeamMember = () => {
        dispatch(showNotification({ message: "Add New Member clicked", status: 1 }))
    }
    return (
        <div className="inline-block float-right">
            <button className="btn px-6 btn-sm normal-case btn-primary" onClick={() => addNewTeamMember()}>Invite New</button>
        </div>
    )
}
function Team() {
    const dispatch = useDispatch()
    const searchInputRef = useRef(null);
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedSorting, setSelectedSorting] = useState('')
    const [selectedSearching, setSelectedSearching] = useState('')
    const [advanceQuery, setAdvanceQuery] = useState({
        page: 1,
        limit: 3,
    })
    const [selectedOptions, setSelectedOptions] = useState({});
    const [members, setMembers] = useState(null)
    const [userToSend, setUserToSend] = useState("")
    const { users, isSuccess, message, count, pagination } = useSelector(
        (state) => state.auth
    )
    const handleOptionChange = (itemId, event) => {
        setSelectedOptions((prevSelectedOptions) => ({
            ...prevSelectedOptions,
            [itemId]: event.target.value,
        }));
    };
    useEffect(() => {
        if (users && isSuccess) {
            setMembers(users)
            dispatch(RESET())
        }
    }, [users])
    useEffect(() => {
        const getUserList = async () => {
            await dispatch(getUsers(advanceQuery))
        }
        getUserList()
    }, [])
    useEffect(() => {
        if (isSuccess && message === "role-update") {
            // Remove the old user object from the array
            setMembers(prevUsers => {
                // Find the user by their ID
                const updatedUsers = prevUsers.map(user => {
                    if (user._id === userToSend) {
                        // Update the user's role
                        return { ...user, role: selectedOptions[userToSend] };
                    } else {
                        return user;
                    }
                });
                return updatedUsers;
            });
            const type = "role update"
            socketSendUserNotification(userToSend, type)
            dispatch(RESET())
        }
    }, [isSuccess])
    useEffect(() => {
        const advFunce = async () => await setAdvanceFiltering()
        advFunce()
    }
        , [selectedSorting, currentPage, selectedSearching])
    const handleSubmit = async (id, previousRole) => {
        const selectedRole = selectedOptions[id]
        if (selectedRole === undefined) {
            toast.error("Please select a role to upgrade")
            return
        }
        if (selectedRole === previousRole) {
            toast.error(`The user is already ${previousRole}. Select Different Role `)
            return
        }
        const userData = {
            role: selectedOptions[id],
            id: id
        }
        console.log(userData)
        setUserToSend(userData.id)
        await dispatch(upgradeUser(userData))
    }
    const getRoleComponent = (role) => {
        if (role === "admin") return <div className="badge badge-secondary">{role}</div>
        if (role === "manager") return <div className="badge badge-primary">{role}</div>
        if (role === "suspended") return <div className="badge badge-error">{role}</div>
        if (role === "user") return <div className="badge badge-accent">{role}</div>
        else return <div className="badge badge-ghost">{role}</div>
    }
    const setPagination = async (val) => {
        if (pagination.next) {
            console.log("i am paginated")
        }
        if (val === "-") {
            setCurrentPage(prevPage => {
                if (prevPage !== 1) {
                    return prevPage - 1
                }
                return prevPage
            })
        }
        if (val === "+") {
            setCurrentPage(prevPage => prevPage + 1)
        }
    }
    const setSorting = async (e) => {
        setSelectedSorting((prevSelectedSorting) => e.target.value);
    }
    const getSearching = async () => {
        setSelectedSearching(searchInputRef.current.value)
    }
    const setAdvanceFiltering = async () => {
        let advQuery = {
            search: selectedSearching,
            page: currentPage,
            limit: 3,
            sort: selectedSorting,
        }
        setAdvanceQuery(advQuery)
        await dispatch(getUsers(advQuery))
    }
    const resetFilter = () => {
        setSelectedSorting("")
        setSelectedSearching("")
        setCurrentPage(1)
        searchInputRef.current.value = ""
    }
    return (
        <>
            <TitleCard title={"Members: " + count} topMargin="mt-2" TopSideButtons={<TopSideButtons />}>
                {/* Team Member list in table format loaded constant */}
                <div className="md:flex xs:block justify-center p-2">
                    <div className="flex-1 justify-center form-control text-center">
                        <div className="input-group">
                            <input ref={searchInputRef} type="text" placeholder="Search…" className="input input-bordered input-sm " />
                            <button className="btn btn-square btn-sm" onClick={() => getSearching()}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-1 ">
                        <select className="select select-sm  mt-2 select-bordered  max-w-xs" onChange={async (e) => await setSorting(e)}>
                            <option disabled>Sort By</option>
                            <option value="-createdAt">Date</option>
                            <option value="name">Name</option>
                        </select>
                    </div>
                    <div className="flex flex-1 ">
                        <button className="btn btn-sm btn-error mt-2" onClick={resetFilter}>Reset</button>
                    </div>
                </div>
                <div className="overflow-x-auto w-full">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email Id</th>
                                <th>Role</th>
                                <th>Change To</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members &&
                                members.map((l, k) => {
                                    return (
                                        <tr key={k}>
                                            <td>
                                                <div className="flex items-center space-x-3">
                                                    <div className="avatar">
                                                        <div className="mask mask-circle w-12 h-12">
                                                            <img src={l.photo} alt="Avatar" />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-bold">{l.name}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{l.email}</td>
                                            <td>{getRoleComponent(l.role)}</td>
                                            <td>
                                                <select
                                                    className="select select-ghost w-full max-w-xs"
                                                    value={selectedOptions[l._id] || ""}
                                                    onChange={(event) => handleOptionChange(l._id, event)}
                                                >
                                                    <option diasbled="true">Select</option>
                                                    <option value="user">User</option>
                                                    <option value="admin">Admin</option>
                                                    <option value="manager">Manager</option>
                                                    <option value="team">Team</option>
                                                    <option value="suspended">Suspended</option>
                                                </select>
                                            </td>
                                            <td><button onClick={() => handleSubmit(l._id, l.role)} className="btn btn-success btn-sm btn-outline"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                            </svg>
                                            </button></td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
                <div className="btn-group flex justify-center mt-2">
                    <button className={`btn btn-sm ${(currentPage === 1) && 'btn-disabled'}`} onClick={() => setPagination("-")}>«</button>
                    <button className="btn btn-sm ">Page {currentPage}</button>
                    <button className={`btn btn-sm ${!pagination.next && 'btn-disabled'}`} onClick={() => setPagination("+")}>»</button>
                </div>
            </TitleCard>
        </>
    )
}
export default Team
