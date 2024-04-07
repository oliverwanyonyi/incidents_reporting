import { useEffect, useState } from "react";
import { axiosInstance } from "../../../axios/axios";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import AuthLoader from "../../../components/preloaders/AuthLoader";
import { errorToast, successToast } from "../../../utils/toastMessage";
import { useAuth } from "../../../store/AuthProvider/AuthProvider";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { Helmet } from "react-helmet-async";

const WardAuthority = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    position: "",
    email:'',
    designation: "",
    password: "",
  });
  const { authUser } = useAuth();
  const [counties, setCounties] = useState([]);
  const [subcounties, setSubCounties] = useState([]);
  const { editId } = useParams();
  const [wards, setWards] = useState([]);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  function changeHandler(key, value) {
    if (key === "county") {
      console.log(key);
      retrieveSubCounties(value);
    } else if (key === "sub_county") {
      retrieveWards(value);
    }
    setFormData({ ...formData, [key]: value });
  }


  
  const departments = [
    { label: "Crime Incidents", value: "Crime Incidents" },
    { label: "Traffic Incidents", value: "Traffic Incidents" },
    { label: "Environmental Incidents", value: "Environmental Incidents" },
    {
      label: "Health and Safety Incidents",
      value: "Health and Safety Incidents",
    },
    { label: "Social Issues", value: "Social Issues" },
  ];

  const positions = [
    { label: "Police Officer", value: "Police Officer" },
    { label: "Traffic Officer", value: "Traffic Officer" },
    { label: "Fire Fighter", value: "Fire Fighter" },
  ];



  async function submitHandler(e) {
    e.preventDefault();

    try {
      setLoading(true);

      if (editId) {
        const { data } = await axiosPrivate.put(
          `/counties/ward/authority/${editId}/update`,
          formData
        );

        successToast(data);
      } else {
        const { data } = await axiosPrivate.post(
          "/counties/ward/authority/add",
          formData
        );

        successToast(data);
      }

      navigate("/admin/ward-authority/all");
    } catch (error) {
      if (error?.response?.data?.errors) {
        const errorsArray = error.response.data.errors;
        const errorObject = {};

        errorsArray.forEach((error) => {
          errorObject[error.path] = error.msg;
        });

        setError(errorObject);
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      } else {
        errorToast(error?.response?.data?.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function getWardAdmin(wardAdmin) {
    const { data } = await axiosPrivate.get(
      `/counties/ward/authority/${wardAdmin}/profile`
    );

    setFormData({
      ...formData,
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
      ward: data.ward,
      designation: data.ward_authority.designation,
      position: data.ward_authority.position,
    });
  }

  
  useEffect(() => {
    if (editId) {
      getWardAdmin(editId);
    }
  }, []);


  return (
    <>
    <Helmet>
      <title>Admin | Add Ward AUthority</title>
    </Helmet>
    <div className="main-list">
      <div className="main-list-container">
        <form className="form" onSubmit={submitHandler}>
          <div className="form-wrapper">
            <h1 className="form-header">Ward Authority Information</h1>

            <div className={"grid form-grid"}>
              <div className="form-group">
                <label className="form-label" id="full_name">
                  {" "}
                  Name
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => changeHandler("full_name", e.target.value)}
                  className="form-control"
                />
                {error?.full_name && (
                  <span className="vl-error">{error?.full_name}</span>
                )}
              </div>
              <div className="form-group">
                <label className="form-label" id="phone">
                  {" "}
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => changeHandler("phone", e.target.value)}
                  className="form-control"
                />
                {error?.phone && (
                  <span className="vl-error">{error?.phone}</span>
                )}
              </div>
              <div className="form-group">
                <label className="form-label" id="email">
                  {" "}
                  Email
                </label>
                <input
                  type="text"
                  value={formData.email}
                  onChange={(e) => changeHandler("email", e.target.value)}
                  className="form-control"
                />
                {error?.email && (
                  <span className="vl-error">{error?.email}</span>
                )}
              </div>
              <div className="form-group">
                <label className="form-label"> Position</label>
                <Select
                  options={positions}
                  onChange={(selectedOption) =>
                    changeHandler("position", selectedOption.value)
                  }
                  value={positions.find(
                    (dep) => dep.label === formData.position
                  )}
                />
                {error?.position && (
                  <span className="vl-error">{error?.position}</span>
                )}
              </div>
              <div className="form-group">
                <label className="form-label" name="designation">
                  Designation
                </label>
                {
                  console.log(formData)
                }
                <Select
                  type="text"
                  value={departments.find(
                    (dep) => dep.label === formData.designation
                  )}
                  onChange={(e) => changeHandler("designation", e.value)}
                  options={departments}
                />
                {error?.designation && (
                  <span className="vl-error">{error?.designation}</span>
                )}
              </div>

              {!editId && (
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => changeHandler("password", e.target.value)}
                    className="form-control"
                  />
                  {error?.password && (
                    <span className="vl-error">{error?.password}</span>
                  )}
                </div>
              )}
            </div>

            {!loading ? (
              <div className="button-group">
                <button type="submit">{editId ? "Update" : "Submit"}</button>
              </div>
            ) : (
              <AuthLoader />
            )}
          </div>
        </form>
      </div>
    </div>
    </>
  );
};

export default WardAuthority;
