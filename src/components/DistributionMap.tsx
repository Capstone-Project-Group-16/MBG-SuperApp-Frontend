import type { Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useRef } from "react";
import { GeoJSON, MapContainer, TileLayer } from "react-leaflet";
import indonesiaData from "../fe-assets/maps/indonesia.json";

export default function DistributionMap() {
  const mapRef = useRef<LeafletMap | null>(null);

  const handleMapReady = () => {
    if (mapRef.current) {
      mapRef.current.setView([-2.5489, 118.0149], 5);
    }
  };

  return (
    <MapContainer
      ref={mapRef}
      whenReady={handleMapReady}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <GeoJSON
        data={indonesiaData as any}
        style={() => ({
          fillColor: "#4CC9FE",
          color: "#1E3A8A",
          weight: 1,
          fillOpacity: 0.6,
        })}
        onEachFeature={(feature: any, layer: any) => {
          layer.on("click", () => {
            console.log("Province clicked:", feature.properties.NAME_1);
          });
        }}
      />
    </MapContainer>
  );
}
