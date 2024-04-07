import React from 'react'
import Auth from './Auth'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

const AuthorityReporter = () => {
    const navigate = useNavigate()

    function handleNavigate(to){
            navigate(to);
    }
  return (
    <>
    <Helmet>
     <title>Safety First | Auth</title>
   </Helmet>
    <Auth>
        <div className="auth-guide">

        <div className="text-conteiner">
        <h2 className="header">Ward Authority</h2>
        <button onClick={()=>handleNavigate('/authority/register')}>Sign Up Here</button>
        </div>
        <div className="divider">Or</div>
       <div className="text-container">
       <h2>Incident reporter </h2>

<button onClick={()=>handleNavigate('/reporter/register')}> Sign Up Here</button>
       </div>
       </div>
        
    </Auth>
    </>
  )
}

export default AuthorityReporter