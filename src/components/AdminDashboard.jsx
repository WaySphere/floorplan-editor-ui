import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUpload, FaEdit, FaUserCircle } from "react-icons/fa";
import { Modal, Button, Form, Row, Col, Alert, Container, Card } from "react-bootstrap";

export default function AdminDashboard({setOrganizationId, organizationId}) {
  const navigate = useNavigate();
  const [showUpload, setShowUpload] = useState(false);
  const [floorId, setFloorId] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [uploadType, setUploadType] = useState("dxf"); // default to dxf
  const [level, setLevel] = useState("");

  const handleUpload = () => setShowUpload(true);

  const handleEditExisting = () => {
    navigate("/editor");
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!floorId.trim()) {
      setError("Floor ID is required.");
      return;
    }
    if (!level.trim()) {
      setError("Level is required.");
      return;
    }
    if (!file) {
      setError("Please select a file.");
      return;
    }
    if( organizationId === null) {
      setError("Please login first.");
      return;
    }
    const params = new URLSearchParams({
      floorId: floorId.trim(),
      orgId: organizationId,
      level: level.trim()
    }).toString();
    try {
      const floorRes = await fetch(`http://localhost:5767/floors?${params}`, {
        method: "POST"
      });
      if (!floorRes.ok) {
        setError("Failed to create floor. Please check floor ID and level.");
        return;
      }
    } catch (err) {
      setError("Failed to create floor. Please try again.");
      return;
    }
    if (uploadType === "dxf" ){
      if(!file.name.endsWith(".dxf")) {
        setError("Please upload a valid DXF file.");
        return;
      }
      try {
        const formData = new FormData();
        formData.append("file", file);

        // Encode floorId for URL safety
        const encodedFloorId = encodeURIComponent(floorId.trim());
        const url = `http://localhost:5767/admin/upload/dxf/${organizationId}/${encodedFloorId}`;

        const res = await fetch(url, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          setError("Upload failed. Please try again.");
          return;
        }
        alert("DXF file uploaded successfully!");
      } catch (err) {
        setError("Upload failed. Please try again.");
        return;
      }
    }
    else if (uploadType === "geojson") {
      if(!file.name.endsWith(".json") && !file.name.endsWith(".geojson")) {
        setError("Please upload a valid GeoJSON file.");
        return;
      }
      try {
        // Read the file as text and parse as JSON
        const text = await file.text();
        let geojson;
        try {
          geojson = JSON.parse(text);
        } catch (err) {
          setError("Invalid GeoJSON file.");
          return;
        }

        const encodedFloorId = encodeURIComponent(floorId.trim());
        const url = `http://localhost:5767/floor-features/${organizationId}/${encodedFloorId}`;

        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(geojson),
        });

        if (!res.ok) {
          setError("Upload failed. Please try again.");
          return;
        }
        alert("GeoJSON uploaded successfully!");
      } catch (err) {
        setError("Upload failed. Please try again.");
        return;
      }
    }
    // TODO: Implement actual upload logic here (API call)
    alert(`Uploading Floor: ${floorId}, Type: ${uploadType}, File: ${file.name}`);
    setShowUpload(false);
    setFloorId("");
    setFile(null);
    setUploadType("dxf");
  };

  return (
    <div className="d-flex min-vh-100" style={{ background: "linear-gradient(120deg, #f8fafc 0%, #e0e7ef 100%)" }}>
      {/* Sidebar */}
      <div className="bg-dark text-white d-flex flex-column align-items-center py-4" style={{ width: 220, minHeight: "100vh" }}>
        <FaUserCircle size={64} className="mb-3" style={{ color: "#38bdf8" }} />
        <div className="fw-bold fs-5 mb-4">Admin</div>
        <div className="text-secondary mb-2">Dashboard</div>
        <div className="text-secondary mb-2 opacity-50">Settings</div>
        <div className="text-secondary mb-2 opacity-50">Logout</div>
      </div>

      {/* Main Content */}
      <Container fluid className="d-flex flex-column align-items-center py-5">
        {/* Centered Header */}
        <Row className="w-100 justify-content-center mb-4">
          <Col xs="auto">
            <h1 className="fw-bold text-center" style={{ color: "#1e293b" }}>
              Floorplan Admin Dashboard
            </h1>
          </Col>
        </Row>

        {/* Cards */}
        <Row className="w-100 justify-content-center g-4">
          <Col xs={12} md={6} lg={4}>
            <Card className="h-100 text-center shadow-sm" onClick={handleUpload} style={{ cursor: "pointer" }}>
              <Card.Body>
                <FaUpload size={38} color="#38bdf8" className="mb-3" />
                <Card.Title className="fw-semibold mb-2">Upload Floorplan Data</Card.Title>
                <Card.Text className="text-secondary mb-3">
                  Import a new floorplan by uploading a DXF, GeoJSON, or image file.
                </Card.Text>
                <Button variant="info">Upload</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={6} lg={4}>
            <Card className="h-100 text-center shadow-sm" onClick={handleEditExisting} style={{ cursor: "pointer" }}>
              <Card.Body>
                <FaEdit size={38} color="#6366f1" className="mb-3" />
                <Card.Title className="fw-semibold mb-2">Edit Existing Floor Plan</Card.Title>
                <Card.Text className="text-secondary mb-3">
                  View and edit previously uploaded floorplans.
                </Card.Text>
                <Button variant="primary">Edit</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Upload Modal/Form */}
        <Modal show={showUpload} onHide={() => setShowUpload(false)} centered>
          <Form onSubmit={handleSubmit}>
            <Modal.Header closeButton>
              <Modal.Title>Upload Floorplan Data</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form.Group className="mb-3" controlId="floorId">
                <Form.Label>Floor ID</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Floor ID"
                  value={floorId}
                  onChange={e => setFloorId(e.target.value)}
                  required
                />
              </Form.Group>
              {/* <Form.Group className="mb-3" controlId="floorDesc">
                <Form.Label>
                  Floor Description <span className="text-muted">(max 20 chars)</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Floor Description"
                  value={floorDesc}
                  maxLength={20}
                  onChange={e => setFloorDesc(e.target.value)}
                  required
                />
              </Form.Group> */}
              <Form.Group className="mb-3" controlId="level">
                <Form.Label>Level</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Level"
                  value={level}
                  onChange={e => setLevel(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Upload Type</Form.Label>
                <Row>
                  <Col>
                    <Form.Check
                      type="radio"
                      label="DXF"
                      name="uploadType"
                      value="dxf"
                      checked={uploadType === "dxf"}
                      onChange={() => setUploadType("dxf")}
                    />
                  </Col>
                  <Col>
                    <Form.Check
                      type="radio"
                      label="GeoJSON"
                      name="uploadType"
                      value="geojson"
                      checked={uploadType === "geojson"}
                      onChange={() => setUploadType("geojson")}
                    />
                  </Col>
                  {/* <Col>
                    <Form.Check
                      type="radio"
                      label="Image"
                      name="uploadType"
                      value="image"
                      checked={uploadType === "image"}
                      onChange={() => setUploadType("image")}
                      disabled // <-- disables the Image option
                    />
                  </Col> */}
                </Row>
              </Form.Group>
              <Form.Group className="mb-3" controlId="file">
                <Form.Label>
                  {uploadType === "dxf"
                    ? "DXF File"
                    : uploadType === "geojson"
                    ? "GeoJSON File"
                    : "Image File"}
                </Form.Label>
                <Form.Control
                  type="file"
                  accept={
                    uploadType === "dxf"
                      ? ".dxf"
                      : uploadType === "geojson"
                      ? ".json,application/geo+json,application/json"
                      : "image/*"
                  }
                  onChange={handleFileChange}
                  required
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowUpload(false)}>
                Cancel
              </Button>
              <Button variant="info" type="submit">
                Upload
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Container>
    </div>
  );
}