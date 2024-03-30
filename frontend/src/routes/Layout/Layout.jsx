import './layout.css'
import Sidebar from '../../components/sidebar/Sidebar'
import AdminNav from '../../components/AdminNav/AdminNav'
import { useLocation } from 'react-router-dom'
import { useContext, useEffect } from "react"
import { useAuth } from "../../store/AuthProvider/AuthProvider"
import { SocketContext } from "../../store/AuthProvider/SocketProvider"


const Layout = ({children}) => {
  const location =  useLocation().pathname
  const {authUser} = useAuth()
  const {socket} = useContext(SocketContext)

  useEffect(()=>{
    if(authUser){
        socket.emit('agent_join', {...authUser})
      }
},[authUser])
  return (
    <div className='main'>
      <Sidebar/>
      <div className="main-content">
        <AdminNav/>
        <div class='breadcrump pt-4 px-6'>
    <div>
      
        {location !== "/admin/dashboard"  && location !== "/admin/incident/map"  &&  <h1 class='breadcrump-title'> 
        {
        location.replace('/','').split('/').map((el,idx,arr) =>idx !== arr.length - 1 ? `${el} - `: el).map((el,idx)=>(<span key={idx}>{el}</span>))
      }
        </h1>}
        
    </div>
</div>
        {children}
      </div>
    </div>
  )
}

export default Layout