// Sidebar.js
import { Link, useNavigate } from 'react-router-dom';
import './sidebar.css';
import { useEffect, useState, useCallback, useMemo } from 'react';
import SidebarItem from '../SidebarItem/SidebarItem';
import { data } from '../../data/sidebar_items';
import { useAuth } from '../../store/AuthProvider/AuthProvider';

const Sidebar = () => {
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [innerWidth, setInnerWidth] = useState(0);
  const { authUser } = useAuth();
  const navigate = useNavigate();

  const filtered_data = useMemo(() => {
    return data.filter((item) => {
      if (!item.roles || item.roles.length === 0) {
        return true;
      }
      return item.roles.some((role) =>
        authUser?.roles?.map((role) => role.name).includes(role)
      );
    });
  }, [authUser]);

  const handleToggleOpen = useCallback((title) => {
    setOpenSubMenu((prevTitle) => (prevTitle === title ? null : title));
  }, []);

  const navigateHandler = useCallback((e) => {
    e.stopPropagation();
  }, []);

  useEffect(() => {
    const resizeHandler = () => {
      setInnerWidth(window.innerWidth);
    };

    window.addEventListener('resize', resizeHandler);

    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, []);

  return (
    <div className='sidebar'>
      <div className='sidebar-header'>
        <Link to='/admin/dashboard' className='sidebar-brand'>
          SafetyFast
        </Link>
      </div>
      <div className='sidebar-center'>
        <ul className='sidebar-links'>
          {filtered_data?.map((item) => (
            <SidebarItem
              key={item.title}
              title={item.title}
              Icon={item.Icon}
              isOpen={openSubMenu === item.title}
              onToggleOpen={handleToggleOpen}
            >
              {item.children &&
                item.children.map((childItem) => (
                  <li key={childItem.title}>
                    <Link
                      to={childItem.link}
                      onClick={navigateHandler}
                      className='submenu-link'
                    >
                      {childItem.title}
                    </Link>
                  </li>
                ))}
            </SidebarItem>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
