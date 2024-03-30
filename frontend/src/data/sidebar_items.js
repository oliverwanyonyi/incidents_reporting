import { BiSolidDashboard } from "react-icons/bi";
import {  BsGear } from "react-icons/bs";
import { MdOutlineAdminPanelSettings, MdCall, MdChat } from "react-icons/md";
import { PiUserListFill } from "react-icons/pi";

  import {  
  FiAlertTriangle,

  } from 'react-icons/fi'
export const data = [
  {
    title: "Dashboard",
    Icon: BiSolidDashboard,
    children: [
      { title: "Analytics", link: "/admin/dashboard" },
    ]
  },
 
 
  {
    title: "Ward Authorities",
    Icon:  MdOutlineAdminPanelSettings ,
    children: [
      { title: "View Authorities", link: "/admin/ward-authority/all" },
      { title: "Add Authorities", link: "/admin/ward-authority/add" },
    ],
    roles:['ward-admin']
  },
  {
    title: "Incidents Management",
    Icon: FiAlertTriangle ,
    children: [
      { title: "Reported Incidents", link: "/admin/incident/all" },
      { title: "Map", link: "/admin/incident/map" },
    ],
    roles:['ward-admin', 'ward-officer',]
  },

  {title:"Manage Chats",Icon:MdChat, children:[{title :"Chat", link:'/admin/chat'}], roles:['ward-admin', 'ward-officer'] },

  {
    title: "Authority",
    Icon:PiUserListFill,
    children: [
      { title: "Authority List", link: "/admin/authority/list" },
      
    ],
    roles:['system-admin']
  },
  {
    title: "Configurations and Setup",
    Icon: BsGear,
    children: [
      { title: "Create Role", link: "/admin/roles/add" },
      { title: "View Roles", link: "/admin/roles" },
    ],
    roles:['system-admin']
  },
 
];
