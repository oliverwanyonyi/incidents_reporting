import './submenu.css'
import  { useEffect, useState, useRef } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { twMerge } from 'tailwind-merge';

const ActionSubmenu =({children,index})=>{

const [submenuOpen, setSubmenuOpen] = useState(false);
const [currentSubmenuIndex, setCurrentSubmenuIndex] = useState(null); // Track the currently open submenu index
const [submenuPositions, setSubmenuPositions] = useState([]); // Keep track of submenu positions for multiple rows
const viewActionsButtonRef = useRef(null);
const submenuRef = useRef(null);

// Function to position the submenu
const positionSubmenu = () => {
  const btnRect = viewActionsButtonRef.current.getBoundingClientRect();
  const btnBottom = btnRect.bottom;
  const viewportHeight = window.innerHeight;
  const actionsSubmenu = submenuRef.current;

 
  // Check if the submenu exceeds the viewport height
  if (btnBottom + actionsSubmenu.offsetHeight > viewportHeight) {
    
    actionsSubmenu.style.bottom = '20%';
    actionsSubmenu.style.top = 'auto';
  } else {
    actionsSubmenu.style.bottom = 'auto';
    actionsSubmenu.style.top = btnBottom + 10 + 'px';
  }

  actionsSubmenu.style.left = btnRect.left + 'px';

  // Update the submenu position in the state
  setSubmenuPositions({ top: actionsSubmenu.style.top, left: actionsSubmenu.style.left });
};

// Function to handle submenu toggle
const handleToggleSubmenu = (event) => {
    event.preventDefault();

    if (currentSubmenuIndex === index) {
      // Clicked on the currently open submenu button, so close it
      setCurrentSubmenuIndex(null);
    } else {
      // Clicked on a different button, open its submenu
      setCurrentSubmenuIndex(index);
      positionSubmenu();
    }
};
    

// Effect to handle click outside to close submenu
useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      currentSubmenuIndex !== null &&
      !viewActionsButtonRef.current.contains(event.target) &&
      !submenuRef.current.contains(event.target)
    ) {
      // Clicked outside the currently opened submenu
      setSubmenuOpen(false);
      setCurrentSubmenuIndex(null);
    }
  };

  document.addEventListener('click', handleClickOutside);
  return () => document.removeEventListener('click', handleClickOutside);
}, [currentSubmenuIndex]);

 

    // Function to debounce the scroll event
   function debounce (func, delay) {
        let timerId;
        return (...args) => {
          if (timerId) {
            clearTimeout(timerId);
          }
          timerId = setTimeout(() => {
            func(...args);
          }, delay);
        };
      };
    
    // Function to handle scroll with debounce
  const handleScroll = () => {
    if (currentSubmenuIndex !== null) {
      positionSubmenu();
    }
  };

  // Debounced scroll event listener
  useEffect(() => {
    const debounceScroll = debounce(handleScroll, 100);
    window.addEventListener('scroll', debounceScroll);
    return () => {
      window.removeEventListener('scroll', debounceScroll);
    };
  }, [currentSubmenuIndex]);

      // Function to handle window resize with debounce
  const handleResize = () => {
    if (currentSubmenuIndex !== null) {
      positionSubmenu();
    }
  };

  // Debounced window resize event listener
  useEffect(() => {
    const debounceResize = debounce(handleResize, 100);
    window.addEventListener('resize', debounceResize);
    return () => {
      window.removeEventListener('resize', debounceResize);
    };
  }, [currentSubmenuIndex]);
  return (
    <div className="relative">
          <a
            href="#"
            ref={viewActionsButtonRef}
            className="actions-btn hover:bg-gray-300"
            onClick={handleToggleSubmenu}
          >
            View Actions
            <FiChevronDown className="action-icon fas fa-chevron-down" />
          </a>
          <ul
            ref={submenuRef}
            style={{ top: submenuPositions.top, left: submenuPositions.left }}
            className={twMerge(
              'actions-submenu',
              currentSubmenuIndex === index ? 'block' : 'hidden'
            )}
            id={`actions-submenu-${index}`}
          >
            {children}
          </ul>
        </div>
  );
};

export default ActionSubmenu;
