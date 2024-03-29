import { useContext, useEffect, useState } from 'react'
import Auth from './Auth'
import { Link, useNavigate,useLocation } from 'react-router-dom'
import { useAuth } from '../store/AuthProvider/AuthProvider';
import AuthLoader from '../components/preloaders/AuthLoader';
import { errorToast, successToast } from '../utils/toastMessage';
import { axiosInstance } from '../axios/axios';
import { SocketContext } from '../store/AuthProvider/SocketProvider';

const Login = () => {

  const [loading,setLoading] = useState(false);
  const [formData,setFormData] = useState({
    emailOrPhone:'',
    password:''
  })
  const {socket} = useContext(SocketContext)
  const location = useLocation();


  let from = location.state?.from?.pathname !== '/regiser'  ? location.state?.from?.pathname : null
  

  const navigate= useNavigate();

  const {setAccessToken, setAuthUser} = useAuth();


  async function handleFormSubmit(e){
    e.preventDefault();
    if(!formData.emailOrPhone || !formData.password){
      errorToast("All fields are required")
      return
    }
    try {
      setLoading(true)
    
    const response = await axiosInstance.post('/auth/login', formData)

    const {data} = response
    setAuthUser(data.user)
    setAccessToken(data.access_token)

    localStorage.setItem('user', JSON.stringify(data.user))

    localStorage.setItem('access_token', JSON.stringify(data.access_token))
   
   
    if(!from){
      if(data.user.roles.map(role=>role.name).includes('system-admin')){
        from = '/admin/dashboard'
      }
     else if(data.user.roles.map(role=>role.name).includes('county-admin')){
        from = '/admin/dashboard'
      }
      
      else if(data.user.roles.map(role=>role.name).includes('sub-admin') ){
        from = '/admin/dashboard'

      }else if(data.user.roles.map(role=>role.name).includes('ward-admin')){
        from = '/admin/dashboard'
      }else{
        from = '/dashboard'
      }
    }
      successToast("Login Successful")
      navigate(from ,{replace:true});

      // else if(authUser?.roles?.map(role=>role.name).includes('user')){
      //   socket.emit('user_join', {user})

      // }

    } catch (error) {
      errorToast(error?.response?.data?.message || "Something went wrong")
    }finally{
      setLoading(false)
    }
  }

  function changeHandler(e){
    setFormData({...formData, [e.target.name]:e.target.value})
  }


  useEffect(()=>{
    const authUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')):null
 if(authUser){
       console.log(from);
       from = !from? authUser?.roles?.map(role=>role.name).some(roleName => ["county-admin",'sub-admin','ward-admin'].includes(roleName)) ? '/admin/dashboard' :'/dashboard' : from
       navigate(from,{replace:true})
     }
 
   },[])

  return (
   <Auth>
     <form onSubmit={handleFormSubmit}>
             
             <h1 className="auth-form-header">
            Login
             </h1>
            

             <div className="form-group">
              <label htmlFor="">Email or Phone </label>
              <input type="text" placeholder='e.g johndoe@gmail.com or 0700000000' name='emailOrPhone' value={formData.emailOrPhone} onChange={changeHandler} className="form-control" />
             </div>

             <div className="form-group">
              <label htmlFor="">Password </label>
              <input type="password" onChange={changeHandler} value={formData.password} name='password'  className="form-control" />
             </div>

           

             {!loading ? <button>Login</button>:<AuthLoader/>}

             <h1 className='login-redirect'>Don't have an account <Link to={'/register/reporter/authority'}>Signup</Link></h1>
          </form>
   </Auth>  )
}

export default Login