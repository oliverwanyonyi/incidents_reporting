import { useEffect, useState } from "react";
import Select from "react-select";
import AuthLoader from "../../../components/preloaders/AuthLoader";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../../../axios/axios";
import { errorToast, successToast } from "../../../utils/toastMessage";
import { useAuth } from "../../../store/AuthProvider/AuthProvider";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

const SubCountyAuthority = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    position: "",
    designation: "",
    sub_county: "",
    password: "",
  });
  const { editId } = useParams();
  const [subcounties, setSubCounties] = useState([]);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const { authUser } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

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

  async function getSubCountyAuth() {
    const { data } = await axiosPrivate.get(
      `/counties/subcounty/authority/${editId}/profile`
    );

    setFormData({
      ...formData,
      full_name: data?.full_name,
      phone: data?.phone,
      position: data?.position,
      designation: data?.designation,
      sub_county: data?.sub_county,
      email: data.email,
    });
  }

  useEffect(() => {
    if (editId) {
      getSubCountyAuth();
    }
  }, [editId]);

  function changeHandler(key, value) {
    if (key === "county") {
      console.log(key);
      retrieveSubCounties(value);
    }
    setFormData({ ...formData, [key]: value });
  }

  async function submitHandler(e) {
    e.preventDefault();

    try {
      setLoading(true);

      if (editId) {
        const {password, ...others} = formData
        const { data } = await axiosPrivate.put(
          `/counties/subcounty/authority/${editId}/update`,
          others
        );
        successToast(data);
      } else {
        const { data } = await axiosPrivate.post(
          "/counties/subcounty/authority/add",
          formData
        );
        successToast(data);
      }


      navigate("/admin/subcounty-authority/all");
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

  async function retrieveSubCounties(countyId) {
    try {
      setLoading(true);

      const { data } = await axiosPrivate.get(
        `/counties/${countyId}/sublocations?page=all`
      );
      const new_subcounties = data.subcounties.map(subcounty => ({
        label: subcounty.name,
        value: subcounty.id
      }));

    

      setSubCounties(new_subcounties);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (authUser) {
      retrieveSubCounties(authUser.county);
    }
  }, []);
  return (
    <div className="main-list">
      <div className="main-list-container">
        <form className="form" onSubmit={submitHandler}>
          <div className="form-wrapper">
            <h1 className="form-header">SubCounty Authority Information</h1>

            <div className={"grid form-grid"}>
              <div className="form-group">
                <label className="form-label" id="full_name">
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
                  {" "}
                  Designation
                </label>
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

              <div className="form-group">
                <label className="form-label" id="sub_county">
                  {" "}
                  SubCounty
                </label>
                <Select
                  type="text"
                  options={subcounties}
                  value={subcounties.find(
                    (sub) => (sub.value === formData.sub_county)
                  )}
                  onChange={(e) => changeHandler("sub_county", e.value)}
                />
                {error?.sub_county && (
                  <span className="vl-error">{error?.sub_county}</span>
                )}
              </div>

          {  !editId &&  <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  value={formData.code}
                  onChange={(e) => changeHandler("password", e.target.value)}
                  className="form-control"
                />
                {error?.password && (
                  <span className="vl-error">{error?.password}</span>
                )}
              </div>}
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
  );
};

export default SubCountyAuthority;
