import React, { useEffect, useState } from "react";
import { useMap, useMapEvent } from "react-leaflet";
import L from "leaflet";
import {useHistory} from "../context/HistoryContext";


const GeoJSONWithSelection = ({ data, setData, selectedFeature, setSelectedFeature, setDeleteTrigger, deleteTrigger, addPoiMode, onPoiMapClick }) => {
  useMapEvent("click", (e) => {
    if (addPoiMode && onPoiMapClick) {
      onPoiMapClick(e.latlng);
    }
  });
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
          if (!addPoiMode) { // <-- Only select if not in Add POI mode
            setSelectedFeature(feature);
          }
        });
        layerMap.set(feature.properties.id, layer);
      },
    });

    geoJsonLayer.addTo(map);

    return () => {
      geoJsonLayer.remove();
    };
  }, [data, map, selectedFeature, setSelectedFeature, setData, addPoiMode]);

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
    setData(() => ({
      type: "FeatureCollection",
      features: currentState,
    }));
    // data.features = currentState;
  }, [currentState, setData]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        performDeleteOperation();
      }
    };
  
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [data, selectedFeature, setData, saveState, setSelectedFeature]);

  useEffect( ()=> {
    if(deleteTrigger && selectedFeature){
      performDeleteOperation();
      setDeleteTrigger(false);
    }
  })
  const performDeleteOperation = () => {
    if (!selectedFeature) return;
  
        const updated = data.features.filter(
          (f) => f.properties.id !== selectedFeature.properties.id
        );
  
        setData({
          type: "FeatureCollection",
          features: updated,
        });
  
        saveState(updated);
        setSelectedFeature(null);
  }
  return null;
};

export default GeoJSONWithSelection;