// SidebarItem.js
import './sidebaritem.css';
import { useState, useRef, useEffect, useCallback } from 'react';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

const SidebarItem = ({
  Icon,
  title,
  onToggleOpen,
  isOpen,
  children
}) => {
  const subMenuRef = useRef(null);
  const [subMenuHeight, setSubMenuHeight] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setSubMenuHeight(subMenuRef.current.scrollHeight);
    } else {
      setSubMenuHeight(0);
    }
  }, [isOpen]);

  const handleToggleOpen = useCallback(() => {
    onToggleOpen(title);
  }, [onToggleOpen, title]);

  return (
    <li className="sidebar-item">
      <div className="sidebar-link-wrapper"  onClick={handleToggleOpen}>
        <Link
          to='#'
          className={twMerge("sidebar-link", isOpen && 'active')}
        >
          <Icon/>
          <span className="link-title">{title}</span> 
        </Link>
        {isOpen ? (
          <BsChevronUp className="fas fa-chevron-up sidebar-icon arrow" />
        ) : (
          <BsChevronDown className="fas fa-chevron-down sidebar-icon arrow" />
        )}
      </div>
      <ul
        className="sub-menu"
        style={{ maxHeight: `${subMenuHeight}px`, overflow: 'hidden', transition: 'max-height 0.3s ease-out' }}
        ref={subMenuRef}
      >
        {children}
      </ul>
    </li>
  );
};

export default SidebarItem;
