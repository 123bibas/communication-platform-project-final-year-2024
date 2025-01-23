import React, { lazy, useEffect } from 'react'
import axios from "axios";
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { themeChange } from 'theme-change'
import checkAuth from './app/auth';
import initializeApp from './app/init';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
// Importing pages
const Layout = lazy(() => import('./containers/Layout'))
const Login = lazy(() => import('./pages/Login'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const LoginWithCode = lazy(() => import('./pages/LoginWithCode'))
const ResetPassword = lazy(() => import('./pages/ResetPassword'))
const Register = lazy(() => import('./pages/Register'))
const Verify = lazy(() => import('./pages/Verify'))
axios.defaults.withCredentials = true;
// Initializing different libraries
initializeApp()
// Check for login and initialize axios
const token = checkAuth()
function App() {
  useEffect(() => {
    // 👆 daisy UI themes initialization
    themeChange(false)
  }, [])
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Router>
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
          <Routes>
            {!token && (<>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify/:token" element={<Verify />} />
              <Route path="/loginWithCode" element={<LoginWithCode />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/resetPassword/:resetToken" element={<ResetPassword />} />
            </>)
              /* Place new routes over this */}
            <Route path="/app/*" element={<Layout />} />
            <Route path="*" element={<Navigate to={token ? "/app/welcome" : "/login"} replace />} />
          </Routes>
        </GoogleOAuthProvider>
      </Router>
    </>
  )
}
export default App
