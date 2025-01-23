import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import TitleCard from "../../../../components/Cards/TitleCard";
import authService from "../../../user/services/UserService";
import { RESET, editProject } from "../../slice/projectSlice";
function EditProject() {
    const currentUser = JSON.parse(localStorage.getItem('user'))
    const location = useLocation()
    const navigate = useNavigate()
    const projectToEdit = location.state
    if (!projectToEdit) {
        window.location.href = "/"
    }
    const dispatch = useDispatch()
    const { project, isSuccess } = useSelector(
        (state) => state.project
    )
    const [name, setName] = useState(projectToEdit.name);
    const [description, setDescription] = useState(projectToEdit.description)
    const [selectedManager, setSelectedManager] = useState("")
    const [managers, setManagers] = useState([])
    useEffect(() => {
        if (currentUser.role === 'admin') {
            const getManagerList = async () => {
                const data = await authService.getManagers();
                setManagers(data.data)
            }
            getManagerList()
        }
    }, [])
    useEffect(() => {
        if (isSuccess && project) {
            dispatch(RESET())
            navigate(`/app/project-list`)
        }
    }, [project])
    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = { name, description, manager: selectedManager }
        console.log(data)
        await dispatch(editProject({ paramId: projectToEdit._id, data }))
    }
    return (
        <TitleCard title="Edit Project" topMargin="mt-2">
            <div className="flex ">
                <form onSubmit={handleSubmit}>
                    <div className="form-control">
                        <label className="label">
                            <span className={"label-text text-base-content "}>Name</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="input input-bordered w-full max-w-xs"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className={"label-text text-base-content "}>Description</span>
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            className="textarea textarea-bordered"
                            onChange={(event) => setDescription(event.target.value)}
                        ></textarea>
                    </div>
                    <div className="form-control">
                        <label className="label">Current Manager</label>
                        <div className="avatar">
                            <div className="rounded-full w-16 mt-2">
                                <img src={projectToEdit.manager.photo} />
                            </div>
                        </div>
                    </div>
                    {(currentUser.role === 'admin' && managers)
                        &&
                        <div className="form-control mt-4">
                            <select
                                className="select select-bordered"
                                id="managers"
                                defaultValue={""}
                                onChange={(e) => setSelectedManager(e.target.value)}
                            >
                                <option value="" disabled >Change</option>
                                {managers.map((manager) => (
                                    <option key={manager._id} value={manager._id} >
                                        {manager.name}
                                    </option>
                                ))}
                            </select>
                        </div>}
                    <button className="btn btn-dark mt-5" disabled={!(name && description && managers)} type="submit">Edit</button>
                </form>
            </div>
        </TitleCard>
    );
}
export default EditProject;