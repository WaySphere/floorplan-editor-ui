import React, { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

const GeoJSONWithSelection = ({ data, selectedFeature, setSelectedFeature }) => {
  const map = useMap();  
  const [layerMap, setLayerMap] = useState(new Map());

  useEffect(() => {
    if (!data) return;

    const geoJsonLayer = L.geoJSON(data, {
      style: (feature) => ({
        color: selectedFeature === feature ? "red" : "blue", // Highlight selected shape
        weight: selectedFeature === feature ? 3 : 1,
        fillOpacity: 0.5,
      }),
      onEachFeature: (feature, layer) => {
        layer.on("click", () => {
          setSelectedFeature(feature); // Store selected feature
        });
        layerMap.set(feature, layer);
      },
    });

    geoJsonLayer.addTo(map);

    return () => {
      geoJsonLayer.remove();
    };
  }, [data, map, selectedFeature, setSelectedFeature]);

  useEffect(() => {
    if (!selectedFeature || !layerMap.has(selectedFeature)) return;
  
    const layer = layerMap.get(selectedFeature);
    layer.enableEdit(); // Enables editing on the selected shape
  
    layer.on("editable:dragend", (e) => {
      console.log("New position:", e.layer.toGeoJSON());
    });
  
    layer.on("editable:vertex:dragend", (e) => {
      console.log("Shape modified:", e.layer.toGeoJSON());
    });
  
    return () => {
      layer.disableEdit();
    };
  }, [selectedFeature]);
  

  return null;
};

export default GeoJSONWithSelection;
