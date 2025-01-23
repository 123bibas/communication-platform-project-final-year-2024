import jwt_decode from "jwt-decode";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import routes from "../routes/sidebar";
import SidebarSubmenu from "./SidebarSubmenu";
const token = localStorage.getItem("token");
function LeftSidebar() {
  const [filterRoutes, setFiltereRoutes] = useState(routes);
  const location = useLocation();
  useEffect(() => {
    const decodedToken = jwt_decode(token);
    console.log(decodedToken.role);
    setFiltereRoutes(filterRoutesByRole(routes, decodedToken.role));
  }, []);
  function filterRoutesByRole(routesToFilter, role) {
    return routesToFilter.filter((route) => {
      if (route.isAccessible.includes(role)) {
        if (route.submenu) {
          route.submenu = route.submenu.filter((submenuItem) => {
            return submenuItem.isAccessible.includes(role);
          });
          return route.submenu.length > 0;
        }
        return true;
      }
      return false;
    });
  }
  return (
    <div className="drawer-side ">
      <label htmlFor="left-sidebar-drawer" className="drawer-overlay"></label>
      <ul className="menu  pt-2 w-80 bg-base-100 text-base-content">
        <li className="mb-2 font-semibold text-xl">
          <Link to={"/app/welcome"}>
            <img
              className="mask mask-squircle w-10"
              src="/logo192.png"
              alt="Communication"
            />
            Projeeto
          </Link>{" "}
        </li>
        {filterRoutes.map((route, k) => {
          return (
            <li className="" key={k}>
              {route.submenu ? (
                <SidebarSubmenu {...route} />
              ) : (
                <NavLink
                  end
                  to={route.path}
                  className={({ isActive }) =>
                    `${
                      isActive ? "font-semibold  bg-base-200 " : "font-normal"
                    }`
                  }
                >
                  {route.icon} {route.name}
                  {location.pathname === route.path ? (
                    <span
                      className="absolute inset-y-0 left-0 w-1 rounded-tr-md rounded-br-md bg-primary "
                      aria-hidden="true"
                    ></span>
                  ) : null}
                </NavLink>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
export default LeftSidebar;
