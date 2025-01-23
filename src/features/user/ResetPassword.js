import CheckCircleIcon from '@heroicons/react/24/solid/CheckCircleIcon'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import InputText from '../../components/Input/InputText'
import ErrorText from '../../components/Typography/ErrorText'
import LandingIntro from './LandingIntro'
import { RESET, resetPassword } from './slice/authSlice'
function ResetPassword() {
    const dispatch = useDispatch()
    const { resetToken } = useParams()
    const INITIAL_USER_OBJ = {
        password: ""
    }
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [linkSent, setLinkSent] = useState(false)
    const [userObj, setUserObj] = useState(INITIAL_USER_OBJ)
    const { isSuccess, isError } = useSelector(
        (state) => state.auth
    )
    useEffect(() => {
        if (isSuccess) {
            setLinkSent(true)
            dispatch(RESET())
        }
    }, [isSuccess, isError])
    const submitForm = async (e) => {
        e.preventDefault()
        setErrorMessage("")
        if (userObj.password.trim() === "") return setErrorMessage("Password  is required! ")
        else {
            setLoading(true)
            // Call API to reset password 
            const userData = {
                password: userObj.password,
            }
            await dispatch(resetPassword({ userData, resetToken }))
            setLoading(false)
        }
    }
    const updateFormValue = ({ updateType, value }) => {
        setErrorMessage("")
        setUserObj({ ...userObj, [updateType]: value })
    }
    return (
        <div className="min-h-screen bg-base-200 flex items-center">
            <div className="card mx-auto w-full max-w-5xl  shadow-xl">
                <div className="grid  md:grid-cols-2 grid-cols-1  bg-base-100 rounded-xl">
                    <div className=''>
                        <LandingIntro />
                    </div>
                    <div className='py-24 px-10'>
                        <h2 className='text-2xl font-semibold mb-2 text-center'>Reset Password</h2>
                        {
                            linkSent &&
                            <>
                                <div className='text-center mt-8'><CheckCircleIcon className='inline-block w-32 text-success' /></div>
                                <p className='my-4 text-xl font-bold text-center'>Done</p>
                                <p className='mt-4 mb-8 font-semibold text-center'>Password Reset Successful</p>
                                <div className='text-center mt-4'><Link to="/login"><button className="btn btn-block btn-primary ">Login</button></Link></div>
                            </>
                        }
                        {
                            !linkSent &&
                            <>
                                <p className='my-8 font-semibold text-center'>Please Enter Your New Password</p>
                                <form onSubmit={(e) => submitForm(e)}>
                                    <div className="mb-4">
                                        <InputText type="password" defaultValue={userObj.password} updateType="password" containerStyle="mt-4" labelTitle="Password" updateFormValue={updateFormValue} />
                                    </div>
                                    <ErrorText styleClass="mt-12">{errorMessage}</ErrorText>
                                    <button type="submit" className={"btn mt-2 w-full btn-primary" + (loading ? " loading" : "")}>Send Reset Link</button>
                                    <div className='text-center mt-4'>Don't have an account yet? <Link to="/register"><button className="  inline-block  hover:text-primary hover:underline hover:cursor-pointer transition duration-200">Register</button></Link></div>
                                </form>
                            </>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ResetPassword