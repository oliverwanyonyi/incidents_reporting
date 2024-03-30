import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';

const LocationPicker = ({ onLocationSelected }) => {
  const map = useRef(null);

  useEffect(() => {
    if (map.current) {
      map.current.flyTo([0, 0], 13);
    }
  }, []);

  function LocationMarker() {
    const map = useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        onLocationSelected(lat, lng);
      },
    });

    return null;
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