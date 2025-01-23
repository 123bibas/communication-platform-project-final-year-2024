import moment from "moment";
import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import AddTask from "../../features/projects/components/tasks/addTask";
import projectService from "../../features/projects/services/ProjectService";
import { deleteTask } from "../../features/projects/slice/projectSlice";
import { configColor } from "../../features/projects/utils/ConfigColor";
import authService from "../../features/user/services/UserService";
import { socketSendUserNotification } from "../../socket/Socket";
function InternalPage() {
  const location = useLocation();
  const projectToShow = location.state;
  const dispatch = useDispatch();
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [boards, setBoards] = useState([]);
  //board copy is created for tracking original board before searching and filtering
  const [boardCopy, setBoardCopy] = useState([]);
  const [selectedBoardToAddTask, setSelectedBoardToAddTask] = useState(null);
  const [deleteTaskSetup, setDeleteTaskSetup] = useState({});
  const [allTeamMembers, setAllTeamMembers] = useState(null);
  const [showMyTask, setShowMyTask] = useState(false);
  const { stages } = useSelector((state) => state.project);
  const navigate = useNavigate();
  useEffect(() => {
    if (!projectToShow) {
      window.location.href = "/";
    }
    const getStagesFunc = async () => {
      const response = await projectService.getStages(projectToShow);
      console.log("project from server", response);
      setBoards(response.data);
      setBoardCopy(response.data);
    };
    const getAllTeamList = async () => {
      const data = await authService.getTeamMembers();
      setAllTeamMembers(data.data);
    };
    getStagesFunc();
    getAllTeamList();
  }, []);

  const handleDragEnd = async ({ source, destination }) => {
    if (!destination) {
      return;
    }
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }
    const sourceBoard = boards.find(
      (board) => board._id === source.droppableId
    );
    const destinationBoard = boards.find(
      (board) => board._id === destination.droppableId
    );
    const task = sourceBoard.tasks[source.index];
    console.log("task dragged", task);
    sourceBoard.tasks.splice(source.index, 1);
    destinationBoard.tasks.splice(destination.index, 0, task);
    setBoards([...boards]);
    // reordering in a same stage
    if (destinationBoard._id === sourceBoard._id) {
      const data = {
        newPosition: destination.index,
      };
      const paramIds = {
        projectId: "643d7089186ee682aa473673",
        stageId: sourceBoard._id,
        id: task._id,
      };
      await projectService.reorderTaskWithinStage(paramIds, data);
    }
    // reordering in a same stage
    if (destinationBoard._id !== sourceBoard._id) {
      const data = {
        toStageId: destinationBoard._id,
        newOrder: destination.index,
      };
      const paramIds = {
        stageId: sourceBoard._id,
        id: task._id,
      };
      console.log("newPosition", destination.index);
      await projectService.updateTaskToNewStage(paramIds, data);
    }
  };
  const showAddTaskModal = (boardId) => {
    setSelectedBoardToAddTask(boardId);
  };
  const modifyBoard = (boardId, task) => {
    if (task) {
      const boardIndex = boards.findIndex((board) => board._id === boardId);
      setBoards((prevState) => {
        const newBoards = [...prevState];
        newBoards[boardIndex].tasks.unshift(task);
        return newBoards;
      });
    }
  };
  const handleEditTask = (boardId, task) => {
    navigate(`/app/task`, { state: { ...task, projectId: projectToShow } });
  };
  const setupTaskToDelete = (boardId, taskId) => {
    setDeleteTaskSetup({ boardId, taskId });
  };
  const handleDeleteTask = () => {
    dispatch(
      deleteTask({
        stageId: deleteTaskSetup.boardId,
        id: deleteTaskSetup.taskId,
      })
    );
    console.log("deletetask", deleteTaskSetup);
    const boardIndex = boards.findIndex(
      (board) => board._id === deleteTaskSetup.boardId
    );
    setBoards((prevState) => {
      const newBoards = [...prevState];
      newBoards[boardIndex].tasks = newBoards[boardIndex].tasks.filter(
        (task) => task._id !== deleteTaskSetup.taskId
      );
      return newBoards;
    });
    setDeleteTaskSetup({});
  };
  const handleAddBoard = () => {
    navigate(`/app/create-stage`, { state: projectToShow });
  };
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
  const closeAddTaskModal = (task) => {
    setSelectedBoardToAddTask(null);
    if (task.assignees) {
      task.assignees.forEach((assignee) => {
        let type = "ticket-added";
        socketSendUserNotification(assignee, type);
      });
    }
  };
  const handleSearch = (val) => {
    const searchKeyword = val.trim();
    const modifiedStage = [];
    boardCopy.forEach((stage) => {
      const matchingTasks = [];
      for (let i = 0; i < stage.tasks.length; i++) {
        const task = stage.tasks[i];
        if (
          task.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          task.description.toLowerCase().includes(searchKeyword.toLowerCase())
        ) {
          matchingTasks.push(task);
        }
      }
      modifiedStage.push({ ...stage, tasks: matchingTasks });
    });
    setBoards(modifiedStage);
  };
  const handleSort = (option) => {
    const sortedData = [...boardCopy];
    switch (option) {
      case "default":
        // Do nothing
        break;
      case "createdAt":
        sortedData.forEach((stage) => {
          stage.tasks.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          );
        });
        break;
      case "-createdAt":
        sortedData.forEach((stage) => {
          stage.tasks.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
        });
        break;
      case "nameAsc":
        sortedData.forEach((stage) => {
          stage.tasks.sort((a, b) => a.name.localeCompare(b.name));
        });
        break;
      case "nameDesc":
        sortedData.forEach((stage) => {
          stage.tasks.sort((a, b) => b.name.localeCompare(a.name));
        });
        break;
      default:
        // Do nothing
        break;
    }
    setBoards(sortedData);
  };
  const handleAssignedCheckbox = (e) => {
    const filteredData = [...boardCopy];
    setShowMyTask((prev) => !prev);
    if (e.target.checked) {
      const filteredTasks = filteredData
        .map((stage) => ({
          ...stage,
          tasks: stage.tasks.filter((task) =>
            task.assignees.includes(currentUser._id)
          ),
        }))
        .filter((stage) => stage.tasks.length > 0);
      setBoards(filteredTasks);
    } else {
      setBoards(filteredData);
    }
  };
  return (
    <>
      {selectedBoardToAddTask === null && (
        <>
          <div className="md:flex xs:block justify-center p-2">
            <div className="flex-1 justify-center form-control text-center">
              <div className="input-group">
                <input
                  onChange={(e) => handleSearch(e.target.value)}
                  type="text"
                  placeholder="Search…"
                  className="input input-bordered input-sm "
                />
                <button className="btn btn-square btn-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex flex-1 ">
              <select
                className="select select-sm  mt-2 select-bordered  max-w-xs"
                onChange={async (e) => handleSort(e.target.value)}
              >
                <option disabled>Sort By</option>
                <option value="default">Default</option>
                <option value="createdAt">Date(ASC)</option>
                <option value="-createdAt">Date(Desc)</option>
                <option value="nameAsc">Name (A-Z)</option>
                <option value="nameDesc">Name (Z-A)</option>
              </select>
            </div>
            <div className="flex flex-1 form-control">
              {/* <input type="checkbox" className="checkbox mt-3" onChange={(e) => handleAssignedCheckbox(e)} /> */}
              <div className="form-control w-52">
                <label className="cursor-pointer label">
                  <span className="label-text">Show My Task</span>
                  <input
                    type="checkbox"
                    className="toggle toggle-accent"
                    checked={showMyTask}
                    onChange={(e) => handleAssignedCheckbox(e)}
                  />
                </label>
              </div>
            </div>
          </div>
          <div className="min-h-screen bg-base-100">
            {(currentUser.role === "manager" ||
              currentUser.role === "admin") && (
              <header className=" shadow-lg py-1 px-8">
                <button className="btn btn-base" onClick={handleAddBoard}>
                  + Add Board
                </button>
              </header>
            )}
            <div className="flex p-6 overflow-x-auto ">
              <DragDropContext onDragEnd={handleDragEnd}>
                {boards.map((board) => (
                  <div
                    key={board._id}
                    className=" shadow-lg rounded-lg w-80 h-96 mx-1 my-1 flex-shrink-0"
                  >
                    <div className="flex items-center justify-between px-4 bg-neutral ">
                      <h2 className="font-semibold ">
                        {board.name}{" "}
                        <span className="text-success">
                          {board.tasks.length}
                        </span>{" "}
                      </h2>
                      <button
                        className="btn "
                        style={{ color: board.color }}
                        onClick={() => showAddTaskModal(board._id)}
                      >
                        + Add
                      </button>
                    </div>
                    <Droppable droppableId={board._id}>
                      {(provided, snapshot) => (
                        <div
                          className={`${
                            snapshot.isDraggingOver ? "bg-base-200" : ""
                          } flex-grow p-2 h-80 overflow-y-auto`}
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          {board.tasks.map((task, index) => (
                            <Draggable
                              key={task._id + index}
                              draggableId={task._id}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  key={task._id}
                                  className={`${
                                    snapshot.isDragging ? "opacity-75" : ""
                                  } px-4 py-2 mb-2  rounded-md shadow-lg`}
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <div className="flex">
                                    <div className="flex-2">
                                      {task.type && (
                                        <div
                                          className={`badge ${configColor(
                                            task.type[0]
                                          )} badge-outline mr-2`}
                                        >
                                          {task.type[0]}
                                        </div>
                                      )}
                                      {task.priority && (
                                        <div
                                          className={`badge ${configColor(
                                            task.priority[0]
                                          )} badge-outline mr-2`}
                                        >
                                          {task.priority[0]}{" "}
                                        </div>
                                      )}
                                    </div>
                                    {task.assignees && (
                                      <div className="flex-1 justify-end avatar-group -space-x-3">
                                        {task.assignees.map(
                                          (assignee, index) => {
                                            if (index < 2) {
                                              return (
                                                extractTeamImage(assignee) !==
                                                  null && (
                                                  <>
                                                    <div
                                                      key={
                                                        assignee.toString() +
                                                        index
                                                      }
                                                      className="avatar"
                                                    >
                                                      <div className="w-5">
                                                        <img
                                                          src={`${extractTeamImage(
                                                            assignee
                                                          )}`}
                                                        />
                                                      </div>
                                                    </div>
                                                  </>
                                                )
                                              );
                                            }
                                          }
                                        )}
                                        {task.assignees.length > 2 && (
                                          <div className="avatar placeholder">
                                            <div className="w-5 bg-neutral-focus text-neutral-content">
                                              <span className="text-xs">
                                                +{task.assignees.length - 2}
                                              </span>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  <div className="task-title">
                                    <p className="mt-4">
                                      {task.name.substring(0, 32)}
                                    </p>
                                  </div>
                                  <div className="flex">
                                    <div className="flex-1 mt-5">
                                      <span className="text-xs ">
                                        {moment(task.updatedAt).format(
                                          "YYYY MMM DD"
                                        )}
                                      </span>
                                    </div>
                                    <div className="flex-2 flex justify-end  mt-2">
                                      <button
                                        className="btn btn-ghost"
                                        onClick={() =>
                                          handleEditTask(board._id, task)
                                        }
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          viewBox="0 0 20 20"
                                          fill="currentColor"
                                          className="w-5 h-5"
                                        >
                                          <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
                                        </svg>
                                      </button>
                                      <label
                                        htmlFor="delete-modal"
                                        className="btn btn-ghost"
                                        onClick={() =>
                                          setupTaskToDelete(board._id, task._id)
                                        }
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          viewBox="0 0 20 20"
                                          fill="currentColor"
                                          className="w-5 h-5"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                ))}
              </DragDropContext>
            </div>
            <div className="deleteModal">
              <input
                type="checkbox"
                id="delete-modal"
                className="modal-toggle"
              />
              <div className="modal">
                <div className="modal-box relative">
                  <label
                    htmlFor="delete-modal"
                    className="btn btn-sm btn-circle absolute right-2 top-2"
                  >
                    ✕
                  </label>
                  <h3 className="text-lg font-bold">Delete Task</h3>
                  <p className="py-4">Are you sure you want to delete?</p>
                  <div className="modal-action">
                    <label
                      htmlFor="delete-modal"
                      onClick={handleDeleteTask}
                      className="btn btn-success"
                    >
                      Yes
                    </label>
                    <label htmlFor="delete-modal" className="btn btn-error">
                      No
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {selectedBoardToAddTask !== null && (
        <div>
          <AddTask
            modifyBoard={modifyBoard}
            closeModal={closeAddTaskModal}
            stageId={selectedBoardToAddTask}
          />
        </div>
      )}
    </>
  );
}
export default InternalPage;
