import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';

const LocationPicker = ({ onLocationSelected }) => {
  const map = useRef(null);
  const [markerPosition, setMarkerPosition] = useState([0, 0]);
  
  useEffect(() => {
    if (map.current) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          map.current.setView([latitude, longitude], 13);
          setMarkerPosition([latitude, longitude]);
        },
        (error) => {
          console.error('Error getting current position:', error);
        }
      );
    }
  }, []);

  function LocationMarker() {
    const map = useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        setMarkerPosition([lat, lng]);
        onLocationSelected(lat, lng);
      },
    });

    return <Marker position={markerPosition}></Marker>;
  }

  return (
    <MapContainer
      ref={map}
      center={[0, 0]}
      zoom={13}
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <LocationMarker />
    </MapContainer>
  );
};

export default LocationPicker;