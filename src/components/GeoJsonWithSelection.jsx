import React, { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import {useHistory} from "../context/HistoryContext";


const GeoJSONWithSelection = ({ data, setData, selectedFeature, setSelectedFeature }) => {
  const map = useMap();
  const [layerMap, setLayerMap] = useState(new Map());
  const {initializeState, saveState, undoStack, redoStack, currentState, setCurrentState} = useHistory(); 
  useEffect(() => {initializeState(data)}, []);

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
  }, [data, map, selectedFeature, setSelectedFeature, setData]);

  useEffect(() => {
    if (!selectedFeature || !layerMap.has(selectedFeature.properties.id)) return;
  
    const layer = layerMap.get(selectedFeature.properties.id);
    layer.enableEdit(); // Enables editing on the selected shape
  
    layer.on("editable:vertex:dragend", () => {
      const updatedFeature = layer.toGeoJSON();
      console.log("Shape modified:", updatedFeature);
      const newData = data.features.map((f) =>
        f.properties.id === updatedFeature.properties.id ? updatedFeature : f
      );
      // Update the selected feature
      setSelectedFeature(updatedFeature);

      // Update the data prop with the modified feature
      setData((prevData) => ({
        ...prevData,
        features: prevData.features.map((feature) =>
          feature.properties.id === updatedFeature.properties.id ? updatedFeature : feature
        ),
      }));
      saveState(newData);
    });
  
    return () => {
      layer.disableEdit();
    };
  }, [selectedFeature, setData]);
  
  useEffect(() => {
    if (!currentState) return;
    // data.forEach((feature) => {
    //   const f = currentState.features.find((f) => f.properties.id === feature.properties.id);
    //   feature.setGeolocations(f.geometry.coordinates);
    // });
    // setData(...currentState);
    setData(() => ({
      type: "FeatureCollection",
      features: currentState,
    }));
    // data.features = currentState;
  }, [currentState, setData]);

  return null;
};

export default GeoJSONWithSelection;