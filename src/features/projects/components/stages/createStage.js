import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { RESET, createStage } from "../../slice/projectSlice";
const CreateStage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const projectToAddStageInto = location.state;
  if (!projectToAddStageInto) {
    window.location.href = "/";
  }
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const colorRef = useRef("#FFFFFF");
  const { stage, isSuccess } = useSelector((state) => state.project);
  useEffect(() => {
    console.log("projectToAdd into", projectToAddStageInto);
  }, []);
  useEffect(() => {
    if (isSuccess && stage) {
      dispatch(RESET());
      navigate(`/app/kanban`, { state: projectToAddStageInto });
    }
  }, [stage]);
  const handleClick = () => {
    console.log(name, description, colorRef.current, projectToAddStageInto);
    const data = {
      name,
      description,
      color: colorRef.current.toString(),
      project: projectToAddStageInto,
    };
    console.log(data);
    dispatch(createStage({ projectToAddStageInto, data }));
  };
  return (
    <>
      {projectToAddStageInto && (
        <div className="modal-box relative">
          <label
            onClick={() =>
              navigate(`/app/kanban`, { state: projectToAddStageInto })
            }
            htmlFor="my-modal-3"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <div className={`form-control `}>
            <label className="label">
              <span className={"label-text text-base-content "}>Name</span>
            </label>
            <input
              onChange={(e) => setName(e.target.value)}
              type="text"
              className="input  input-bordered w-full "
            />
          </div>
          <div className={`form-control `}>
            <label className="label">
              <span className={"label-text text-base-content "}>
                Description
              </span>
            </label>
            <textarea
              onChange={(e) => setDescription(e.target.value)}
              type="text"
              className="textarea textarea-bordered  "
            />
          </div>
          <div className="form-control"></div>
          <label className="label">
            <span className={"label-text text-base-content "}>
              Choose stage color:
            </span>
          </label>
          <input
            type="color"
            className="input input-bordered w-full cursor-pointer"
            onChange={(e) => (colorRef.current = e.target.value)}
          />
          <div className="form-control mt-4">
            {" "}
            <button
              disabled={!name.trim().length > 0}
              className="btn btn-dark"
              onClick={handleClick}
            >
              Create
            </button>
          </div>
        </div>
      )}
    </>
  );
};
export default CreateStage;
