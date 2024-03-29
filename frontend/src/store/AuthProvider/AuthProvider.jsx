import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";



const AuthContext = createContext()


const AuthProvider = ({children}) =>{

    const [authUser,setAuthUser] = useState(JSON.parse(localStorage.getItem('user'))||null)
    const [accessToken,setAccessToken] = useState(localStorage.getItem('access_token')||null)
    const [modalOpen,setModalOpen] = useState(false);

    function openModal(){
 setModalOpen(true)
    }
    function closeModal(){
        setModalOpen(false)
    }
    const navigate = useNavigate()
    function logout(){
        localStorage.removeItem('user')
        localStorage.removeItem('access_token')
        setAccessToken(null)
        setAuthUser(null)
        navigate('/login')
    }

  
    return(<AuthContext.Provider  value={{authUser,accessToken,setAccessToken,setAuthUser,logout, modalOpen,setModalOpen,openModal,closeModal}}>{children}</AuthContext.Provider>)
}

export const useAuth = () => useContext(AuthContext)

export default AuthProvider