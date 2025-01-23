import { themeChange } from "theme-change";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import BellIcon from "@heroicons/react/24/outline/BellIcon";
import Bars3Icon from "@heroicons/react/24/outline/Bars3Icon";
import MoonIcon from "@heroicons/react/24/outline/MoonIcon";
import SunIcon from "@heroicons/react/24/outline/SunIcon";
import { openRightDrawer } from "../features/common/rightDrawerSlice";
import { RIGHT_DRAWER_TYPES } from "../utils/globalConstantUtil";
import { Link } from "react-router-dom";
import { RESET } from "../features/user/slice/authSlice";
import {
  getNotifications,
  readNotifications,
} from "../features/common/slice/NotificationSlice";
import { initializeSocket, socketGetNotifications } from "../socket/Socket";
function Header() {
  const dispatch = useDispatch();
  const { noOfNotifications, pageTitle } = useSelector((state) => state.header);
  const [currentTheme, setCurrentTheme] = useState(
    localStorage.getItem("theme")
  );
  const [userDetail, setUserDetail] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const { notifications } = useSelector((state) => state.notification);
  const { user, isSuccess } = useSelector((state) => state.auth);
  useEffect(() => {
    themeChange(false);
    if (currentTheme === null) {
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        setCurrentTheme("dark");
      } else {
        setCurrentTheme("light");
      }
    }
    // 👆 false parameter is required for react project
  }, []);
  useEffect(() => {
    if (user) {
      setUserDetail(JSON.parse(localStorage.getItem("user")));
    }
  }, [user, isSuccess]);
  useEffect(() => {
    const token = localStorage.getItem("token");
    dispatch(getNotifications(userDetail._id));
    console.log("user_", userDetail);
    initializeSocket(token, userDetail);
    socketGetNotifications(userDetail, dispatch);
  }, []);
  // Opening right sidebar for notification
  const openNotification = () => {
    dispatch(
      openRightDrawer({
        header: "Notifications",
        bodyType: RIGHT_DRAWER_TYPES.NOTIFICATION,
      })
    );
    const unreadNotification = notifications.filter((n) => n.read === false);
    console.log("unread notification", unreadNotification);
    if (unreadNotification.length > 0) {
      dispatch(readNotifications());
    }
  };
  function logoutUser() {
    localStorage.clear();
    dispatch(RESET());
    window.location.href = "/";
  }
  return (
    <>
      <div className="navbar  flex justify-between bg-base-100  z-10 shadow-md ">
        {/* Menu toogle for mobile view or small screen */}
        <div className="">
          <label
            htmlFor="left-sidebar-drawe "
            className="btn btn-primary drawer-button lg:hidden"
          >
            <Bars3Icon className="h-5 inline-block w-5" />
          </label>
          <h1 className="text-2xl font-semibold ml-2">{pageTitle}</h1>
        </div>
        <div className="order-last">
          {/* Multiple theme selection, uncomment this if you want to enable multiple themes selection, 
                also includes corporate and retro themes in tailwind.config file */}
          {/* <select className="select select-sm mr-4" data-choose-theme>
                        <option disabled selected>Theme</option>
                        <option value="light">Default</option>
                        <option value="dark">Dark</option>
                        <option value="corporate">Corporate</option>
                        <option value="retro">Retro</option>
                    </select> */}
          {/* Light and dark theme selection toogle **/}
          <label className="swap ">
            <input type="checkbox" />
            <SunIcon
              data-set-theme="light"
              data-act-class="ACTIVECLASS"
              className={
                "fill-current w-6 h-6 " +
                (currentTheme === "dark" ? "swap-on" : "swap-off")
              }
            />
            <MoonIcon
              data-set-theme="dark"
              data-act-class="ACTIVECLASS"
              className={
                "fill-current w-6 h-6 " +
                (currentTheme === "light" ? "swap-on" : "swap-off")
              }
            />
          </label>
          {/* Notification icon */}
          {notifications && (
            <button
              className="btn btn-ghost ml-4  btn-circle"
              onClick={() => openNotification()}
            >
              <div className="indicator">
                <BellIcon className="h-6 w-6" />
                {notifications.reduce(
                  (count, notification) => count + (!notification.read ? 1 : 0),
                  0
                ) > 0 ? (
                  <span className="indicator-item badge badge-secondary badge-sm">
                    {notifications.reduce(
                      (count, notification) =>
                        count + (!notification.read ? 1 : 0),
                      0
                    )}
                  </span>
                ) : null}
              </div>
            </button>
          )}
          {/* Profile icon, opening menu on click */}
          <div className="dropdown dropdown-end ml-4">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img src={userDetail.photo} alt="profile" />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
            >
              <div className="flex p-2">
                <div className="flex-1 ">
                  <div className="w-10 rounded-full">
                    <img
                      className="w-10 rounded-full"
                      src={userDetail.photo}
                      alt="profile"
                    />
                  </div>
                </div>
                <div className="flex-1 ">
                  <p className="p-2">{userDetail.email.substr(0, 12)}..</p>
                </div>
              </div>
              <li className="justify-between">
                <Link to={"/app/settings-profile"}>Profile Settings</Link>
              </li>

              <div className="divider mt-0 mb-0"></div>
              <li>
                <a onClick={logoutUser}>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
export default Header;
