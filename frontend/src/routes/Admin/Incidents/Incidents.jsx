import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../../axios/axios";
import Paginate from "../../../components/Paginate/Paginate";
import Empty from "../../../components/Empty/Empty";
import Modal from "../../../components/Modal/Modal";
import Select from "react-select";
import ActionSubmenu from "../../../components/ActionSubmenu/ActionSubmenu";
import moment from "moment";
import AuthLoader from "../../../components/preloaders/AuthLoader";
import { useAuth } from "../../../store/AuthProvider/AuthProvider";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { errorToast, successToast } from "../../../utils/toastMessage";
import { Helmet } from "react-helmet-async";
import { FaPrint } from "react-icons/fa";

const Incidents = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState();
  const [formData, setFormData] = useState({
    status: "",
    description: "",
  });
  const [downloading,setDownloading] = useState(false)
  const [error, setError] = useState();
  const [type, setType] = useState("");
  const [pageCount, setPageCount] = useState();
  const { authUser, openModal, closeModal } = useAuth();
  const [fetchAgain, setFetchAgain] = useState(false);
  const [incident, setIncident] = useState();
  const axiosPrivate = useAxiosPrivate();
  const [authorities, setAuthorities] = useState([]);
  const statuses = [
    { label: "reported", value: "reported" },
    { label: "investigation in progress", value: "investigation_in_progress" },
    { label: "resolved", value: "resolved" },
  ];

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  function handleChange(value, name) {
    setFormData({ ...formData, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const { data } = await axiosPrivate.put(
        `/incidents/${incident.id}/update`,
       { ...formData, status:formData.status.value}
      );

      successToast(data);

      closeModal();
      setFetchAgain(!fetchAgain);
    } catch (error) {
      if (error?.response?.data?.errors) {
        const errorsArray = error.response.data.errors;

        const errorObject = {};

        errorsArray.forEach((error) => {
          errorObject[error.path] = error.msg;
        });

        setError(errorObject);
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        return;
      }
      errorToast(error?.response?.data?.message || "Something went wrong");
    }
  }

  function handlePageChange(page) {
    setCurrentPage(page.selected + 1);
  }

  function handleRowClick(row, type) {
    openModal();
    setIncident(row);
    setType(type);
    setFormData({...formData, status:{label:incident.status.replaceAll('_', ' '), value:incident.status}})
    if (type === "assign") {
      retrieveIncidentAuthorities(row);
    }
  }

  async function retrieveIncidentAuthorities(row) {
    const { data } = await axiosPrivate.get(
      `incidents/ward?county=${row.county}&sub_county=${row.sub_county}&ward=${row.ward}&designation=${row.incident_type}`
    );

    setAuthorities(data);
  }


  const handlePrint = async () =>{
    setDownloading(true);
        try {
            const response = await axiosPrivate.get('/incidents/pdf/generate', {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'incidents.pdf');
            document.body.appendChild(link);
            link.click();
            setDownloading(false);
        } catch (error) {
            errorToast(error?.response?.data?.message || error?.message || "Error downloadng pdf")
            setDownloading(false);
        }
  }

  const handleAssignment = async (user) => {
    try {
      await axiosPrivate.put(`/incidents/${incident.id}/assign`, {
        user_id: user,
      });
      successToast("Authority assigned to incident");
      setFetchAgain(!fetchAgain);

      closeModal();
      setIncident(null);
      setAuthorities([]);
    } catch (error) {
      console.log(error);
      errorToast(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong"
      );
    }
  };

  async function deleteHandler(incident) {
    try {
      await axiosPrivate.delete(`/incidents/${incident}/delete`);

      setIncidents((prev) => {
        return prev.filter((item) => item.id !== incident);
      });

      successToast("Incident Removed");
    } catch (error) {}
  }

  async function retrieveData(user) {
    let data;
    const roles = user.roles.map((role) => role.name);
    try {
      setLoading(true);

      
        const response = await axiosPrivate.get(
          `/incidents/all?page=${currentPage}&county=${user.county}&sub_county=${user.sub_county}&ward=${user.ward}&user_id=${authUser?.id}&designation=${authUser.ward_authority.designation}`
        );
        data = response.data;
      

      setIncidents(data.incidents);
      setPageCount(data.pageCount);
    } catch (error) {
      errorToast("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (authUser) {
      retrieveData(authUser);
    }
  }, [currentPage, fetchAgain]);
  return (
    <>
    <Helmet>
      <title>Admin | Reported Incidents</title>
    </Helmet>
    <div className="main-list">
      <Modal
        title={
          type === "details"
            ? "Incident Details"
            : type === "followup"
            ? "Update Incident Follow Up"
            : " Assign Incident to Authority"
        }
      >
        {type === "details" ? (
          <>
            {incident?.incident_uploads?.length > 0 && (
              <Slider {...settings} className="image-slider">
                {incident?.incident_uploads.map((upload) => (
                  <div key={upload.id} className="slider-image-container">
                    <img
                      src={`http://localhost:4000/${upload.file_path}`}
                      alt={`Incident ${upload.id}`}
                      className="slider-image"
                    />
                  </div>
                ))}
              </Slider>
            )}

            <p className="incident-desc">{incident?.description}</p>

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
          </>
        ) : type === "followup" ? (
          <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="status">Status </label>
              <Select
                options={statuses}
                onChange={(event) => handleChange(event, "status")}
                value={formData.status}
              />
              {error?.status && (
                <span className="vl-error">{error?.status}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="description">Description </label>

              <textarea
                name="description"
                onChange={(event) =>
                  handleChange(event.target.value, "description")
                }
                placeholder="Description"
                className="textarea form-control"
              >
                {formData.description}
              </textarea>
            </div>

            <button>Submit</button>
          </form>
        ) : (
          <div className="table-container">
            <table
              className="a-list-table"
              style={{ width: "100%" }}
              id="listTable"
            >
              <thead className="text-xs text-gray-700 uppercase bg-gray-200">
                <tr>
                  <th scope="col" className="px-6 py-3 ">
                    Authority Personal details
                  </th>
                  <th scope="col" className="px-6 py-3 ">
                    Under Investigation
                  </th>
                  <th scope="col" className="px-6 py-3 ">
                    Resolved
                  </th>

                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {authorities?.length > 0 ? (
                  authorities?.map((row, idx) => (
                    <tr
                      className={
                        ("bg-white border-b dark:bg-gray-900 dark:border-gray-700 py-2",
                        idx % 2 === 0 ? "bg-white" : "even")
                      }
                      key={idx}
                    >
                      <th
                        scope="row"
                        className="px-6 py-2 font-medium text-gray-900  dark:text-white"
                      >
                        {row.full_name}
                        <br />
                        <br />
                        {row.phone}
                        <br />
                        <br />
                        {row.email}
                        <br />
                      </th>

                      <td className="px-6 py-5 ">
                        {row.underInvestigationIncidents}
                      </td>
                      <td className="px-6 py-5 ">{row.completedIncidents}</td>

                      <td className="px-6 py-2">
                        <li className="action-item">
                          <button
                            onClick={() => handleAssignment(row.id)}
                            id="delete-dcs-btn"
                            className="submenu-link assign-btn"
                          >
                            Assign To Incident
                          </button>
                        </li>
                      </td>
                    </tr>
                  ))
                ) : (
                  <Empty msg={"No record found"} span={5} />
                )}
              </tbody>
            </table>
          </div>
        )}
      </Modal>
      <div className="main-list-container">
      <div className="admin-page-header" style={{display:'flex',justifyContent:'flex-end', width:'100%', paddingRight:'20px'}}>
       
          <button
style={{cursor:downloading?'not-allowed' :'pointer'}}
            className="admin-nav-link"
            onClick={handlePrint}
            disabled={downloading}
          >
            {downloading ? "Downloading...": "Print"}
            <FaPrint className="icon fas fa-plus ml-1 text-md"></FaPrint>
          </button>
      </div>

        <div className="table-container">
          <table
            className="a-list-table"
            style={{ width: "100%" }}
            id="listTable"
          >
            <thead className="text-xs text-gray-700 uppercase bg-gray-200">
              <tr>
                <th scope="col" className="px-6 py-3 "></th>
                <th scope="col" className="px-6 py-3 ">
                  Reporter Contact details
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
                  Created At
                </th>

                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>

            {loading ? (
              <AuthLoader loadingMessage={"loading counties..."} />
            ) : (
              <tbody>
                {incidents?.length > 0 ? (
                  incidents?.map((row, idx) => (
                    <tr
                      className={
                        ("bg-white border-b dark:bg-gray-900 dark:border-gray-700 py-2",
                        idx % 2 === 0 ? "bg-white" : "even")
                      }
                      key={idx}
                    >
                      <td className="px-6 py-5 ">{idx + 1}</td>

                      <th
                        scope="row"
                        className="px-6 py-2 font-medium text-gray-900  dark:text-white"
                      >
                       {row?.reporter_id ?<> <p>Name: {row.full_name}</p> <br />
                        <br />
                        <p>Phone: {row.phone}</p> <br />
                        <br />
                       
                            <p>Ward: {row.ward}</p> <br /></> : "anonymous"}
                           
                      
                      </th>

                      <td className="px-6 py-5 ">{row.incident_type}</td>
                      <td className="px-6 py-5 ">{row.incident}</td>

                      <td className="px-6 py-5">
                        <div className="description">{row.description}</div>
                      </td>

                      <td className="px-6 py-5">
                        {row.status.replaceAll("_", " ")}
                      </td>
                      <td className="px-6 py-4 ">
                        {moment(row.createdAt).format("Do MMMM YYYY h:mm:A")}
                      </td>

                      <td className="px-6 py-2">
                        <ActionSubmenu key={idx}>
                        

                        {authUser?.roles?.map(role=>role.name)?.includes('ward-officer') ? <li className="action-item">
                            {row?.status !== "resolved" && row.status !== "rejected" &&<button
                              className="submenu-link"
                              onClick={() => handleRowClick(row, "followup")}
                            >
                              Update Follow Up
                            </button>}
                          </li> : 
                          
                         row.status !== "resolved" &&  row.status !== "rejected"  && <li className="action-item">
                          <button
                            className="submenu-link"
                            onClick={() => handleRowClick(row, "assign")}
                          >
                            Assign to Authority
                          </button>
                        </li>  

                       }                                      
                          
                          

                          <li className="action-item">
                            <button
                              onClick={() => handleRowClick(row, "details")}
                              className="submenu-link"
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
                  ))
                ) : (
                  <Empty msg={"No record found"} span={5} />
                )}
              </tbody>
            )}
          </table>

          {pageCount > 1 && (
            <div className="py-5 pl-3">
              <Paginate
                pageCount={pageCount}
                handlePageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default Incidents;
