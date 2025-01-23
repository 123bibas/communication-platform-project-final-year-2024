import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../../../components/Cards/TitleCard";
import authService from "../../../user/services/UserService";
import { RESET, createProject } from "../../slice/projectSlice";
function CreateProject() {
    const dispatch = useDispatch()
    const { project, isSuccess } = useSelector(
        (state) => state.project
    )
    const [name, setName] = useState("");
    const [description, setDescription] = useState("")
    const [selectedManager, setSelectedManager] = useState("")
    const [managers, setManagers] = useState([])
    useEffect(() => {
        const getManagerList = async () => {
            const data = await authService.getManagers();
            setManagers(data.data)
        }
        getManagerList()
    }, [])
    useEffect(() => {
        if (isSuccess && project) {
            dispatch(RESET())
            setName("")
            setDescription("")
        }
    }, [project])
    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = { name, description, manager: selectedManager }
        await dispatch(createProject(data))
    }
    return (
        <TitleCard title="Create Project" topMargin="mt-2">
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
                    {managers &&
                        <div className="form-control ">
                            <label className="label">
                                <span className={"label-text text-base-content "}>Manager</span>
                            </label>
                            <select
                                className="select select-bordered"
                                id="managers"
                                defaultValue={""}
                                onChange={(e) => setSelectedManager(e.target.value)}
                            >
                                <option value="" disabled >Select</option>
                                {managers.map((manager) => (
                                    <option key={manager._id} value={manager._id} >
                                        {manager.name}
                                    </option>
                                ))}
                            </select>
                        </div>}
                    <button className="btn btn-dark mt-5" disabled={!(name && description && managers)} type="submit">Create</button>
                </form>
            </div>
        </TitleCard>
    );
}
export default CreateProject;