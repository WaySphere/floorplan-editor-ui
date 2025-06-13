import React, { useEffect, useState, useRef } from "react";
import { Marker, Popup, MapContainer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-editable";
import GeoJSONWithSelection from "./GeoJsonWithSelection";
import { fetchFloorPlan, updateFeature } from "../utils/api";
import { useHistory } from "../context/HistoryContext";
import { Modal, Button, Form } from "react-bootstrap";

const FloorPlanEditor = ({
  organizationId, mode, setMode, setSelectedItem, setDeleteTrigger, deleteTrigger,
  selectedFloor, saveStatus, setSaveStatus
}) => {
  const [floorPlan, setFloorPlan] = useState(null);
  const [originalFloorPlan, setOriginalFloorPlan] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const { clearHistory } = useHistory();
  const [showPoiModal, setShowPoiModal] = useState(false);
  const [pois, setPois] = useState([]);
  const [poiData, setPoiData] = useState({
    label: "",
    latitude: null,
    longitude: null,
    node_type: "POI",
    floor_id: selectedFloor,
    exit_node: false,
    connected_node_id: ""
  });
  const [pathNodes, setPathNodes] = useState([]);
  let pathNodeId = useRef(11111);

  const pathIcon = new L.Icon({
    iconUrl: "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/icons/record-circle.svg",
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    className: "path-node-icon"
  });

  // Fetch floor plan, POIs, and path nodes when floor changes
  useEffect(() => {
    if (!selectedFloor) return;

    // Fetch floor plan
    const loadFloorPlan = async () => {
      try {
        const data = await fetchFloorPlan(organizationId, selectedFloor);
        setFloorPlan(data);
        setOriginalFloorPlan(data);
      } catch (err) {
        console.error("Failed to load GeoJSON", err);
      }
    };

    // Fetch POIs
    const loadPois = async () => {
      try {
        const res = await fetch(
          `http://localhost:5767/navigation-nodes/floor/poi?floor=${encodeURIComponent(selectedFloor)}`
        );
        const data = await res.json();
        setPois(data);
      } catch (err) {
        setPois([]);
      }
    };

    // Fetch Path Nodes
    const loadPathNodes = async () => {
      try {
        const res = await fetch(
          `http://localhost:5767/navigation-nodes/floor/path?floor=${encodeURIComponent(selectedFloor)}`
        );
        const data = await res.json();
        setPathNodes(data);
      } catch (err) {
        setPathNodes([]);
      }
    };

    loadFloorPlan();
    loadPois();
    loadPathNodes();
  }, [selectedFloor]);

  useEffect(() => {
    if (saveStatus === 1) {
      updateFeature(organizationId, selectedFloor, floorPlan);
      setOriginalFloorPlan(floorPlan);
      setSelectedFeature(null);
      alert("Floor Plan saved successfully");
    } else if (saveStatus === -1) {
      setFloorPlan(originalFloorPlan);
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
          style={{ height: "90vh", width: "100%", backgroundColor: "#f5f5f5" }}
          editable={true}
          whenCreated={(map) => {
            map.editTools = new L.Editable(map);
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
            drawPathMode={mode === "drawPath"}
            onPathMapClick={async (latlng) => {
              const newNode = {
                featureId: pathNodeId.current++,
                floorId: selectedFloor,
                longitude: latlng.lng,
                latitude: latlng.lat,
                nodeType: "PATH",
                exitNode: false,
                connectedNodeId: null,
                label: ""
              };
              try {
                const res = await fetch("http://localhost:5767/navigation-nodes", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(newNode)
                });
                if (!res.ok) {
                  alert("Failed to save path node");
                  return;
                }
                setPathNodes((prev) => [...prev, newNode]);
              } catch (err) {
                alert("Failed to save path node");
              }
            }}
          />
          {pois.map((poi) => (
            <Marker
              key={poi.featureId || poi.nodeId}
              position={[poi.latitude, poi.longitude]}
              icon={new L.Icon({
                iconUrl: "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/icons/geo-alt-fill.svg",
                iconSize: [24, 24],
                iconAnchor: [12, 24],
              })}
            >
              <Popup>
                <strong>{poi.label}</strong><br />
                Node ID: {poi.featureId || poi.nodeId}<br />
                Exit: {poi.exitNode ? "Yes" : "No"}
              </Popup>
            </Marker>
          ))}
          {pathNodes.map((node) => (
            <Marker
              key={node.featureId}
              position={[node.latitude, node.longitude]}
              icon={pathIcon}
            >
              <Popup>
                Path Node<br />
                ID: {node.nodeId || node.featureId}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
      <Modal show={showPoiModal} onHide={() => setShowPoiModal(false)} centered>
        <Form
          onSubmit={async (e) => {
            e.preventDefault();
            const payload = {
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
              const savedPoi = await res.json(); // This does NOT have lat/lng
              // Merge backend response with local lat/lng
              setPois([
                ...pois,
                {
                  ...savedPoi,
                  latitude: poiData.latitude,
                  longitude: poiData.longitude
                }
              ]);
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
            {/* Node ID input removed */}
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
