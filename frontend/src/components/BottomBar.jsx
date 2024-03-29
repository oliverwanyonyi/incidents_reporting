import '../css/style.css'
import { Link, useLocation } from 'react-router-dom'; 
import {FaMapMarked, } from 'react-icons/fa'
import { sidebarItems } from './UserSidebar/UserSidebar';
import { useAuth } from '../store/AuthProvider/AuthProvider';

const BottomBar = () => {
    const location = useLocation();
    const currentPath = location.pathname;
    const {authUser} = useAuth()
    
    const filteredItems = sidebarItems.filter((item) =>
    authUser ? item.auth !== false : item.auth !== true
  );

    const getActivePath = (path) => {
        return path === currentPath ? "active" : "";
      };
  return (
    <div className="bottom-bar">

{filteredItems.map((item, idx) => (
            
              <Link to={item.path}  key={idx} className={`bottom-bar-item ${getActivePath(item.path)}`}>
                <item.Icon className="icon" /> <span>{item.title}</span>
              </Link>
          ))}

<Link to='/incident/map' className={`bottom-bar-item ${getActivePath('/incident/map')}`}>
                <FaMapMarked className="icon" /> <span>Map</span>
              </Link>


    </div>
  );
};

export default BottomBar;
