import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import PieChart from '../../components/chart/PieChart'
import { FaRegUser } from "react-icons/fa6";
import { FaUser } from "react-icons/fa6";
import { GoAlertFill } from "react-icons/go";
import { FiAlertTriangle } from "react-icons/fi";
import { useAuth } from "../../store/AuthProvider/AuthProvider";
import { FaUsers } from "react-icons/fa";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const {authUser} = useAuth()
  const [data, setData] = useState();

  useEffect(() => {
    async function getAnalyticsData() {
      setLoading(true);
      const response = await axiosPrivate.get("/analytics/admin");
      setData(response.data);
      setLoading(false);
    }

    getAnalyticsData();
  }, []);

  return (
    <div className="main-list">
      {!loading ? (
        <>
        <div className="analytics-container">
          <div className="analytics-wrapper">
            {
authUser?.roles?.some(role => ['system-admin'].includes(role.name)) ?
<>
<div className="analytics-item">
<div className="analytic-details">
  <h3>Users</h3>
  <p>{data?.totalUsers || 0}</p>
</div>
<div className="analytics-icon">
<FaRegUser /> 
</div>
</div>

<div className="analytics-item">
<div className="analytic-details">
  <h3>Active Users</h3>
  <p>{data?.totalActiveUsers || 0}</p>
</div>
<div className="analytics-icon">
<FaUser /> 
</div>
</div>
</>

:authUser?.roles?.some(role => ['ward-admin',].includes(role.name))?

<>
<div className="analytics-item">
              <div className="analytic-details">
                <h3>Incidents</h3>
                <p>{data?.totalIncidents || 0}</p>
              </div>
              <div className="analytics-icon">
              <GoAlertFill /> 
              </div>
            </div>

            <div className="analytics-item">
              <div className="analytic-details">
                <h3>Anonymous Incdents</h3>
                <p>{data?.anonymous || 0}</p>
              </div>
              <div className="analytics-icon">
              <FiAlertTriangle /> 
              </div>
            </div>


<div className="analytics-item">
<div className="analytic-details">
  <h3>Ward Authorities</h3>
  <p>{data?.totalWardOfficers || 0}</p>
</div>
<div className="analytics-icon">
<FaUsers /> 
</div>
</div>
</>:

authUser?.roles?.some(role => ['ward-admin','ward-officer'].includes(role.name)) ?
<>

<div className="analytics-item">
              <div className="analytic-details">
                <h3>Incidents</h3>
                <p>{data?.totalIncidents || 0}</p>

              </div>
              <div className="analytics-icon">
              <GoAlertFill /> 
              </div>
            </div>

            <div className="analytics-item">
              <div className="analytic-details">
                <h3>Anonymous</h3>
                <p>{data?.anonymous || 0}</p>
              </div>
              <div className="analytics-icon">
              <FiAlertTriangle /> 
              </div>
            </div>
</>




:null
            }
          

           

          
          </div>
         {authUser?.roles?.some(role => ['ward-admin', 'ward-officer'].includes(role.name))&& <div className="analytics-wrapper">
          <PieChart data={data?.incidentTypes} title="Incidents" />
          <PieChart data={data?.incidentStatuses} title="Incidents Status" />
          </div>}
        </div>
        
        </>
      ) : (
        <p className="message-box">Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;
