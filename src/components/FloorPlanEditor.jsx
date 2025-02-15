import React, { useEffect, useState } from "react";
import { MapContainer, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const FloorPlanEditor = () => {
  const [floorPlan, setFloorPlan] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);

  useEffect(() => {
    fetch("/mockFloorPlan.json")
      .then((res) => res.json())
      .then((data) => {
        console.log("Loaded GeoJSON Data:", data);
        setFloorPlan(data);
      })
      .catch((err) => console.error("Failed to load GeoJSON", err));
  }, []);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      {floorPlan && (
        <MapContainer
          style={{ height: "500px", width: "100%", backgroundColor: "#f5f5f5" }}
          crs={L.CRS.Simple}
          zoom={1}
          center={[0, 0]}
        >
          <GeoJSONWithSelection
            data={floorPlan}
            selectedFeature={selectedFeature}
            setSelectedFeature={setSelectedFeature}
          />
        </MapContainer>
      )}
      {selectedFeature && (
        <div style={{ marginTop: "10px", padding: "10px", background: "#f0f0f0" }}>
          <p>Selected Feature Properties:</p>
          <pre>{JSON.stringify(selectedFeature.properties, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

const GeoJSONWithSelection = ({ data, selectedFeature, setSelectedFeature }) => {
  const map = useMap();
  const [layerMap, setLayerMap] = useState(new Map());

  useEffect(() => {
    const geoJsonLayer = L.geoJSON(data, {
      style: (feature) => ({
        color: selectedFeature === feature ? "red" : "blue",
        weight: selectedFeature === feature ? 3 : 1,
        fillOpacity: 0.5,
      }),
      onEachFeature: (feature, layer) => {
        layer.on("click", () => {
          setSelectedFeature(feature);
        });
        layerMap.set(feature, layer);
      },
    });

    geoJsonLayer.addTo(map);

    const bounds = geoJsonLayer.getBounds();
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [10, 10] });
    }

    return () => {
      geoJsonLayer.remove();
    };
  }, [data, map, selectedFeature, setSelectedFeature]);

  return null;
};

export default FloorPlanEditor;
