import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet default icon issue with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

const MapPage = () => {
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await axios.get('/api/maps/all');

        // Combine arrays if they exist; default to empty
        const combined = [
          ...(res.data.userAddresses || []),
          ...(res.data.livreurAddresses || []),
          ...(res.data.marcheAddresses || [])
        ];

        setAddresses(combined);
      } catch (err) {
        console.error('Error fetching addresses:', err);
        setAddresses([]); // fallback to empty array
      }
    };

    fetchAddresses();
  }, []);

  return (
    <div style={{ height: '100vh' }}>
      <MapContainer center={[41.9028, 12.4964]} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {addresses.map((address, index) => {
          const pos = address.coordinates;
          if (!pos) return null;

          const label =
            address.userId ? `User: ${address.userId}` :
            address.livreurId ? `Livreur: ${address.livreurId}` :
            address.marcheId ? `Marche: ${address.marcheId}` :
            'Unknown';

          return (
            <Marker position={pos} key={index}>
              <Popup>{label}</Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapPage;
