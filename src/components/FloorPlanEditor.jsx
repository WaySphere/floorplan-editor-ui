import React, { useEffect, useState } from "react";
import { MapContainer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-editable";
import GeoJSONWithSelection from "./GeoJsonWithSelection";
import { fetchFloorPlan, updateFeature } from "../utils/api";
import { useHistory } from "../context/HistoryContext";

const FloorPlanEditor = ({setSelectedItem, setDeleteTrigger, deleteTrigger, selectedFloor, saveStatus, setSaveStatus}) => {
  const [floorPlan, setFloorPlan] = useState(null);
  const [originalFloorPlan, setOriginalFloorPlan] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const {clearHistory} = useHistory();
  const orgId = '4'; // Replace with actual orgId
  // useEffect(() => {
  //   fetch("/mockFloorPlan.json")
  //     .then((res) => res.json())
  //     .then((data) => setFloorPlan(data))
  //     .catch((err) => console.error("Failed to load GeoJSON", err));
  // }, []);

  useEffect(() => {
    if (!selectedFloor) return; // Do nothing if no floor is selected

    const loadFloorPlan = async () => {
      try {
        const data = await fetchFloorPlan(orgId, selectedFloor); // Fetch floor plan from backend
        setFloorPlan(data);
        setOriginalFloorPlan(data); // Store the original floor plan
      } catch (err) {
        console.error("Failed to load GeoJSON", err);
      }
    };

    loadFloorPlan();
  }, [selectedFloor]); 

  useEffect(() => {
    if(saveStatus === 1) {
      // Save the current state of the floor plan
      // need to call the api to save the floor plan
      updateFeature(orgId, selectedFloor, floorPlan)
      console.log("Saved Floor Plan:", floorPlan);
      setOriginalFloorPlan(floorPlan);
      setSelectedFeature(null);
      alert("Floor Plan saved successfully");
    }
    else if(saveStatus === -1) {
      // Reset the floor plan to its original state
      setFloorPlan(originalFloorPlan);
      console.log("Reset Floor Plan:", floorPlan);
    }
    setSaveStatus(0);
    clearHistory();
  }, [saveStatus]);

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
