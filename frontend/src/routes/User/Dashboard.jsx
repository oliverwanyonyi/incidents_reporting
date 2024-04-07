import { FiAlertTriangle } from "react-icons/fi"
import PieChart from "../../components/chart/PieChart"
import { GoAlertFill } from "react-icons/go"
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useAuth } from "../../store/AuthProvider/AuthProvider";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";


const Dashboard = () => {


  const [loading, setLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const {authUser} = useAuth()
  const [data, setData] = useState();

  useEffect(() => {
    async function getAnalyticsData() {
      setLoading(true);
      const response = await axiosPrivate.get("/analytics/user");
      setData(response.data);
      setLoading(false);
    }

    getAnalyticsData();
  }, []);
  return (
    <>
    <Helmet>
      <title>Safety First | Dashboard</title>
    </Helmet>
    <div className="user-dashboard">
         <h1 className="user welcome-text" >
        Good morning<span > {authUser?.full_name} </span> 
          </h1>
          <div className="analytics-container">
          <div className="analytics-wrapper">




<div className="analytics-item">
              <div className="analytic-details">
                <h3>Incidents</h3>
                <p>{data?.totalIncidents || 0}</p>
              </div>
              <div className="analytics-icon">
              <GoAlertFill /> 
              </div>
            </div>       
          </div>
        <div className="analytics-wrapper">
          <PieChart data={data?.incidentTypes} title="Incident" />
          <PieChart data={data?.incidentStatuses} title="Status" />
          </div>
 </div>
 </div>
 </>
  )
}

export default Dashboard