import React, { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

const GeoJSONWithSelection = ({ data, setData, selectedFeature, setSelectedFeature }) => {
  const map = useMap();  
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
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
        layerMap.set(feature.properties.id, layer);
      },
    });

    geoJsonLayer.addTo(map);

    return () => {
      geoJsonLayer.remove();
    };
  }, [data, map, selectedFeature, setSelectedFeature]);

  useEffect(() => {
    if (!selectedFeature || !layerMap.has(selectedFeature.properties.id)) return;
  
    const layer = layerMap.get(selectedFeature.properties.id);
    layer.enableEdit(); // Enables editing on the selected shape
  
    layer.on("editable:vertex:dragend", () => {
      const updatedFeature = layer.toGeoJSON();
      console.log("Shape modified:", updatedFeature);

      // Update the selected feature
      setSelectedFeature(updatedFeature);

      // Update the data prop with the modified feature
      setData((prevData) => ({
        ...prevData,
        features: prevData.features.map((feature) =>
          feature.properties.id === updatedFeature.properties.id ? updatedFeature : feature
        ),
      }));
      saveState(updatedFeature);
    });

    const saveState = (updatedFeature) => {
        setUndoStack(prev => [...prev, updatedFeature]);
        setRedoStack([]);
    }
  
    return () => {
      layer.disableEdit();
    };
  }, [selectedFeature, setData]);
  

  return null;
};

export default GeoJSONWithSelection;