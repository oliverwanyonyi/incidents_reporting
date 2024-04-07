
import { useState } from 'react';
import AuthLoader from '../../../components/preloaders/AuthLoader';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../../axios/axios';
import { errorToast, successToast } from '../../../utils/toastMessage';
import { FaPlus } from 'react-icons/fa';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import { Helmet } from 'react-helmet-async';

const AddRole = () => {
    const [ roles,setRoles] = useState([{name:''}])
    const [loading,setLoading] = useState(false);
    const axiosPrivate = useAxiosPrivate()
    const navigate = useNavigate()
    function handleAddRow(){
      if(roles.length === 4){
        errorToast("You can only submit 5 inputs at a time")
        return
      }
    setRoles([...roles,{name:''}])
    }
  
    function changeHandler (index,key,value){
     
     const updatedRoles = [...roles]
  
     updatedRoles[index][key] = value
     setRoles(updatedRoles)
    }
  
    async function submitHandler(e){
      e.preventDefault()
  
      try {
        
        setLoading(true)
        const{ data} = await axiosPrivate.post('/roles/add', {roles})
  
        successToast(data)
  
        navigate(`/admin/roles`)
      } catch (error) {
       errorToast(error?.response?.data?.message)
       
      }finally{
        setLoading(false)
      }
    }

  return (
    <>
    <Helmet>
      <title>Admin | Add Role</title>
    </Helmet>
    <div className="main-list">
    <div className="main-list-container">
        <form className="form" onSubmit={submitHandler}>
            <div className="form-wrapper">
                <h1 className="form-header">
              Role Information
                </h1>

               {roles.map((role,index)=>(
                <div className={!(index === roles.length - 1) ? "form-grid":""} key={index}>
                  <div className="form-group">
                <label className="form-label"> Name</label>
                <input type="text" value={role.name} onChange={(e)=>changeHandler(index,'name',e.target.value)} className="form-control" />
              </div>
            
            
              </div>
               )) }
                
              {!loading ? <div className="button-group">
               <button type="submit">Submit</button>
               <button type="button" onClick={handleAddRow}> Add row <FaPlus/></button>
                
                </div>: <AuthLoader/>} 
            </div>
        </form>
    </div>
</div>
</>
  )
}

export default AddRole