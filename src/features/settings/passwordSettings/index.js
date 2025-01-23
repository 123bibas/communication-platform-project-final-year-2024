import { useEffect } from "react"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import TitleCard from "../../../components/Cards/TitleCard"
import { changePassword, logout, RESET } from "../../user/slice/authSlice"
function ChangePassword() {
    const dispatch = useDispatch()
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmNewPassword, setConfirmNewPassword] = useState("")
    const [passwordMatch, setPasswordMatch] = useState(false)
    const { isSuccess, message } = useSelector(
        (state) => state.auth
    )
    useEffect(() => {
        if (newPassword && confirmNewPassword) {
            if (newPassword !== confirmNewPassword) {
                setPasswordMatch(false)
            }
            else {
                setPasswordMatch(true)
            }
        }
    }, [newPassword, confirmNewPassword])
    useEffect(() => {
        if (isSuccess) {
            dispatch(logout())
            setTimeout(() => {
                localStorage.clear()
                dispatch(RESET())
                window.location.href = '/'
                toast.success("Redirecting to Login")
            }, 5000);
        }
    }, [isSuccess])
    const handleSubmit = () => {
        if (newPassword === confirmNewPassword) {
            const data = { oldPassword: oldPassword, password: newPassword }
            dispatch(changePassword(data))
        }
    }
    return (
        <>
            <TitleCard title="Change Password" topMargin="mt-2">
                {/* Invoice list in table format loaded constant */}
                <div className="overflow-x-auto w-full">
                    <div className={`form-control w-full`}>
                        <label className="label">
                            <span className={"label-text text-base-content "}>Old Password</span>
                        </label>
                        <input type='password' className="input  input-bordered w-full " onChange={(e) => setOldPassword(e.target.value)} />
                    </div>
                    <div className={`form-control w-full`}>
                        <label className="label">
                            <span className={"label-text text-base-content "}>New Password</span>
                        </label>
                        <input type='password' className="input  input-bordered w-full " onChange={(e) => setNewPassword(e.target.value)} />
                    </div>
                    <div className={`form-control w-full`}>
                        <label className="label">
                            <span className={"label-text text-base-content "}>Confirm New Password </span>
                            <br />
                            {(!passwordMatch && newPassword && confirmNewPassword) && <span className={"label-text text-base-content text-error "}>New Passwords Should Match</span>}
                        </label>
                        <input type='password' className="input  input-bordered w-full " onChange={(e) => setConfirmNewPassword(e.target.value)} />
                    </div>
                    <div className="mt-4">
                        <button onClick={handleSubmit} disabled={!passwordMatch} className="btn btn-primary">Change</button>
                    </div>
                </div>
            </TitleCard>
        </>
    )
}
export default ChangePassword