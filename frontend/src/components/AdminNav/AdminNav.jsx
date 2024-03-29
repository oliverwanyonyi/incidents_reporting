import { useContext, useEffect, useState } from "react";
import "./admin-nav.css";
import { FaBars, FaRegUser } from "react-icons/fa";
import { FaRegBell, FaChevronDown } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../store/AuthProvider/AuthProvider";
import { SocketContext } from "../../store/AuthProvider/SocketProvider";

const AdminNav = () => {
  const [activeItem, setActiveItem] = useState(null);
  const {notifications, updateNotification} = useContext(SocketContext)
  const { setAuthUser, authUser } = useAuth();
  const navigate = useNavigate();

  const handleItemClick = (itemName) => {
    setActiveItem(activeItem === itemName ? null : itemName);
  };

  const handleDocumentClick = (event) => {
    const navItems = document.querySelectorAll(".nav-link-item");

    if (!Array.from(navItems).some((item) => item.contains(event.target))) {
      // Click occurred outside the navigation items
      setActiveItem(null);
    }
  };

function handleNavigate(link){
  navigate(link)
}


function handleNotifItemClick(notif){
  updateNotification(notif)
}

  function handleLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setAuthUser(null);

    navigate("/login");
  }

  useEffect(() => {
    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  return (
    <div className="admin-nav">
      <div className="nav-container">
        <div className="nav-left">
          <FaBars className="sidebar-toggler-icon" />
        </div>
        <div className="nav-right">
          <div
            className={`nav-link-item ${activeItem === "bell" ? "active" : ""}`}
          >
            <div className="notify-container">
              <div className="notif-icon">
              <FaRegBell
                className="bell"
                onClick={() => handleItemClick("bell")}
              />

<div className="notif-count">{notifications?.filter(notif=>notif.read !== true).length}</div>
             </div>
            
              <div className="subnav-items-container">
                <div className="notification-container">
                  <div className="notif-header">Notifications</div>
                  <div className="notifs_body">
                  {notifications.map(notif=>(
 <div className={notif.read?"notif-item": "notif-item unread"} onClick={()=> handleNotifItemClick(notif)}>
  {notif.message}
</div>
                  ))}
                  </div>
                
                </div>
              </div>
            </div>
          </div>
          <div
            className={`nav-link-item ${
              activeItem === "auth" ? "active" : ""
            } user-sub`}
          >
            <button
              className="auth-user"
              onClick={() => handleItemClick("auth")}
            >
              <div className="icon">
                <FaRegUser />
              </div>
              <div className="text-highlight">
                Hello <span>{authUser?.full_name} !</span> <FaChevronDown />
              </div>
            </button>
            <div className="subnav-items-container">
              <div className="sub-nav-items">
                <div className="info-sec">
                  <div>
                    <p>
                      Welcome back <b>{authUser?.full_name} !</b>{" "}
                    </p>
                  </div>
                  <div>
                 
                  </div>
                  {authUser?.roles?.map(role=>role.name).includes('system-admin') ? null :
                  <>
                  {/* <div>
                      <b>County:</b> ({authUser?.county})
                    </div> */}
                    <div>
                      <b>Sub County:</b> ({authUser?.sub_county})
                    </div>
                 
                    
                      <div>
                        <b>Ward :</b> ({authUser?.ward})
                      </div>
                      </>
}
                  
                   <div>
                        <b>Role :</b> ({authUser?.roles[0]?.name.replace('-',' ')})
                      </div>
   
                </div>

                <li onClick={()=>handleNavigate('/admin/profile')}>Profile</li>
                <li onClick={handleLogout}>Logout</li>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNav;
