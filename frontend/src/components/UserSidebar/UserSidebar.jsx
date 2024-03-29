import { Link, useLocation } from "react-router-dom";
import "./user_sidebar.css";
import Dashboard from "../../routes/User/Dashboard";
import { FaMapMarked } from "react-icons/fa";
import { MdChat, MdReportProblem } from "react-icons/md";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { FiAlertTriangle } from "react-icons/fi";
import { FaHistory } from "react-icons/fa";

import { MdCall } from "react-icons/md";
import { useAuth } from "../../store/AuthProvider/AuthProvider";

export const sidebarItems = [
  { title: "Dashboard", path: "/dashboard", Icon: MdOutlineSpaceDashboard },
  {
    title: "Report Incident",
    path: "/incident/report",
    Icon: MdReportProblem,
    auth: true
  },
  {
    title: "Report Anonymously",
    path: "/incident/anonymous/report",
    Icon: FiAlertTriangle,
    auth:false
  },

  { title: "Incidents History", path: "/incidents/history", Icon: FaHistory, auth:true },
  { title: "Chat", path: "/chat", Icon: MdChat, auth:true },
];





const UserSidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
   const {authUser }= useAuth()


   const filteredItems = sidebarItems.filter((item) =>
   authUser ? item.auth !== false : item.auth !== true
 );
  const getActivePath = (path) => {
    return path === currentPath ? "active" : "";
  };

  return (
    <div className="u-sidebar">
      <div className="sidebar-header">
        <Link to="/admin/dashboard" className="sidebar-brand">
          SafetyFast
        </Link>
      </div>
      <div className="sidebar-center">
        <ul className="u-sidebar-links">
          {filteredItems.map((item, idx) => (
            <li
              className={`sidebar-link-item ${getActivePath(item.path)}`}
              key={idx}
            >
              <Link to={item.path}>
                <item.Icon className="icon" /> {item.title}
              </Link>
            </li>
          ))}
              <li className={`sidebar-link-item ${getActivePath('/incident/map')}`}>
            <Link to='/incident/map' ><FaMapMarked className='icon'/> Incidents Map</Link>
          </li>
          {/* <li className="sidebar-link-item">
            <Link to='/dashboard' ><MdOutlineSpaceDashboard className='icon'/> Dashboard</Link>
          </li>
          <li className="sidebar-link-item active">
            <Link to='/incident/report' > <MdReportProblem className='icon'/>Report Incident</Link>
          </li>
          <li className="sidebar-link-item">
            <Link to='/incident/report?anonymous=true' > <MdReportProblem className='icon'/> Report Anonymously</Link>
          </li>
      

          <li className="sidebar-link-item">
            <Link to='/dashboard' ><FaHistory className='icon'/> Incidents History</Link>
          </li> */}
        </ul>
      </div>
    </div>
  );
};

export default UserSidebar;
