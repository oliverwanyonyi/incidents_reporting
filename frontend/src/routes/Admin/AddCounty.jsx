
import { useState } from 'react';
import {FaPlus} from 'react-icons/fa'
import { errorToast, successToast } from '../../utils/toastMessage';
import { axiosInstance } from '../../axios/axios';
import AuthLoader from '../../components/preloaders/AuthLoader';
import { useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
const AddCounty = () => {
  const [ counties,setCounties] = useState([{name:'',code:''}])
  const [loading,setLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate()
  const navigate = useNavigate()
  function handleAddRow(){
    if(counties.length === 5){
      errorToast("You can only submit 5 inputs at a time")
      return
    }
  setCounties([...counties,{name:'', code:''}])
  }

  function changeHandler (index,key,value){
   
   const updatedCounties = [...counties]

   updatedCounties[index][key] = value
   setCounties(updatedCounties)
  }

  async function submitHandler(e){
    e.preventDefault()

    try {
      
      setLoading(true)
      const{ data} = await axiosPrivate.post('/counties/create', {counties})

      successToast(data)

      navigate('/admin/counties/all')
    } catch (error) {
     errorToast(error?.response?.data?.message)
     console.log(error);
    }finally{
      setLoading(false)
    }
  }
  return (
    <div className="main-list">
        <div className="main-list-container">
            <form className="form" onSubmit={submitHandler}>
                <div className="form-wrapper">
                    <h1 className="form-header">
                    County Information
                    </h1>

                   {counties.map((county,index)=>(
                    <div className={!(index === counties.length - 1) ? "grid form-grid":"grid"} key={index}>
                      <div className="form-group">
                    <label className="form-label"> Name</label>
                    <input type="text" value={county.name} onChange={(e)=>changeHandler(index,'name',e.target.value)} className="form-control" />
                  </div>
                  <div className="form-group">
                    <label className="form-label"> Code</label>
                    <input type="text" value={county.code} onChange={(e)=>changeHandler(index,'code',e.target.value)} className="form-control" />
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
  )
}

export default AddCounty