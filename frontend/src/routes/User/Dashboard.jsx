

const Dashboard = () => {
  return (
    <div className="user-dashboard">
         <h1 className="user" >
        Good morning<span > Oliver Wanyonyi </span> 
          </h1>
          <div className="analytics-container">
            <div className="analytics-wrapper">
              <div className="analytics-item">
                <h1 className="analytics-title">Incidents Reported</h1>
                <span className="items-total">10</span>
              </div>

              <div className="analytics-item">
                <h1 className="analytics-title">Incidents Resolved</h1>
                <span className="items-total">3</span>
              </div>

              <div className="analytics-item">
                <h1 className="analytics-title">Under Investigation</h1>
                <span className="items-total">3</span>
              </div>
            </div>
          </div>
    </div>
  )
}

export default Dashboard