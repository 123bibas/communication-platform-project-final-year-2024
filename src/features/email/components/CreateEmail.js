import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from 'react-select';
import { toast } from "react-toastify";
import TitleCard from "../../../components/Cards/TitleCard";
import authService from "../../../features/user/services/UserService";
function CreateEmail() {
    const navigate = useNavigate()
    const [allTeamMembers, setAllTeamMembers] = useState(null)
    const [selectedSubject, setSelectedSubject] = useState('')
    const [selectedBody, setSelectedBody] = useState('')
    const [multiSelectOption, setMultiSelectOption] = useState([])
    const [selectedMultiOption, setSelectedMultiOption] = useState(null);
    useEffect(() => {
        const getAllTeamList = async () => {
            const data = await authService.getTeamMembers();
            setAllTeamMembers(data.data)
            // configure multi select options
            const options = data.data.map(team => ({
                value: team._id,
                label: team.name
            }))
            setMultiSelectOption(() => options)
        }
        getAllTeamList()
    }, [])
    const submitForm = async (e) => {
        e.preventDefault()
        const data = {
            message: selectedBody,
            subject: selectedSubject,
            usersToSend: selectedMultiOption.map(option => option.value)
        }
        try {
            const response = await authService.sendEmailToUsers(data)
            toast.success("Email has been sent")
            setSelectedSubject("")
            setSelectedBody("")
        } catch (error) {
            toast.error("Something went wrong")
        }
    }
    return (
        <>
            <TitleCard title='Send Email'>
                {allTeamMembers &&
                    <form onSubmit={(e) => submitForm(e)}>
                        <div className=" cursor-auto min-h-screen ">
                            <div className=" grid gap-4 h-100 modal-box w-12/12 max-w-5xl p-8">
                                <div className={`form-control `}>
                                    <label className="label">
                                        <span className={"label-text text-base-content "}>Subject</span>
                                    </label>
                                    <input value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} type='text' className="input  input-bordered w-full " />
                                </div>
                                <div className={`form-control w-full`}>
                                    <label className="label">
                                        <span className={"label-text text-base-content "}>Body</span>
                                    </label>
                                    <textarea value={selectedBody} type='text' onChange={(e) => setSelectedBody(e.target.value)} className="textarea  textarea-bordered w-full " />
                                </div>
                                <div className={`form-control w-full`}>
                                    <label className="label">
                                        <span className={"label-text text-base-content "}>Send To</span>
                                    </label>
                                </div>
                                <div className="z-10">
                                    <Select
                                        isMulti
                                        name="Team"
                                        options={multiSelectOption}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        onChange={setSelectedMultiOption}
                                    />
                                </div>
                                <div className="modal-action">
                                    <button type="submit" htmlFor="my-modal-5" className="btn">Send</button>
                                </div>
                            </div>
                        </div>
                    </form>
                }
            </TitleCard>
        </>
    )
}
export default CreateEmail;