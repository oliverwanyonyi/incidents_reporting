import React from 'react'

const Auth = ({children}) => {
  return (
    <div className='auth'>
    <div className="auth-container">

      <div className="auth-form">
      {children}
        </div>

      

        </div>

    </div>
  )
}

export default Auth