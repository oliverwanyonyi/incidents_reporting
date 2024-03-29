import './user_layout.css'
import UserSidebar from '../../components/UserSidebar/UserSidebar'
import UserNavbar from '../../components/UserNavbar/UserNavbar'
import { useContext, useEffect } from 'react'
import { useAuth } from '../../store/AuthProvider/AuthProvider'
import { SocketContext } from '../../store/AuthProvider/SocketProvider'
import BottomBar from '../../components/BottomBar'

const UserLayout = ({children}) => {
  const {authUser} = useAuth()
  const {socket} = useContext(SocketContext)
  useEffect(()=>{
    if(authUser){
      socket.emit("user_join", { ...authUser });
    }
  }, [authUser])
  return (
    <div>
        <div className="user-main">
            <div className="container">
              <UserSidebar/>
              <div className="user-main-content">
                <UserNavbar/>
                {children}</div>
            </div>
            <BottomBar/>
        </div>

    </div>
  )
}

export default UserLayout