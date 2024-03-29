import { useEffect, useState } from "react"
import { useAuth } from "../store/AuthProvider/AuthProvider"
import useAxiosPrivate from "../hooks/useAxiosPrivate"



const Profile = () => {

    const [error,setError] = useState()
    const [loading,setLoading] = useState(false)
    const [formData,setFormData] = useState({
        full_name:'',
        email:'',
        phone:''
    })
    const axiosPrivate = useAxiosPrivate()
    const {authUser} = useAuth()

  async  function submitHandler(){

      const {data} = await axiosPrivate.put('/auth/profile/update', formData)

      
    }
    function changeHandler(key, value) {
        
        setFormData({...formData, [key]:value})
        
      }

      useEffect(()=>{
        if(authUser){
            setFormData({...formData, full_name:authUser?.full_name,email:authUser?.email,phone:authUser?.phone})
        }
      },[])

  return (
    <div className="main-list">
      <div className="main-list-container">
        <form className="form" onSubmit={submitHandler}>
          <div className="form-wrapper">
            <h1 className="form-header">My Profile Information</h1>

            <div className={"grid form-grid"}>
              <div className="form-group">
                <label className="form-label" id="full_name"> Name</label>
                <input
                  type="text"
                  value={formData?.full_name}
                  onChange={(e) => changeHandler( "full_name", e.target.value)}
                  className="form-control"
                />
                  {error?.full_name && (
            <span className="vl-error">{error?.full_name}</span>
          )}
              </div>
              <div className="form-group">
                <label className="form-label" id="phone"> Phone</label>
                <input
                  type="tel"
                  value={formData?.phone}
                  onChange={(e) => changeHandler( "phone", e.target.value)}
                  className="form-control"
                />
                  {error?.phone && <span className="vl-error">{error?.phone}</span>}
       
              </div>
            
              <div className="form-group">
                <label className="form-label"> County</label>
                <input
                  type="text"
                value={authUser?.county}
                  disabled
                  className="form-control"
                />
                
              </div>

              <div className="form-group">
                <label className="form-label" id="sub_county"> SubCounty</label>
                <input
                  type="text"
                value={authUser?.sub_county?  authUser?.sub_county: 'N/A'}
                  disabled
                  className="form-control"
                />
                 {error?.sub_county && (
            <span className="vl-error">{error?.sub_county}</span>
          )}
              </div>
             
              <div className="form-group">
                <label className="form-label" > Ward</label>
                <input
                  type="text"
                value={authUser?.ward? authUser?.ward:'N/A'}
                  disabled
                  className="form-control"
                />
                
              </div>
            </div>

            {!loading ? (
              <div className="button-group">
                <button type="submit">Update Profile </button>
              </div>
            ) : (
              <AuthLoader />
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default Profile