import React, { useEffect, useState } from "react";
import { MapContainer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-editable";
import GeoJSONWithSelection from "./GeoJsonWithSelection";

const FloorPlanEditor = ({setSelectedItem, setDeleteTrigger, deleteTrigger}) => {
  const [floorPlan, setFloorPlan] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);

  useEffect(() => {
    fetch("/mockFloorPlan.json")
      .then((res) => res.json())
      .then((data) => setFloorPlan(data))
      .catch((err) => console.error("Failed to load GeoJSON", err));
  }, []);

  return (
    <div>
      {floorPlan && (
        <MapContainer
          bounds={L.geoJSON(floorPlan).getBounds()}
          crs={L.CRS.Simple}
          style={{ height: "500px", width: "100%", backgroundColor: "#f5f5f5" }}
          editable={true}
          whenCreated={(map) => {
            map.editTools = new L.Editable(map); // ✅ Enable Editable Mode
          }}
        >
          <GeoJSONWithSelection 
            data={floorPlan} 
            setData={setFloorPlan}
            selectedFeature={selectedFeature} 
            setSelectedFeature={setSelectedFeature} 
            setDeleteTrigger={setDeleteTrigger}
            deleteTrigger={deleteTrigger}
          />
        </MapContainer>
      )}
    </div>
  );
};

export default FloorPlanEditor;
