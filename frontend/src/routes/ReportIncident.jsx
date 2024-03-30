import { useEffect, useState } from "react";
import Select from "react-select";
import ImagePicker from "../components/ImagePicker/ImagePicker";
import { axiosInstance } from "../axios/axios";
import AuthLoader from "../components/preloaders/AuthLoader";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../store/AuthProvider/AuthProvider";
import { successToast } from "../utils/toastMessage";
import { counties } from "../data/counties";
import Modal from "../components/Modal/Modal";
import LocationPicker from "../components/MiniMap/MiniMap";

const ReportIncident = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    incident_type: "",
    incident: "",
    county: "",
    sub_county: "",
    ward: "",
    description: "",
  });
  const [coordinates, setCoordinates] = useState({
    latitude: "",
    longitude: "",
  });
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [incidents, setIncidents] = useState([]);
  const [images, setImages] = useState([]);
  const { authUser,openModal, closeModal } = useAuth();

  const { anonymous } = useParams();

  let incidents_types = [
    {
      id: 1,
      category: "Crime Incidents",
      types: ["Burglary", "Theft", "Assault", "Vandalism", "Robbery"],
    },
    {
      id: 2,
      category: "Traffic Incidents",
      types: [
        "Vehicle accidents",
        "Hit-and-run",
        "Reckless driving",
        "Traffic congestion",
      ],
    },
    {
      id: 3,
      category: "Public Safety Incidents",
      types: [
        "Suspicious activity",
        "Loitering",
        "Public disturbances",
        "Noise complaints",
      ],
    },
    {
      id: 4,
      category: "Environmental Incidents",
      types: [
        "Pollution",
        "Illegal dumping",
        "Hazardous materials spills",
        "Water contamination",
      ],
    },
    {
      id: 5,
      category: "Health and Safety Incidents",
      types: [
        "Medical emergencies",
        "Fire incidents",
        "Building code violations",
        "Unsafe structures",
      ],
    },
    {
      id: 6,
      category: "Social Issues",
      types: [
        "Harassment",
        "Discrimination",
        "Substance abuse",
        "Domestic disputes",
      ],
    },
  ];

  incidents_types = incidents_types.map((incident) => ({
    value: incident.category,
    label: incident.category,
    sub_categories: incident.types.map((type) => ({
      label: type,
      value: type,
    })),
  }));

  const handleChange = (value, name) => {
    if (name === "images") {
    
      setImages(value);
    }else{
    setFormData({ ...formData, [name]: value });
  
  }};

  const handleLocationSelected = (lat, lng) => {
    console.log(lat,lng);
    setCoordinates({...coordinates, latitude:lat,longitude:lng});
  
    
  };

  async function handleFormSubmission(e) {
    e.preventDefault();

    let newFormData = { ...formData,
    
      county: formData.county.value,
      sub_county: formData.sub_county.value,
      ward: formData.ward.value,
      incident: formData.incident.value,
      incident_type: formData.incident_type.value,   
    
    };

    if (authUser) {
      newFormData = {
        ...newFormData,
        reporter_id: authUser.id,
      };
    }

    let incidentData = new FormData();

    for (const [key, value] of Object.entries({
      ...newFormData,
      lat: coordinates.latitude,
      lon: coordinates.longitude,
    })) {
      incidentData.append(key, value || "");
    }

    images.forEach((image, index) => {
      incidentData.append("images", image);
    });

    try {
      const { data } = await axiosInstance.post(
        "/incidents/report",
        incidentData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      successToast(data);

      navigate('/incidents/history')
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
    }
  }

  // useEffect(() => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         const latitude = position.coords.latitude;
  //         const longitude = position.coords.longitude;
  //         setCoordinates({ latitude, longitude });
  //       },
  //       (error) => {
  //         setError(`Error getting geolocation: ${error.message}`);
  //       }
  //     );
  //   } else {
  //     setError("Geolocation is not supported by your browser");
  //   }
  // }, []);

  useEffect(() => {
    if (authUser) {
      setFormData({
        ...formData,
        county: { label: authUser?.county, value: authUser?.county },
        sub_county: { label: authUser.sub_county, value: authUser.sub_county },
        ward: { label: authUser?.ward, value: authUser.ward },
        full_name: authUser?.full_name,
        phone: authUser.phone,
      });
    }
  }, [authUser]);

  useEffect(()=>{
    if(!anonymous){
    openModal()
    }
  },[])

  return (
    <div className="main-content-area">
      <Modal title={"Incidents Reporting Information"}>
     
        <p className="m-info">
        We use your location to plot incidents on the map for informing purpose

          If you would not like to share your location, you can report anonymously
          by clicking the button below.
        </p>
        <button className="btn" onClick={()=>{navigate('/incident/anonymous/report'); closeModal()}}>Report Anonymously</button>
      </Modal>
      <form action="" onSubmit={handleFormSubmission} className="form">
        <div className="grid">
          {!anonymous && (
            <>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  placeholder="Full Name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={(event) =>
                    handleChange(event.target.value, "full_name")
                  }
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={(event) =>
                    handleChange(event.target.value, "phone")
                  }
                  className="form-control"
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="incident_type">Incident Type</label>
            <Select
              options={incidents_types}
              onChange={(event) => handleChange(event, "incident_type")}
            />
            {error?.incident_type && (
              <span className="vl-error">{error?.incident_type}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="incident">Select Incident </label>
            {console.log(incidents_types)}
            <Select
              options={incidents_types.find(incident_ty => incident_ty.value === formData?.incident_type?.value)?.sub_categories}
              onChange={(event) => handleChange(event, "incident")}
            />
            {error?.incident && (
              <span className="vl-error">{error?.incident}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="county">County </label>
            <Select
              options={counties?.map((county) => ({
                label: county.county_name,
                value: county.county_name,
              }))}
              onChange={(selectedOption) =>
                handleChange(selectedOption, "county")
              }
              value={formData?.county}
            />
            {error?.county && <span className="vl-error">{error?.county}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="sub_county">Sub County </label>
            <Select
              options={counties
                .find((c) => c.county_name === formData.county?.value)
                ?.constituencies?.map((constituency) => ({
                  label: constituency.constituency_name,
                  value: constituency.constituency_name,
                }))}
              onChange={(selectedOption) =>
                handleChange(selectedOption, "sub_county")
              }
              value={formData?.sub_county}
            />
            {error?.sub_county && (
              <span className="vl-error">{error?.sub_county}</span>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="ward">Ward </label>
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
            value={formData.ward}
            onChange={(selectedOption) => handleChange(selectedOption, "ward")}
          />
          {error?.ward && <span className="vl-error">{error?.ward}</span>}
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
          {error?.description && (
            <span className="vl-error">{error?.description}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="upload">Upload Images </label>
          <ImagePicker
            onImageSelect={(selectedImages) =>
              handleChange(selectedImages, "images")
            }
          />
        </div>

       {!anonymous && <div className="form-group">
        <div className="location-info">
          <p>Latitude: {coordinates?.latitude}</p>
          <p>Longitude: {coordinates?.longitude}</p>
        </div>
          <LocationPicker onLocationSelected={handleLocationSelected}/> 
        </div>}

        {loading ? <AuthLoader /> : <button>Submit</button>}
      </form>
    </div>
  );
};

export default ReportIncident;
