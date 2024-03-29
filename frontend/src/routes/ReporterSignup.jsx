import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Auth from './Auth'
import { useAuth } from '../store/AuthProvider/AuthProvider'
import { axiosInstance } from '../axios/axios'
import AuthLoader from '../components/preloaders/AuthLoader'
import { errorToast } from '../utils/toastMessage'
import { counties } from '../data/counties'
const ReporterSignup = () => {

  const [loading,setLoading] = useState(false);
  let from = useLocation().state?.from.pathname && useLocation().state?.from.pathname !== '/login' && useLocation().state?.from.pathname  !== '/reporter/register'   ? useLocation().state?.from : '/dashboard'

  const navigate = useNavigate()
  const [formData,setFormData] = useState({
    full_name:'',
    phone:'',  
    county:'',
    sub_county:'',
    ward:'',
    password:''
  })
  const [error,setError] = useState()
  const{setAuthUser,setAccessToken} = useAuth()


async function handleFormSubmit(e){
    e.preventDefault();

    try {
    setLoading(true)

    const response = await axiosInstance.post('/auth/reporter/signup', 
    {
      ...formData,
      county: formData?.county?.value,
      sub_county: formData?.sub_county?.value,
      ward: formData?.ward?.value
    }
    )
    setAuthUser(response.data.user)
    setAccessToken(response.data.access_token)

    localStorage.setItem('user', JSON.stringify(response.data.user))
    localStorage.setItem('access_token', JSON.stringify(response.data.access_token))
   
    navigate(from, {replace:true});
   
  }
    catch (error) {
   
      if(error?.response?.data?.errors){

        const errorsArray = error.response.data.errors;
        const errorObject = {};
        
        errorsArray.forEach((error) => {
          errorObject[error.path] = error.msg;
        });
  
        setError(errorObject); 
        window.scrollTo({top:0,left:0,behavior:'smooth'})

      }else{

        errorToast(error.response.data.message)

      }
      
    }finally{
      setLoading(false)
    }
  }


  const handleChange = (selectedOption, name) => {
    setFormData({ ...formData, [name]: selectedOption });
  };
 


  function changeHandler(e){
    setFormData({...formData, [e.target.name]:e.target.value})
  }


  useEffect(()=>{
   
    const authUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')):null
   
    if(authUser){
      from = !from? '/dashboard' : from
      navigate(from,{replace:true})
    }


  },[])
  return (
    <Auth>
          <form  onSubmit={handleFormSubmit}>
             
             <h1 className="auth-form-header">
            Incident Reporter | Signup
             </h1>
             <div className="form-group">
              <label htmlFor="full_name">Full Name <span className="required">*</span></label>
              <input type="text" name='full_name' onChange={changeHandler} value={formData.full_name} placeholder='e.g John Doe' className="form-control" />
              {error?.full_name && <span
                  className="vl-error"
                 
                >
                 {error?.full_name}
                </span>}
            
             </div>

             <div className="form-group">
              <label htmlFor="phone">Phone Number <span className="required">*</span></label>
              <input type="text" placeholder='e.g John Doe' onChange={changeHandler} value={formData.phone} name='phone' className="form-control" />
              {error?.phone && <span
                  className="vl-error"
                 
                >
                 {error?.phone}
                </span>}
            
             </div>

             <div className="form-group">
          <label htmlFor="county">
            County<span className="required">*</span>
          </label>
          <Select
            options={counties?.map((county) => ({
              label: county.county_name,
              value: county.county_name,
            }))}
            className="form-control"
            onChange={(selectedOption) =>
              handleChange(selectedOption, "county")
            }
          />
          {error?.county && <span className="vl-error">{error?.county}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="county">
            Sub Location<span className="required">*</span>
          </label>
          <Select
            options={counties
              .find((c) => c.county_name === formData.county?.value)
              ?.constituencies?.map((constituency) => ({
                label: constituency.constituency_name,
                value: constituency.constituency_name,
              }))}
            className="form-control"
            onChange={(selectedOption) =>
              handleChange(selectedOption, "sub_county")
            }
          />
          {error?.sub_county && (
            <span className="vl-error">{error?.sub_county}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="county">
            Ward<span className="required">*</span>
          </label>
          <Select
            options={counties
              .find((c) => c.county_name === formData?.county?.value)
              ?.constituencies?.find(
                (con) => con.constituency_name === formData?.sub_county?.value
              )
              ?.wards?.map((ward) => ({
                label: ward,
                value: ward,
              }))}
            className="form-control"
            onChange={(selectedOption) => handleChange(selectedOption, "ward")}
          />
          {error?.ward && <span className="vl-error">{error?.ward}</span>}
        </div>

             <div className="form-group">
              <label htmlFor="password">Password 
              <span className="required">*</span></label>
              <input type="password" name='password' onChange={changeHandler} value={formData.password} className="form-control" />
              {error?.password && <span
                  className="vl-error"
                  id="first_name_error"
                >
                 {error?.password}
                </span>}
            
             </div>
           { !loading ? <button>Sign Up</button> :<AuthLoader/>
}
             <h1 className='login-redirect'>Already have an account <Link to={'/login'}>Login</Link></h1>
          </form>
          </Auth>
  )
}

export default ReporterSignup