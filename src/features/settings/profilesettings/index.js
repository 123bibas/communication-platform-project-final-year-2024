import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../../components/Cards/TitleCard";
import InputText from "../../../components/Input/InputText";
import { RESET, updateUser } from "../../user/slice/authSlice";
function ProfileSettings() {
  const dispatch = useDispatch();
  const [userDetail, setUserDetail] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const [progress, setProgress] = useState(0);
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState(0);
  const [photo, setPhoto] = useState("");
  const { user, isSuccess, message } = useSelector((state) => state.auth);
  useEffect(() => {
    setPhoto(userDetail.photo);
    setPhone(userDetail.phone);
  }, []);
  useEffect(() => {
    if (user && isSuccess) {
      localStorage.setItem("user", JSON.stringify(user));
      setUserDetail(JSON.parse(localStorage.getItem("user")));
    }
    dispatch(RESET());
  }, [user, isSuccess]);
  // Call API to update profile settings changes
  const updateProfile = () => {
    const formData = new FormData();
    formData.append("phone", phone.toString());
    formData.append("photo", photo);
    formData.append("bio", bio);
    dispatch(updateUser(formData));
  };
  // Function to handle the image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    // Update progress as the file is being loaded
    reader.onprogress = (event) => {
      setProgress(Math.round((event.loaded / event.total) * 100));
    };
    // Once the file has been completely loaded, do something with it
    reader.onload = (event) => {
      const imageData = event.target.result;
      setPhoto(imageData);
      // Do something with the image data here...
      console.log(imageData);
    };
    // Start reading the file
    reader.readAsDataURL(file);
  };
  return (
    <>
      <TitleCard title="Profile Settings" topMargin="mt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputText
            disabled={true}
            labelTitle="Name"
            defaultValue={userDetail.name}
          />
          <InputText
            disabled={true}
            labelTitle="Email Id"
            defaultValue={userDetail.email}
          />
          <div className={`form-control w-full`}>
            <label className="label">
              <span className={"label-text text-base-content "}>Phone</span>
            </label>
            <input
              className="input  input-bordered w-full "
              type="number"
              defaultValue={userDetail.phone}
              onChange={(e) => setPhone(e.target.value.toString())}
            />
          </div>
          <div className={`form-control w-full`}>
            <label className="label">
              <span className={"label-text text-base-content "}>Bio</span>
            </label>
            <textarea
              className="input  input-bordered w-full "
              defaultValue={userDetail.bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
        </div>
        <div className="divider"></div>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
          <div>
            <div className="avatar">
              <div className="w-24 rounded">
                <img src={photo} />
              </div>
            </div>
            <div>
              {/* <input type="file" className="p-2" onChange={handleImageUpload} accept="image/*" /> */}
              <input type="file" className="p-2" onChange={handleImageUpload} />
              {!progress ? (
                <div></div>
              ) : (
                <span
                  className="radial-progress "
                  style={{ "--value": progress, "--size": "3.2rem" }}
                >
                  {progress}%
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="mt-16">
          <button
            className="btn btn-primary float-right"
            onClick={() => updateProfile()}
          >
            Update
          </button>
        </div>
      </TitleCard>
    </>
  );
}
export default ProfileSettings;
