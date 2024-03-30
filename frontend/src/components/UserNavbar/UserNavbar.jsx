import { BiUser } from "react-icons/bi";
import { CiLogin } from "react-icons/ci";
import "./user_nav.css";
import {
  FaBell,
  FaChevronDown,
  FaRegBell,
  FaTrash,
  FaUser,
  FaUserCircle,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { useAuth } from "../../store/AuthProvider/AuthProvider";
import { SocketContext } from "../../store/AuthProvider/SocketProvider";
import { FaTrashCan } from "react-icons/fa6";
import moment from "moment";
const UserNavbar = () => {
  const [activeItem, setActiveItem] = useState(null);
  const { setAuthUser, logout, authUser } = useAuth();
  const { notifications, updateNotification, deleteNotification } =
    useContext(SocketContext);
  const navigate = useNavigate();
  const handleItemClick = (itemName) => {
    setActiveItem(activeItem === itemName ? null : itemName);
  };

  const handleDocumentClick = (event) => {
    const navItems = document.querySelectorAll(".nav-link-item");

    if (!Array.from(navItems).some((item) => item.contains(event.target))) {
    
      setActiveItem(null);
    }
  };

  function handleLogout() {
    logout();
  }
  function handleNavigate() {
    navigate("/user/profile");
  }

  function handleNotifItemClick(notifItem) {
    updateNotification(notifItem);
  }

  function handleDeleteNotification(notif) {
    deleteNotification(notif);
  }

  useEffect(() => {
    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);
  return (
    <div className="user-nav">
      <div className="nav-container">
        <div className="sidebar-header nav-brand">
          <Link to="#" className="sidebar-brand">
            SafetyFast
          </Link>
        </div>
        <div className="nav-links">
          {authUser?.id ? (
            <>
              <div
                className={`nav-link-item ${
                  activeItem === "bell" ? "active" : ""
                }`}
              >
                <div className="notif-icon">
                  <FaRegBell
                    className="bell"
                    onClick={() => handleItemClick("bell")}
                  />

                  <div className="notif-count">
                    {
                      notifications?.filter((notif) => notif.read !== true)
                        .length
                    }
                  </div>
                </div>
                <div className="subnav-items-container">
                  <div className="notification-container">
                    <div className="notif-header">Notifications</div>

                    <div className="notifs_body">
                      {notifications.map((notif) => (
                        <div
                          className={
                            notif.read ? "notif-item" : "notif-item unread"
                          }
                          onClick={() => handleNotifItemClick(notif)}
                        >
                          
                          <span className="notif-text"> {notif.message}</span>{" "}
                          <span
                            className="remove-btn"
                            onClick={() => handleDeleteNotification(notif.id)}
                          >
                            remove
                          </span>
                          <span className="notif-time">({ moment(notif?.createdAt).fromNow()})</span>
                        </div>
                      ))}

                      {notifications.length === 0 && <span className="empty">No new notifications</span>}
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`nav-link-item ${
                  activeItem === "auth" ? "active" : ""
                } user-sub`}
              >
                <button onClick={() => handleItemClick("auth")}>
                  {" "}
                  <div className="auth-user">
                    <FaUserCircle className="icon" /> {authUser?.full_name}
                  </div>{" "}
                  <FaChevronDown className="icon ch" />{" "}
                </button>
                <div className="subnav-items-container">
                  <div className="sub-nav-items">
                    <li onClick={handleNavigate}>Profile</li>
                    <li onClick={handleLogout}>Logout</li>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="nav-link-item active">
              <Link to="/login">
                Sign In <CiLogin />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserNavbar;
