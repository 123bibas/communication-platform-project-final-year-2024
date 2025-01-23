import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import InputText from '../../components/Input/InputText'
import ErrorText from '../../components/Typography/ErrorText'
import LandingIntro from './LandingIntro'
import { RESET, loginWithCode, sendLoginCode } from './slice/authSlice'
function LoginWithCode() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const INITIAL_USER_OBJ = {
        email: ""
    }
    const INITIAL_LOGIN_CODE = {
        code: ""
    }
    const { isSuccess, isError, user, twoFactor } = useSelector(
        (state) => state.auth
    )
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [linkSent, setLinkSent] = useState(false)
    const [userObj, setUserObj] = useState(INITIAL_USER_OBJ)
    const [loginCode, setLoginCode] = useState(INITIAL_LOGIN_CODE)
    useEffect(() => {
        if (!twoFactor) {
            window.location.href = "/"
            dispatch(RESET())
        }
    }, [])
    useEffect(() => {
        console.log(twoFactor)
        if (user) {
            localStorage.setItem("token", user.token)
            localStorage.setItem("user", JSON.stringify(user))
            console.log("hey login with code was successfull", user)
            setTimeout(() => {
                navigate('/app/welcome')
            }, 2000);
            dispatch(RESET())
        }
        if (isSuccess & !isError) {
            console.log("hey send code was successfull")
            setLinkSent(true)
            dispatch(RESET())
        }
    }, [isSuccess, isError, user, dispatch])
    const submitgetLoginCodeForm = async (e) => {
        e.preventDefault()
        setErrorMessage("")
        if (userObj.email.trim() === "") return setErrorMessage("Email is required! ")
        else {
            setLoading(true)
            // Call API to submit login code
            await dispatch(sendLoginCode(userObj.email))
            setLoading(false)
            setLinkSent(true)
        }
    }
    const submitverifyLoginCodeForm = async (e) => {
        e.preventDefault()
        setErrorMessage("")
        if (loginCode.code.trim() === "") return setErrorMessage("Code is required!")
        else {
            setLoading(true)
            // Call API to send password reset link
            const code = {
                loginCode: loginCode.code,
            };
            await dispatch(loginWithCode({ code, email: userObj.email }))
            setLoading(false)
        }
    }
    const updateFormValue = ({ updateType, value }) => {
        setErrorMessage("")
        setUserObj({ ...userObj, [updateType]: value })
    }
    const updateLoginCodeFormValue = ({ updateType, value }) => {
        setErrorMessage("")
        setLoginCode({ ...loginCode, [updateType]: value })
    }
    return (
        <div className="min-h-screen bg-base-200 flex items-center">
            <div className="card mx-auto w-full max-w-5xl  shadow-xl">
                <div className="grid  md:grid-cols-2 grid-cols-1  bg-base-100 rounded-xl">
                    <div className=''>
                        <LandingIntro />
                    </div>
                    <div className='py-24 px-10'>
                        <h2 className='text-2xl font-semibold mb-2 text-center'>Login With Code</h2>
                        {
                            !linkSent &&
                            <>
                                <p className='my-8 font-semibold text-center'>We will send login code on your email Id</p>
                                <form onSubmit={(e) => submitgetLoginCodeForm(e)}>
                                    <div className="mb-4">
                                        <InputText type="email" defaultValue={userObj.email} updateType="email" containerStyle="mt-4" labelTitle="Email Id" updateFormValue={updateFormValue} />
                                    </div>
                                    <ErrorText styleClass="mt-12">{errorMessage}</ErrorText>
                                    <button type="submit" className={"btn mt-2 w-full btn-primary" + (loading ? " loading" : "")}>Send Login Code</button>
                                    <div className='text-center mt-4'>Don't have an account yet? <Link to="/register"><button className="  inline-block  hover:text-primary hover:underline hover:cursor-pointer transition duration-200">Register</button></Link></div>
                                </form>
                            </>
                        }
                        {
                            linkSent &&
                            <>
                                <p className='my-8 font-semibold text-center'>Please enter the login code</p>
                                <form onSubmit={(e) => submitverifyLoginCodeForm(e)}>
                                    <div className="mb-4">
                                        <InputText type="number" defaultValue={loginCode.code} updateType="code" containerStyle="mt-4" labelTitle="Login Code " updateFormValue={updateLoginCodeFormValue} />
                                    </div>
                                    <ErrorText styleClass="mt-12">{errorMessage}</ErrorText>
                                    <button type="submit" className={"btn mt-2 w-full btn-primary" + (loading ? " loading" : "")}>Login</button>
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
export default LoginWithCode