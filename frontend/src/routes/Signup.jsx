import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Auth from "./Auth";
import { axiosInstance } from "../axios/axios";
import { useAuth } from "../store/AuthProvider/AuthProvider";
import AuthLoader from "../components/preloaders/AuthLoader";
import { errorToast, successToast } from "../utils/toastMessage";
import { counties } from "../data/counties.js";

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    email: "",
    position: "",
    designation: "",
    password: "",
    county: "",
  });
  const [error, setError] = useState();
  const { setAuthUser, setAccessToken } = useAuth();

  let countiesData = counties;

  const location = useLocation();
  const defaultFrom = "/admin/dashboard";

  const from =
    location.state?.from.pathname !== "/login" &&
    location.state?.from.pathname !== "/authority/register" &&
    location.state?.from
      ? location.state?.from
      : defaultFrom;
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

  async function handleFormSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await axiosInstance.post("/auth/authority/signup", {
        ...formData,
        county: formData?.county?.value,
        sub_county: formData?.sub_county?.value,
        ward: formData?.ward?.value,
        position: formData.position?.value,
        designation: formData.designation?.value,
      });

      setAuthUser(response.data.user);
      setAccessToken(response.data.access_token);

      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem(
        "access_token",
        JSON.stringify(response.data.access_token)
      );

      successToast("Signup was successful");

      console.log(from);
      navigate(from, { replace: true });
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
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (selectedOption, name) => {
    setFormData({ ...formData, [name]: selectedOption });
  };
  function changeHandler(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  

  return (
    <Auth>
      <form onSubmit={handleFormSubmit}>
        <h1 className="auth-form-header">Authority | Signup</h1>
        <div className="form-group">
          <label htmlFor="full_name">
            Full Name <span className="required">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g John Doe"
            onChange={changeHandler}
            value={formData.full_name}
            name="full_name"
            className="form-control"
          />
          {error?.full_name && (
            <span className="vl-error">{error?.full_name}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="phone">
            Phone Number <span className="required">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g John Doe"
            onChange={changeHandler}
            value={formData.phone}
            name="phone"
            className="form-control"
          />
          {error?.phone && <span className="vl-error">{error?.phone}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">
            Email <span className="required">*</span>{" "}
          </label>
          <input
            type="text"
            placeholder="e.g johndoe@gmail.com"
            onChange={changeHandler}
            value={formData.email}
            name="email"
            className="form-control"
          />
          {error?.email && <span className="vl-error">{error?.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="county">
            County<span className="required">*</span>
          </label>
          <Select
            options={counties?.map((county) => ({
              label: county.county_name,
              value: county.county_name,
            }))}
            className="form-control"
            onChange={(selectedOption) =>
              handleChange(selectedOption, "county")
            }
          />
          {error?.county && <span className="vl-error">{error?.county}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="county">
            Sub Location<span className="required">*</span>
          </label>
          <Select
            options={counties
              .find((c) => c.county_name === formData.county?.value)
              ?.constituencies?.map((constituency) => ({
                label: constituency.constituency_name,
                value: constituency.constituency_name,
              }))}
            className="form-control"
            onChange={(selectedOption) =>
              handleChange(selectedOption, "sub_county")
            }
          />
          {error?.sub_county && (
            <span className="vl-error">{error?.sub_county}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="county">
            Ward<span className="required">*</span>
          </label>
          <Select
            options={counties
              .find((c) => c.county_name === formData?.county?.value)
              ?.constituencies?.find(
                (con) => con.constituency_name === formData?.sub_county?.value
              )
              ?.wards?.map((ward) => ({
                label: ward,
                value: ward,
              }))}
            className="form-control"
            onChange={(selectedOption) => handleChange(selectedOption, "ward")}
          />
          {error?.ward && <span className="vl-error">{error?.ward}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="position">
            Position<span className="required">*</span>
          </label>
          <Select
            options={[
              { label: "Police Officer", value: "Police Officer" },
              { label: "Traffic Officer", value: "Traffic Officer" },
              { label: "Fire Fighter", value: "Fire Fighter" },
            ]}
            className="form-control"
            onChange={(selectedOption) =>
              handleChange(selectedOption, "position")
            }
          />

          {error?.position && (
            <span className="vl-error">{error?.position}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="designation">
            Department<span className="required">*</span>
          </label>
          <Select
            options={departments}
            className="form-control"
            onChange={(selectedOption) =>
              handleChange(selectedOption, "designation")
            }
          />

          {error?.designation && (
            <span className="vl-error">{error?.designation}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password </label>
          <input
            type="password"
            onChange={changeHandler}
            value={formData.password}
            name="password"
            className="form-control"
          />
          {error?.password && (
            <span className="vl-error">{error?.password}</span>
          )}
        </div>
        {!loading ? <button>Sign Up</button> : <AuthLoader />}

        <h1 className="login-redirect">
          Already have an account <Link to={"/login"}>Login</Link>
        </h1>
      </form>
    </Auth>
  );
};

export default Signup;
