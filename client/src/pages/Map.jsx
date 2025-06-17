import React, { useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

import "../styles/Map.css"; // Optional

// Custom Leaflet marker icon
const blueIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
});

// Handle clicks on the map
const MapClickHandler = ({ setCoordinates }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setCoordinates([lat, lng]);
    },
  });
  return null;
};

const Map = ({ onClose, orderId: propOrderId }) => {
  const { userData } = useContext(AppContext);
  const [coordinates, setCoordinates] = useState(null);
  const [mode, setMode] = useState("user");
  const [orderId, setOrderId] = useState(propOrderId || null);

  const location = useLocation();

  // Parse orderId from the URL (e.g. /map?orderId=abc123) or from props
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const orderIdParam = queryParams.get("orderId");

    if (orderIdParam || propOrderId) {
      setMode("order");
      setOrderId(orderIdParam || propOrderId);
    } else {
      setMode("user");
    }
  }, [location.search, propOrderId]);

  const handleSaveAddress = async () => {
    if (!coordinates) {
      toast.error("Please select a location on the map.");
      return;
    }

    try {
      const payload = {
        coordinates,
        ...(mode === "user"
          ? { userId: userData?.userId }
          : { orderId: orderId }),
      };

      const endpoint =
        mode === "user"
          ? "http://localhost:4000/api/map/user"
          : "http://localhost:4000/api/map/order";

      const response = await axios.post(endpoint, payload);

      if (response.status === 200 || response.status === 201) {
        toast.success(
          `${mode === "user" ? "User" : "Order"} address saved successfully!`
        );
        if (onClose) onClose(); // Close dialog if onClose prop is provided
      }
    } catch (error) {
      console.error("Save address error:", error);
      toast.error("Failed to save address.");
    }
  };

  return (
    <div className="map-container" style={{ display: "flex", gap: "20px" }}>
      <div className="map-left" style={{ flex: 1 }}>
        <MapContainer
          center={[36.8065, 10.1815]} // Tunis center
          zoom={13}
          style={{ height: "400px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          />
          <MapClickHandler setCoordinates={setCoordinates} />
          {coordinates && <Marker position={coordinates} icon={blueIcon} />}
        </MapContainer>
      </div>

      <div className="map-right" style={{ flex: 1, padding: "1rem" }}>
        <h2>Add {mode === "user" ? "User" : "Order"} Address</h2>
        {coordinates ? (
          <p>
            Latitude: <strong>{coordinates[0].toFixed(4)}</strong> <br />
            Longitude: <strong>{coordinates[1].toFixed(4)}</strong>
          </p>
        ) : (
          <p>Click on the map to select a location.</p>
        )}
        <button
          onClick={handleSaveAddress}
          style={{
            marginTop: "10px",
            padding: "10px 20px",
            backgroundColor: "#4f46e5",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Save Address
        </button>
      </div>
    </div>
  );
};

export default Map;