import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';


import redMarkerIcon from '../assets/marker.png';
import { axiosInstance } from '../axios/axios';
import AuthLoader from '../components/preloaders/AuthLoader';


const redMarker = new L.Icon({
  iconUrl: redMarkerIcon,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const IncidentMap = () => {
  const [userPosition, setUserPosition] = useState(null);
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
  
    const getUserLocation = async () => {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        setUserPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      } catch (error) {
        console.error('Error getting user location:', error);
      }
    };

    getUserLocation();
  }, []);

  useEffect(() => {
  
    const fetchIncidents = async () => {
      try {
        const { data } = await axiosInstance.get("/incidents/all");
        setIncidents(data);

        
      } catch (error) {
        console.error('Error fetching incidents:', error);
      }
    };

    fetchIncidents();
  }, []);

  if(!userPosition){
    return<AuthLoader/>
  }
  return (
    <MapContainer center={userPosition} zoom={13} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=VaRxOZepV22Y1XWxBn1w"
        attribution='&copy; <a href="https://www.maptiler.com/">MapTiler</a> contributors'
      />
     
     {incidents.map(incident => (
        <CircleMarker
          key={incident.id}
          center={[incident.lat, incident.lon]}
          radius={14}
          color="#F2230E"
         fill={true}
        >
          <Popup>
            <div>
             
              <p className='incident-desc'>{incident.description}</p>
              <button className='button'>More Details</button>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
};

export default IncidentMap;
