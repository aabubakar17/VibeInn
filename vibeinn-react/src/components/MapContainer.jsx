import React, { useEffect, useState } from "react";
import { Map, AdvancedMarker, useMap } from "@vis.gl/react-google-maps";
import { geocodeHotel } from "../services/geoCoding"; // Assuming this service handles geocoding

const MapContainer = ({ hotels, hoveredHotelId, onMarkerClick }) => {
  const [markers, setMarkers] = useState([]);
  const map = useMap();

  useEffect(() => {
    async function fetchMarkers() {
      const markers = await Promise.all(
        hotels.map(async (hotel) => {
          const coords = await geocodeHotel(
            hotel.title?.trim().replace(/^\d+\.\s+/, "")
          );
          if (coords) {
            return { ...hotel, ...coords };
          } else {
            return null;
          }
        })
      );

      setMarkers(markers.filter((marker) => marker !== null));
    }

    fetchMarkers();
  }, [hotels]);

  useEffect(() => {
    if (map && markers.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      markers.forEach((marker) => {
        bounds.extend(
          new window.google.maps.LatLng(marker.latitude, marker.longitude)
        );
      });

      map.fitBounds(bounds, { padding: 50 });
    }
  }, [map, markers]);

  return (
    <Map
      mapId="your-cloud-based-map-id"
      defaultCenter={{ lat: 22.54992, lng: 0 }}
      defaultZoom={3}
      gestureHandling="greedy"
      disableDefaultUI={true}
    >
      {markers.map((marker, index) => (
        <AdvancedMarker
          key={index}
          position={{ lat: marker.latitude, lng: marker.longitude }}
          title={marker.title}
          onClick={() => onMarkerClick(marker)}
        >
          <div
            data-testid="hotel-marker"
            style={{
              padding: "5px 10px",
              background: hoveredHotelId === marker.id ? "black" : "white",
              color: hoveredHotelId === marker.id ? "white" : "black",
              borderRadius: "8px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
              fontWeight: "bold",
              fontSize: "12px",
              border: "1px solid rgba(0, 0, 0, 0.2)",
              transform: "translate(-50%, -100%)",
              whiteSpace: "nowrap",
              cursor: "pointer",
            }}
          >
            {marker.priceForDisplay?.replace("$", "£")}
          </div>
        </AdvancedMarker>
      ))}
    </Map>
  );
};

export default MapContainer;
