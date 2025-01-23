import { GoogleLogin } from '@react-oauth/google'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import InputText from '../../components/Input/InputText'
import ErrorText from '../../components/Typography/ErrorText'
import LandingIntro from './LandingIntro'
import { RESET, login, loginWithGoogle } from './slice/authSlice'
function Login() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const INITIAL_LOGIN_OBJ = {
        password: "",
        email: ""
    }
    const { isSuccess, isError, user, twoFactor } = useSelector(
        (state) => state.auth
    )
    useEffect(() => {
        if (twoFactor && isError) {
            //redirect to login with code
            navigate('/loginWithCode')
        }
        if (isSuccess && !isError && user) {
            localStorage.setItem("token", user.token)
            localStorage.setItem("user", JSON.stringify(user))
            setTimeout(() => {
                navigate('/app/welcome')
            }, 2000);
            dispatch(RESET())
        }
    }, [isSuccess, isError, twoFactor])
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [loginObj, setLoginObj] = useState(INITIAL_LOGIN_OBJ)
    const submitForm = async (e) => {
        e.preventDefault()
        setErrorMessage("")
        if (loginObj.email.trim() === "") return setErrorMessage("Email Id is required! (use any value)")
        if (loginObj.password.trim() === "") return setErrorMessage("Password is required! (use any value)")
        else {
            setLoading(true)
            await dispatch(login(loginObj))
            setLoading(false)
        }
    }
    const updateFormValue = ({ updateType, value }) => {
        setErrorMessage("")
        setLoginObj({ ...loginObj, [updateType]: value })
    }
    const googleLogin = async (credentialResponse) => {
        console.log(credentialResponse);
        await dispatch(
            loginWithGoogle({ userToken: credentialResponse.credential })
        );
    };
    return (
        <div className="min-h-screen bg-base-200 flex items-center">
            <div className="card mx-auto w-full max-w-5xl  shadow-xl">
                <div className="grid  md:grid-cols-2 grid-cols-1  bg-base-100 rounded-xl">
                    <div className=''>
                        <LandingIntro />
                    </div>
                    <div className='py-24 px-10'>
                        <h2 className='text-2xl font-semibold mb-2 text-center'>Login</h2>
                        <form onSubmit={(e) => submitForm(e)}>
                            <div className="mb-4">
                                <InputText type="email" defaultValue={loginObj.email} updateType="email" containerStyle="mt-4" labelTitle="Email Id" updateFormValue={updateFormValue} />
                                <InputText defaultValue={loginObj.password} type="password" updateType="password" containerStyle="mt-4" labelTitle="Password" updateFormValue={updateFormValue} />
                            </div>
                            <div className='text-right text-primary'><Link to="/forgot-password"><span className="text-sm  inline-block  hover:text-primary hover:underline hover:cursor-pointer transition duration-200">Forgot Password?</span></Link>
                            </div>
                            <ErrorText styleClass="mt-8">{errorMessage}</ErrorText>
                            <button type="submit" className={"btn mt-2 w-full btn-primary" + (loading ? " loading" : "")}>Login</button>
                            <span className={"btn mt-2 w-full btn-dark" + (loading ? " loading" : "")}>
                                <GoogleLogin
                                    type="icon"
                                    shape='pill'
                                    className='cursor: pointer'
                                    onSuccess={googleLogin}
                                    onError={() => {
                                        console.log("Login Failed");
                                        toast.error("Login Failed");
                                    }}
                                />
                            </span >
                            <div className='text-center mt-4'>Don't have an account yet? <Link to="/register"><span className="  inline-block  hover:text-primary hover:underline hover:cursor-pointer transition duration-200">Register</span></Link></div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Login