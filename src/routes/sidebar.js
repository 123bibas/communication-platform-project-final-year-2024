/** Icons are imported separatly to reduce build time */
import EnvelopeIcon from "@heroicons/react/24/outline/EnvelopeIcon";
import KeyIcon from "@heroicons/react/24/outline/KeyIcon";
import Squares2X2Icon from "@heroicons/react/24/outline/Squares2X2Icon";
import TicketIcon from "@heroicons/react/24/outline/TicketIcon";
import UserIcon from "@heroicons/react/24/outline/UserIcon";
import UsersIcon from "@heroicons/react/24/outline/UsersIcon";
import WalletIcon from "@heroicons/react/24/outline/WalletIcon";
const iconClasses = `h-6 w-6`;
const submenuIconClasses = `h-5 w-5`;
const routes = [
  {
    path: "/app/dashboard",
    icon: <Squares2X2Icon className={iconClasses} />,
    name: "Dashboard",
    isAccessible: ["admin"],
  },
  {
    path: "/app/email",
    icon: <EnvelopeIcon className={iconClasses} />,
    name: "Send Email",
    isAccessible: ["admin"],
  },
  {
    path: "/app/project-list",
    icon: <WalletIcon className={submenuIconClasses} />,
    name: "Projects",
    isAccessible: ["admin", "manager", "team"],
  },
  {
    path: "/app/create-project",
    icon: <TicketIcon className={submenuIconClasses} />,
    name: "Create Project",
    isAccessible: ["admin", "manager"],
  },
  {
    path: "/app/settings-profile", //url
    icon: <UserIcon className={submenuIconClasses} />, // icon component
    name: "Profile", // name that appear in Sidebar
    isAccessible: ["admin", "manager", "team", "user"],
  },
  {
    path: "/app/change-password",
    icon: <KeyIcon className={submenuIconClasses} />,
    name: "Change Password",
    isAccessible: ["admin", "manager", "team", "user"],
  },
  {
    path: "/app/settings-team", // url
    icon: <UsersIcon className={submenuIconClasses} />, // icon component
    name: "Team Members", // name that appear in Sidebar
    isAccessible: ["admin"],
  },
];
export default routes;
