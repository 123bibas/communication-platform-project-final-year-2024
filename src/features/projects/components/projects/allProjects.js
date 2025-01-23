import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RESET, deleteProject, getTeamProject } from '../../slice/projectSlice'
const AllProjects = () => {
    const currentUser = JSON.parse(localStorage.getItem('user'))
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [projectToDelete, setProjectToDelete] = useState("")
    const [projectList, setProjectList] = useState(null)
    const [projectListSearch, setProjectListSearch] = useState(null)
    const { projects, isSuccess, isProjectDelete } = useSelector(
        (state) => state.project
    )
    useEffect(() => {
        dispatch(getTeamProject())
    }, [])
    useEffect(() => {
        if (isSuccess && projects) {
            dispatch(RESET())
            setProjectList(projects)
            setProjectListSearch(projects)
            console.log(projects)
        }
    }, [projects])
    useEffect(() => {
        if (isSuccess && isProjectDelete) {
            setProjectList(projects.filter(project => project.id !== projectToDelete))
            dispatch(RESET())
        }
    }, [isProjectDelete])
    const handleDeleteProject = () => {
        dispatch(deleteProject(projectToDelete))
    }
    const handleClick = async (id) => {
        navigate(`/app/kanban`, { state: id })
    }
    const handleEdit = (project) => {
        navigate(`/app/edit-project`, { state: project })
    }
    const handleSearch = (val) => {
        const originalProject = projectListSearch
        if (val.length > 0) {
            const filteredProject = originalProject.filter(project =>
                project.name.toLowerCase().includes(val.toLowerCase())
            );
            setProjectList(filteredProject)
        }
        else {
            setProjectList(originalProject)
        }
    }
    return (
        <>
            <div className='flex justify-center'>
                <input className='input' type='text' placeholder='Search Project' onChange={(e) => handleSearch(e.target.value)} />
            </div>
            {(projectList !== null && projectList.length > 0) &&
                <>
                    {
                        projectList.map((project) =>
                            <div key={project._id} className="flex justify-center stats shadow m-2">
                                <div className="stat ">
                                    <div className="stat-figure text-success">
                                        <div className="avatar ">
                                            <div className="w-16 rounded-full">
                                                <img src={`${project.manager.photo}`} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="stat-value">Manager</div>
                                    <div className="stat-title">{project.manager.name}</div>
                                    <div className="stat-desc text-success">Managing This Project</div>
                                </div>
                                <div className="stat">
                                    <div className="stat-value">{project.name.toUpperCase()}</div>
                                    <div className="stat-desc text-success"><button onClick={() => handleClick(project._id)} className='btn btn-dark text-success btn-wide mt-3'>View</button></div>
                                    {(currentUser.role === 'manager' || currentUser.role === 'admin') && <div className="stat-desc text-success"><button onClick={() => handleEdit(project)} className='btn btn-dark text-warning btn-wide mt-3'>Edit</button></div>}
                                    {(currentUser.role === 'admin') && <div className="stat-desc text-success"><label onClick={() => setProjectToDelete(project._id)} htmlFor="delete-modal" className='btn btn-dark text-error btn-wide mt-3'>Delete</label></div>
                                    }</div>
                                <div className="deleteModal">
                                    <input type="checkbox" id="delete-modal" className="modal-toggle" />
                                    <div className="modal">
                                        <div className="modal-box relative">
                                            <label onClick={() => setProjectToDelete("")} htmlFor="delete-modal" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                                            <h3 className="text-lg font-bold">Delete Project</h3>
                                            <p className="py-4">Are you sure you want to delete?</p>
                                            <div className="modal-action">
                                                <label htmlFor="delete-modal" onClick={() => handleDeleteProject()} className="btn btn-success">Yes</label>
                                                <label onClick={() => setProjectToDelete("")} htmlFor="delete-modal" className="btn btn-error">No</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </>
            }
            {(projectList !== null && projectList.length === 0) &&
                <div className='flex justify-center mt-5 pt-5'>
                    <h2>No Projects</h2>
                </div>
            }
        </>
    )
}
export default AllProjects