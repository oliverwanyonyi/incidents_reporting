import { useEffect, useState } from "react"
import { useAuth } from "../../../store/AuthProvider/AuthProvider"
import { Helmet } from "react-helmet-async"


const Profile = () => {

    const [error,setError] = useState()
    const [loading,setLoading] = useState(false)
    const [formData,setFormData] = useState({
        full_name:'',
        email:'',
        phone:''
    })
    const {authUser} = useAuth()

    function submitHandler(){

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
    <>
    <Helmet>
      <title>Admin | Profile</title>
    </Helmet>
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
                <label className="form-label" id="email"> Email</label>
                <input
                  type="text"
                  value={formData?.email}
                  onChange={(e) => changeHandler( "email", e.target.value)}
                  className="form-control"
                />
                 {error?.email && <span className="vl-error">{error?.email}</span>}
        
              </div>
              <div className="form-group">
                <label className="form-label"> Position</label>
                <input
                  type="text"
                 value={authUser?.position}
                  disabled
                  className="form-control"
                />
                 {error?.position && (
            <span className="vl-error">{error?.position}</span>
          )}
              </div>
              <div className="form-group">
                <label className="form-label" name="designation"> Designation</label>
                <input
                  type="text" 
                  value={authUser?.designation}
                  disabled
                  className="form-control"
                />
                {error?.designation && (
            <span className="vl-error">{error?.designation}</span>
          )}
              </div>
            
              <div className="form-group">
                <label className="form-label"> County</label>
                <input
                  type="text"
                value={authUser?.countyDetails?.name}
                  disabled
                  className="form-control"
                />
                
              </div>

              <div className="form-group">
                <label className="form-label" id="sub_county"> SubCounty</label>
                <input
                  type="text"
                value={authUser?.subDetails?.name?  authUser?.subDetails?.name: 'N/A'}
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
                value={authUser?.wardDetails?.name? authUser?.wardDetails?.name:'N/A'}
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
    </>
  )
}

export default Profile