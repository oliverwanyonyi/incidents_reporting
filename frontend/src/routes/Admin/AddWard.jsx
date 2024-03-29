import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import AuthLoader from '../../components/preloaders/AuthLoader';
import { errorToast, successToast } from "../../utils/toastMessage";
import { axiosInstance } from "../../axios/axios";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";


const AddWard = () => {

    const [ wards,setWards] = useState([{name:''}])
    const [loading,setLoading] = useState(false);
    const {locationId} = useParams()
    const navigate = useNavigate()
    const axiosPrivate = useAxiosPrivate()
    function handleAddRow(){
      if(wards.length === 5){
        errorToast("You can only submit 5 inputs at a time")
        return
      }
    setWards([...wards,{name:''}])
    }
  
    function changeHandler (index,key,value){
     
     const updatedCounties = [...wards]
  
     updatedCounties[index][key] = value
     setWards(updatedCounties)
    }
  
    async function submitHandler(e){
      e.preventDefault()
  
      try {
        
        setLoading(true)
        const{ data} = await axiosPrivate.post('/counties/sub/ward/create', {location_id:locationId,wards})
  
        successToast(data)
  
        navigate(`/admin/${locationId}/wards`)
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
               Ward Information
                </h1>

               {wards.map((county,index)=>(
                <div className={!(index === wards.length - 1) ? "form-grid":""} key={index}>
                  <div className="form-group">
                <label className="form-label"> Name</label>
                <input type="text" value={county.name} onChange={(e)=>changeHandler(index,'name',e.target.value)} className="form-control" />
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

export default AddWard