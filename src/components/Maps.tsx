import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";
import { cn } from "@/utils/cn"

// Fix for custom icons in Leaflet
const customMarker = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
  shadowAnchor: [12, 41],
  popupAnchor: [1, -34],
});

export interface MapProps {
  lat: number;
  lon: number;
  city: string;
  className?: string;
}

// Component to update the map's center whenever lat/lon changes
function RecenterMap({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap(); // Access the map instance

  useEffect(() => {
    map.setView([lat, lon], map.getZoom(), { animate: true }); // Update the center and keep current zoom level
  }, [lat, lon, map]);

  return null; // This component doesn't render anything
}

export default function Map({ lat, lon, city, className }: MapProps) {
  return (
    <MapContainer
      center={[lat, lon]} // Initial center
      zoom={13}
      scrollWheelZoom={false}
      className={cn(
        "w-full h-[400px] rounded-lg shadow:md",
       className
      )}
      style={{ height: "400px", width: "100%" }} // Style to ensure proper sizing
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[lat, lon]} icon={customMarker}>
        <Popup>{city}</Popup>
      </Marker>

      {/* This component listens for lat/lon changes and recenters the map */}
      <RecenterMap lat={lat} lon={lon} />
    </MapContainer>
  );
}


