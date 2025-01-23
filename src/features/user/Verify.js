import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { RESET, verifyUser } from './slice/authSlice';
const Verify = () => {
    const dispatch = useDispatch()
    const [message, setMessage] = useState('Verifying Your account')
    const { token } = useParams();
    const { isSuccess, isError } = useSelector(
        (state) => state.auth
    );
    useEffect(() => {
        const userVerification = async () => {
            await dispatch(verifyUser(token))
        }
        userVerification()
    }, [])
    useEffect(() => {
        if (isSuccess) {
            setMessage("Your verification has been completed!")
            setTimeout(() => {
                window.location.href = '/app/welcome'
            }, 5000)
        }
        if (isError) {
            setMessage("Couldnot verify token")
        }
        dispatch(RESET())
    }, [isSuccess, isError])
    return (
        <div className="alert alert-success shadow-lg">
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{message}</span>
            </div>
        </div>
    )
}
export default Verify