import React, { useEffect, useState } from "react";
import { Marker, Popup, MapContainer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-editable";
import GeoJSONWithSelection from "./GeoJsonWithSelection";
import { fetchFloorPlan, updateFeature } from "../utils/api";
import { useHistory } from "../context/HistoryContext";
import { Modal, Button, Form } from "react-bootstrap";

const FloorPlanEditor = ({mode, setMode, setSelectedItem, setDeleteTrigger, deleteTrigger, selectedFloor, saveStatus, setSaveStatus}) => {
  const [floorPlan, setFloorPlan] = useState(null);
  const [originalFloorPlan, setOriginalFloorPlan] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const {clearHistory} = useHistory();
  const orgId = '4'; // Replace with actual orgId
  const [showPoiModal, setShowPoiModal] = useState(false);
  const [pois, setPois] = useState([]);
  const [poiData, setPoiData] = useState({
    node_id: "",
    label: "",
    latitude: null,
    longitude: null,
    node_type: "POI",
    floor_id: selectedFloor,
    exit_node: false,
    connected_node_id: ""
  });

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
            addPoiMode={mode === "addPOI"}
            onPoiMapClick={(latlng) => {
              setPoiData({
                node_id: "",
                label: "",
                latitude: latlng.lat,
                longitude: latlng.lng,
                node_type: "POI",
                floor_id: selectedFloor,
                exit_node: false,
                connected_node_id: ""
              });
              setShowPoiModal(true);
            }}
          />
          {pois.map((poi) => (
            <Marker
              key={poi.featureId}
              position={[poi.latitude, poi.longitude]}
              icon={new L.Icon({
                iconUrl: "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/icons/geo-alt-fill.svg",
                iconSize: [24, 24],
                iconAnchor: [12, 24],
              })}
            >
              <Popup>
                <strong>{poi.label}</strong><br />
                Node ID: {poi.featureId}<br />
                Exit: {poi.exitNode ? "Yes" : "No"}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
      <Modal show={showPoiModal} onHide={() => setShowPoiModal(false)} centered>
        <Form
          onSubmit={async (e) => {
            e.preventDefault();
            // Prepare payload for backend
            const payload = {
              featureId: poiData.node_id,
              floorId: poiData.floor_id,
              longitude: poiData.longitude,
              latitude: poiData.latitude,
              nodeType: "POI",
              exitNode: poiData.exit_node,
              connectedNodeId: poiData.exit_node ? poiData.connected_node_id : null,
              label: poiData.label
            };

            try {
              const res = await fetch("http://localhost:5767/navigation-nodes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
              });
              if (!res.ok) {
                alert("Failed to save POI");
                return;
              }
              // Optionally get the created POI from response
              // const savedPoi = await res.json();
              setPois([...pois, { ...payload }]);
              setShowPoiModal(false);
            } catch (err) {
              alert("Failed to save POI");
            }
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Add POI</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-2">
              <Form.Label>Node ID</Form.Label>
              <Form.Control
                value={poiData.node_id}
                onChange={e => setPoiData({ ...poiData, node_id: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Label</Form.Label>
              <Form.Control
                value={poiData.label}
                onChange={e => setPoiData({ ...poiData, label: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Latitude</Form.Label>
              <Form.Control value={poiData.latitude} readOnly />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Longitude</Form.Label>
              <Form.Control value={poiData.longitude} readOnly />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Node Type</Form.Label>
              <Form.Control value="POI" readOnly />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Floor ID</Form.Label>
              <Form.Control value={poiData.floor_id} readOnly />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Check
                type="checkbox"
                label="Exit Node"
                checked={poiData.exit_node}
                onChange={e => setPoiData({ ...poiData, exit_node: e.target.checked })}
              />
            </Form.Group>
            {poiData.exit_node && (
              <Form.Group className="mb-2">
                <Form.Label>Connected Node ID</Form.Label>
                <Form.Control
                  value={poiData.connected_node_id}
                  onChange={e => setPoiData({ ...poiData, connected_node_id: e.target.value })}
                  required={poiData.exit_node}
                />
              </Form.Group>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowPoiModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save POI
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default FloorPlanEditor;
