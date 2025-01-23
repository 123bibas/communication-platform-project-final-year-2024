import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  createActivity,
  deleteTaskAttachment,
  getActivities,
  getTaskDetails,
  RESET_TASK,
  updateTask,
  updateTaskAttachment,
} from "../../slice/projectSlice";
import { configColor } from "../../utils/ConfigColor";
import authService from "../../../user/services/UserService";
import {
  socketGetUsers,
  socketSendUserNotification,
} from "../../../../socket/Socket";
import Select from "react-select";
import { useLocation, useNavigate } from "react-router";
import { RESET } from "../../slice/projectSlice";
import Bars3BottomLeftIcon from "@heroicons/react/24/outline/Bars3BottomLeftIcon";
import InformationCircleIcon from "@heroicons/react/24/outline/InformationCircleIcon";
import DocumentDuplicateIcon from "@heroicons/react/24/outline/DocumentDuplicateIcon";
import UserGroupIcon from "@heroicons/react/24/outline/UserGroupIcon";
import PaperClipIcon from "@heroicons/react/24/outline/PaperClipIcon";
import moment from "moment";

const iconClasses = `h-6 w-6`;
function EditTask() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const taskToEdit = location.state;
  const projectToShow = location.state.projectId;
  console.log(projectToShow);
  const { updatedTask, taskActivities, isSuccess } = useSelector(
    (state) => state.project
  );

  const [selectedTask, setSelectedTask] = useState(taskToEdit);
  const [allTeamMembers, setAllTeamMembers] = useState(null);
  const [activeUsers, setActiveUsers] = useState(null);
  const [selectedType, setSelectedType] = useState("");
  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedDescription, setSelectedDescription] = useState("");
  const [selectedAssignee, setSelectedAssignee] = useState("");
  const [selectedStage, setSelectedStageId] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [multiSelectOption, setMultiSelectOption] = useState([]);
  const [selectedMultiOption, setSelectedMultiOption] = useState(null);
  const [attachment, setAttachment] = useState();
  const [activity, setActivity] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (updatedTask && isSuccess) {
      dispatch(
        getActivities({ stageId: taskToEdit.stage, id: taskToEdit._id })
      );
      setSelectedTask((prevVal) => updatedTask);
      // send notification only to the users modified otherwise dont send notification
      if (updatedTask.assignees) {
        const newAssignees = updatedTask.assignees.filter((userId) => {
          if (!selectedTask.assignees) {
            return true;
          }
          return !selectedTask.assignees.includes(userId);
        });
        newAssignees.forEach((assignee) => {
          let type = "ticket-added";
          socketSendUserNotification(assignee, type);
        });
      }
      // else if(updateTask.assignee && !selectedTask.assignee){
      // }

      dispatch(RESET());
    }
  }, [updatedTask]);
  useEffect(() => {
    socketGetUsers((data) => {
      setActiveUsers(() => data.map((obj) => obj.userId));
    });
  }, [socketGetUsers]);
  useEffect(() => {
    if (!taskToEdit) {
      window.location.href = "/";
    }

    const { assignees, description, name, priority, stage, type } =
      selectedTask;
    setSelectedAssignee(assignees);
    setSelectedDescription(description);
    setSelectedPriority(priority[0]);
    setSelectedTitle(name);
    setSelectedType(type[0]);
    setSelectedStageId(stage);
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
    dispatch(getTaskDetails({ stageId: taskToEdit.stage, id: taskToEdit._id }));
  }, []);

  useEffect(() => {
    console.log("taskActivities i have been called", taskActivities);
  }, [taskActivities]);

  const extractTeamImage = (assignee) => {
    if (!assignee) {
      return null;
    }
    if (allTeamMembers) {
      const teams = allTeamMembers.find((team) => team._id === assignee);
      if (teams) {
        return teams.photo;
      } else {
        return null;
      }
    }
  };
  const checkUserStatus = (assignee) => {
    if (activeUsers) {
      return activeUsers.includes(assignee);
    }
    return false;
  };

  const addAttachments = (event) => {
    const file = event.target.files[0];
    console.log("file", file);
    setAttachment(file);
  };

  const submitAttachment = async () => {
    const paramIds = {
      stageId: selectedStage,
      id: selectedTask._id,
    };

    const formData = new FormData();
    formData.append("file", attachment);
    console.log(formData);

    dispatch(updateTaskAttachment({ paramIds, data: formData }));
    fileInputRef.current.value = "";
  };

  const deleteAttachment = async (attachment) => {
    const paramIds = {
      id: selectedTask._id,
      stageId: selectedTask.stage,
    };

    console.log(paramIds);

    dispatch(deleteTaskAttachment({ paramIds, data: attachment }));
  };
  const submitForm = async (e) => {
    e.preventDefault();
    const paramIds = {
      stageId: selectedStage,
      id: selectedTask._id,
    };
    const data = {
      description: selectedDescription,
      name: selectedTitle,
      priority: [selectedPriority],
      stage: selectedStage,
      type: [selectedType],
      assignees: selectedMultiOption.map((option) => option.value),
    };
    dispatch(updateTask({ paramIds, data }));
  };

  const createTaskActivity = () => {
    const paramIds = {
      id: selectedTask._id,
      stageId: selectedTask.stage,
    };

    console.log(paramIds);

    dispatch(createActivity({ paramIds, data: { description: activity } }));
  };

  const handleCancel = () => {
    navigate(`/app/kanban`, { state: projectToShow });
    console.log(projectToShow);
    dispatch(RESET());
    dispatch(RESET_TASK());
  };

  return (
    <>
      {allTeamMembers && updatedTask && (
        <>
          <form className=" " onSubmit={(e) => submitForm(e)}>
            <div className=" cursor-auto h-300 ">
              <div className="m-auto grid gap-4 h-150 modal-box w-12/12 max-w-full ">
                <label
                  onClick={handleCancel}
                  htmlFor="editTask"
                  className="btn btn-sm btn-circle absolute right-2 top-2"
                >
                  ✕
                </label>
                <h3 className="font-bold text-lg">Edit Task</h3>
                <div className={`form-control `}>
                  <label className="label">
                    <label className="label">
                      <span className={"flex label-text text-base-content "}>
                        <span>
                          <InformationCircleIcon className={iconClasses} />
                        </span>
                        <span>
                          {" "}
                          &nbsp; &nbsp; <b>Name</b>{" "}
                        </span>
                      </span>
                    </label>
                  </label>
                  <input
                    defaultValue={selectedTask.name}
                    onChange={(e) => setSelectedTitle(e.target.value)}
                    type="text"
                    className="input  input-bordered w-full "
                  />
                </div>
                <div className={`form-control w-full`}>
                  <label className="label">
                    <span className={"flex label-text text-base-content "}>
                      <span>
                        <Bars3BottomLeftIcon className={iconClasses} />
                      </span>
                      <span>
                        {" "}
                        &nbsp; &nbsp; <b>Description</b>{" "}
                      </span>
                    </span>
                  </label>
                  <textarea
                    defaultValue={selectedTask.description}
                    type="text"
                    onChange={(e) => setSelectedDescription(e.target.value)}
                    className="textarea  textarea-bordered w-full "
                    rows={10}
                  />
                </div>
                <div className="flex justify-start">
                  <div className={`form-control w-1/2`}>
                    <label className="label">
                      <span className={"label-text text-base-content w-full "}>
                        <b>Type</b> &nbsp;
                        <span
                          className={`badge ${configColor(
                            selectedType
                          )} badge-outline mr-2`}
                        >
                          {selectedType}
                        </span>
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
                        <b>Priority</b> &nbsp;
                        <span
                          className={`badge ${configColor(
                            selectedPriority
                          )} badge-outline mr-2`}
                        >
                          {selectedPriority}
                        </span>
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
                    <span className={"flex label-text text-base-content "}>
                      <span>
                        <UserGroupIcon className={iconClasses} />
                      </span>
                      <span>
                        {" "}
                        &nbsp; &nbsp; <b>Assigned Users</b>{" "}
                      </span>
                    </span>
                  </label>
                </div>
                <div>
                  {selectedTask.assignees.map((assignee) => {
                    return (
                      extractTeamImage(assignee) !== null && (
                        <React.Fragment key={assignee}>
                          <div
                            key={assignee}
                            className={`avatar ${
                              checkUserStatus(assignee) ? "online" : "offline"
                            }`}
                          >
                            <div className="rounded-full w-16">
                              <img src={`${extractTeamImage(assignee)}`} />
                            </div>
                          </div>
                        </React.Fragment>
                      )
                    );
                  })}
                </div>
                <div className={`form-control w-full`}>
                  <label className="label">
                    <span className={"label-text text-base-content "}>
                      <b>Change Assignment</b>
                    </span>
                  </label>
                </div>
                <div className="z-10">
                  <Select
                    defaultValue={multiSelectOption.filter((option) =>
                      selectedTask.assignees.includes(option.value)
                    )}
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
                    Update
                  </button>
                </div>
              </div>
            </div>
          </form>
          <div className="m-auto grid gap-4 h-150 modal-box w-12/12 max-w-full">
            <div className={`form-control `}>
              <label className="label">
                <span className={"flex label-text text-base-content "}>
                  <span>
                    <DocumentDuplicateIcon className={iconClasses} />
                  </span>
                  <span>
                    &nbsp; &nbsp; <b>Attachments</b>{" "}
                  </span>
                </span>
              </label>

              <div className="flex">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="file-input file-input-bordered w-full max-w-xs"
                  name="files"
                  accept="application/pdf, image/*"
                  onChange={addAttachments}
                />

                <div className="upload-btn">
                  <button
                    className="btn btn-success"
                    onClick={submitAttachment}
                    disabled={fileInputRef.current?.value === ""}
                  >
                    Upload
                  </button>
                </div>
              </div>

              {selectedTask.attachments && (
                <div className="overflow-x-auto mt-5 w-100">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>File</th>
                        <th>Name</th>
                        <th>Actions</th>

                        <th></th>
                      </tr>
                    </thead>

                    {selectedTask.attachments.map((attachment) => {
                      return (
                        <tbody key={attachment.publicId}>
                          <tr>
                            <td>
                              <div className="flex items-center space-x-3">
                                <div className="avatar">
                                  <div className="mask mask-squircle w-12 h-12">
                                    {attachment.format == "jpg" ||
                                    attachment.format == "jpeg" ||
                                    attachment.format == "png" ? (
                                      <img
                                        src={`${attachment.url}`}
                                        alt={`${attachment.fileName}`}
                                      />
                                    ) : (
                                      <PaperClipIcon />
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td>{attachment.fileName}</td>

                            <td>
                              <a
                                className="btn btn-ghost"
                                href={`${attachment.url}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                View
                              </a>
                            </td>
                            <td>
                              <a
                                onClick={() => deleteAttachment(attachment)}
                                className="btn btn-ghost"
                              >
                                Delete
                              </a>
                            </td>
                          </tr>
                        </tbody>
                      );
                    })}
                  </table>
                </div>
              )}
            </div>
          </div>

          <div className="m-auto grid gap-4 h-150 modal-box w-12/12 max-w-full">
            <div className={`form-control `}>
              <label className="label">
                <span className={"flex label-text text-base-content "}>
                  <span>
                    <DocumentDuplicateIcon className={iconClasses} />
                  </span>
                  <span>
                    &nbsp; &nbsp; <b>Activity</b>{" "}
                  </span>
                </span>
              </label>
            </div>
            <textarea
              onChange={(e) => setActivity(e.target.value)}
              type="text"
              placeholder="Search…"
              className="textarea textarea-bordered"
            />
            <div>
              <button
                disabled={activity === ""}
                className="btn btn-success btn-sm"
                onClick={createTaskActivity}
              >
                Save
              </button>
            </div>

            {taskActivities.length > 0 &&
              taskActivities.map((taskActivity) => (
                <div key={taskActivity._id} className="mt-3 shadow-lg p-2">
                  <div className="flex">
                    <img
                      className="avatar w-10 h-10 rounded-full"
                      src={taskActivity.sender.photo}
                    ></img>

                    <p className="p-2">
                      {taskActivity.sender.name} &nbsp;&nbsp;&nbsp;&nbsp;
                      <span className="text-sm text-secondary ">
                        {moment(taskActivity.createdAt).fromNow()}]
                      </span>
                    </p>
                  </div>
                  <p className="mt-2 p-5 alert">{taskActivity.description}</p>
                </div>
              ))}
          </div>
        </>
      )}
    </>
  );
}
export default EditTask;
