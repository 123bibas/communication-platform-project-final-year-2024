import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Select from "react-select";
import authService from "../../../../features/user/services/UserService";
import { RESET_TASK } from "../../../projects/slice/projectSlice";
import { addTask } from "../../slice/projectSlice";
function AddTask({ closeModal, stageId, modifyBoard }) {
  const [allTeamMembers, setAllTeamMembers] = useState(null);
  const [selectedType, setSelectedType] = useState("");
  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedDescription, setSelectedDescription] = useState("");
  const [selectedAssignee, setSelectedAssignee] = useState("");
  const [selectedStage, setSelectedStageId] = useState(stageId);
  const [selectedPriority, setSelectedPriority] = useState("");
  const [multiSelectOption, setMultiSelectOption] = useState([]);
  const [selectedMultiOption, setSelectedMultiOption] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { task, isSuccess } = useSelector((state) => state.project);
  useEffect(() => {
    if (task && isSuccess) {
      // setSelectedTask(updatedTask)
      console.log("the task has been updated", task);
      modifyBoard(stageId, task);
      dispatch(RESET_TASK());
      closeModal(task);
    }
  }, [task]);
  useEffect(() => {
    const getAllTeamList = async () => {
      const data = await authService.getTeamMembers();
      setAllTeamMembers(data.data);
      // configure multi select options
      const options = data.data.map((team) => ({
        value: team._id,
        label: team.name,
      }));
      setMultiSelectOption(() => options);
    };
    getAllTeamList();
  }, []);
  const submitForm = async (e) => {
    e.preventDefault();
    const data = {
      description: selectedDescription,
      name: selectedTitle,
      priority: [selectedPriority],
      stage: selectedStage,
      type: [selectedType],
      assignees: selectedMultiOption.map((option) => option.value),
    };
    dispatch(addTask({ stageId, data }));
  };
  return (
    <>
      {allTeamMembers && (
        <form onSubmit={(e) => submitForm(e)}>
          <div className=" cursor-auto min-h-screen ">
            <div className=" grid gap-4 h-120 modal-box w-12/12 max-w-5xl p-8">
              <label
                onClick={() => closeModal()}
                htmlFor="editTask"
                className="btn btn-sm btn-circle absolute right-2 top-2"
              >
                ✕
              </label>
              <h3 className="font-bold text-lg">Add Task</h3>
              <div className={`form-control `}>
                <label className="label">
                  <span className={"label-text text-base-content "}>Name</span>
                </label>
                <input
                  onChange={(e) => setSelectedTitle(e.target.value)}
                  type="text"
                  className="input  input-bordered w-full "
                />
              </div>
              <div className={`form-control w-full`}>
                <label className="label">
                  <span className={"label-text text-base-content "}>
                    Description
                  </span>
                </label>
                <textarea
                  type="text"
                  onChange={(e) => setSelectedDescription(e.target.value)}
                  className="textarea  textarea-bordered w-full "
                />
              </div>
              <div className="flex justify-start">
                <div className={`form-control w-1/2`}>
                  <label className="label">
                    <span className={"label-text text-base-content w-full "}>
                      Type &nbsp;
                    </span>
                  </label>
                  <select
                    className="select select-bordered w-full max-w-xs"
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    <option selected={true} value="Change" disabled>
                      Change
                    </option>
                    <option value={"Bug"}>Bug</option>
                    <option value={"New Feature"}>New Feature</option>
                    <option value={"Update"}>Update</option>
                    <option value={"Others"}>Others</option>
                  </select>
                </div>
                <div className={`form-control w-1/2`}>
                  <label className="label">
                    <span className={"label-text text-base-content w-full "}>
                      Priority &nbsp;
                    </span>
                  </label>
                  <select
                    className="select select-bordered w-full max-w-xs"
                    onChange={(e) => setSelectedPriority(e.target.value)}
                  >
                    <option selected={true} value="Change" disabled>
                      Change
                    </option>
                    <option value={"Low"}>Low</option>
                    <option value={"Medium"}>Medium</option>
                    <option value={"High"}>High</option>
                    <option value={"Urgent"}>Urgent</option>
                  </select>
                </div>
              </div>
              <div className={`form-control w-full`}>
                <label className="label">
                  <span className={"label-text text-base-content "}>
                    Assign Users
                  </span>
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
                <button type="submit" htmlFor="my-modal-5" className="btn">
                  Add Task
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </>
  );
}
export default AddTask;
