import { useEffect, useState } from "react"
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import Paginate from "../components/Paginate/Paginate";
import Empty from "../components/Empty/Empty";
import { Link } from "react-router-dom";
import ActionSubmenu from "../components/ActionSubmenu/ActionSubmenu";
import moment from "moment";
import AuthLoader from "../components/preloaders/AuthLoader";
import { errorToast } from "../utils/toastMessage";
import { useAuth } from "../store/AuthProvider/AuthProvider";
import Modal from "../components/Modal/Modal";

import Slider from "react-slick";
import { Helmet } from "react-helmet-async";
const IncidentHistory = () => {
  const axiosPrivate = useAxiosPrivate()
  const [loading,setLoading] = useState(false)
  const [data,setData] = useState([]);
  const [currentPage,setCurrentPage] = useState(1);
  const [pageCount,setPageCount] = useState(null)
  const [incident,setIncident] = useState()
  const {authUser,openModal} = useAuth()
  function handlePageChange(page){
    setCurrentPage(page.selected + 1)
  }


  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    
  };


  function handleOpenModal(row){
  openModal()
setIncident(row)

  }



async function retrieveUserIncidents(){
  try {
    setLoading(true)
    const {data} = await axiosPrivate.get(`/incidents/user?page=${currentPage}`);

    setData(data.incidents)
    setPageCount(data.pageCount)
  } catch (error) {
    errorToast(error)
  }finally{
    setLoading(false)
  }

}
  useEffect(()=>{
    retrieveUserIncidents();
  },[currentPage])
  
  return (
    <>
    <Helmet>
     <title>Safety First | Incidents History</title>
   </Helmet>
    <div>
      <Modal title="Incident Details">
      { incident?.incident_uploads?.length > 0 && <Slider {...settings} className='image-slider'>
            {incident?.incident_uploads.map((upload) => (
              <div key={upload.id} className='slider-image-container'>
                <img src={`http://localhost:4000/${upload.file_path}`} alt={`Incident ${upload.id}`} className='slider-image' />
              </div>
            ))}
          </Slider>}

 
          <p className="incident-desc">
            {incident?.description}
          </p>    
          
          <div className="timeline">
            <div className="follow-up-title">Follow Ups</div>
      {incident?.incident_follow_ups?.length ? incident?.incident_follow_ups?.map((followUp, index) => (
        <div className="timeline-item" key={index}>
          <div className="timeline-content">
            <h3>{moment(followUp.createdAt).format('h:mm A, M/D/YYYY')}</h3>
            <p>{followUp.description}</p>
          </div>
        </div>
      )):<div className="message-box">No Follow ups</div>}
    </div>
              
      </Modal>
      <div className="page-title">Past Incidents</div>
      <div className="u-container">
      <div className="table-container">
        <table
          className="a-list-table"
          style={{ width: "100%" }}
          id="listTable"
        >
          <thead className="text-xs text-gray-700 uppercase bg-gray-200">
            <tr>
            <th scope="col" className="px-6 py-3 ">
               {/* Id */}
              </th>
              <th scope="col" className="px-6 py-3 ">
               Incident Type
              </th>
              <th scope="col" className="px-6 py-3 ">
             Incident
              </th>
              <th scope="col" className="px-6 py-3 ">
           Description
              </th>

              <th scope="col" className="px-6 py-3 ">
           Status
              </th>

              <th scope="col" className="px-6 py-3 ">
             Date
              </th>    
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>

          {loading ? (
            <AuthLoader loadingMessage={'loading counties...'}/>
          ) : (
            // "data"
            <tbody>
              {data?.length > 0 ?data?.map((row, idx) => (
                <tr
                  className={
                    ("bg-white border-b dark:bg-gray-900 dark:border-gray-700 py-2",
                    idx % 2 === 0 ? "bg-white" : "even")
                  }
                  key={idx}
                >
                  <td className="px-6 py-5 ">{idx+1}</td>

                  <td className="px-6 py-5 ">
                    {row.incident_type}
                  </td>
                  <td className="px-6 py-5 ">
                    {row.incident}
                  </td>
                  <td className="px-6 py-5 u-description-td">
                    <div className="u-description">
                    {row.description}

                    </div>
                  </td>

                  <td className="px-6 py-5 ">
                    {row.status}
                  </td>
                  <td className="px-6 py-4 ">
                    {moment(row.createdAt).format("Do MMMM YYYY h:mm:A")}
                  </td>

                  <td className="px-6 py-2">
                    <ActionSubmenu key={idx}>
                    
                      <li className="action-item">
                        <button
                         
                          className="submenu-link"

                          onClick={()=>handleOpenModal(row)}
                        >
                      More Details
                        </button>
                      </li>
                     
                     
                      <li className="action-item">
                        <button
                          onClick={() => deleteHandler(row.id)}
                          id="delete-dcs-btn"
                          className="submenu-link"
                        >
                          Delete
                        </button>
                      </li>
                    </ActionSubmenu>
                  </td>
                </tr>
              )): (
                <Empty msg={'No record found'} span={5}/>
              )}
            </tbody>
          )}
        </table>

        {pageCount > 1 && <div className="py-5 pl-3">
          <Paginate
            pageCount={pageCount}
            handlePageChange={handlePageChange}
          />
        </div>}
        </div>
      </div>
    </div>
    </>
  )
}

export default IncidentHistory