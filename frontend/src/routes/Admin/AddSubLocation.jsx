import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import AuthLoader from '../../components/preloaders/AuthLoader';
import { errorToast, successToast } from "../../utils/toastMessage";
import { axiosInstance } from "../../axios/axios";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";


const AddSubLocation = () => {

    const [ locations,setLocations] = useState([{name:''}])
    const [loading,setLoading] = useState(false);
    const axiosPrivate = useAxiosPrivate()
    const {countyId} = useParams()
    const navigate = useNavigate()
    function handleAddRow(){
      if(locations.length === 5){
        errorToast("You can only submit 5 inputs at a time")
        return
      }
    setLocations([...locations,{name:''}])
    }
  
    function changeHandler (index,key,value){
     
     const updatedCounties = [...locations]
  
     updatedCounties[index][key] = value
     setLocations(updatedCounties)
    }
  
    async function submitHandler(e){
      e.preventDefault()
  
      try {
        
        setLoading(true)
        const{ data} = await axiosPrivate.post('/counties/sub/create', {county_id:countyId,locations})
  
        successToast(data)
  
        navigate(`/admin/${countyId}/sublocations`)
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
               Sublocation Information
                </h1>

               {locations.map((county,index)=>(
                <div className={!(index === locations.length - 1) ? "form-grid":""} key={index}>
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

export default AddSubLocation