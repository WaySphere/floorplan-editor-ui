import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUpload, FaEdit, FaUserCircle } from "react-icons/fa";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [showUpload, setShowUpload] = useState(false);
  const [floorId, setFloorId] = useState("");
  const [floorDesc, setFloorDesc] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [uploadType, setUploadType] = useState("dxf"); // default to dxf

  const handleUpload = () => setShowUpload(true);

  const handleEditExisting = () => {
    navigate("/editor");
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!floorId.trim()) {
      setError("Floor ID is required.");
      return;
    }
    if (!floorDesc.trim() || floorDesc.length > 20) {
      setError("Floor Description is required (max 20 chars).");
      return;
    }
    if (!file) {
      setError("Please select a file.");
      return;
    }
    // TODO: Implement actual upload logic here (API call)
    alert(`Uploading Floor: ${floorId}, Desc: ${floorDesc}, Type: ${uploadType}, File: ${file.name}`);
    setShowUpload(false);
    setFloorId("");
    setFloorDesc("");
    setFile(null);
    setUploadType("dxf");
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      background: "linear-gradient(120deg, #f8fafc 0%, #e0e7ef 100%)"
    }}>
      {/* Sidebar */}
      <aside style={{
        width: 220,
        background: "#1e293b",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 40,
        boxShadow: "2px 0 8px rgba(30,41,59,0.06)"
      }}>
        <FaUserCircle size={64} style={{ marginBottom: 16, color: "#38bdf8" }} />
        <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 32 }}>Admin</div>
        <div style={{ fontSize: 14, color: "#cbd5e1", marginBottom: 8 }}>Dashboard</div>
        <div style={{ fontSize: 14, color: "#cbd5e1", marginBottom: 8, opacity: 0.6 }}>Settings</div>
        <div style={{ fontSize: 14, color: "#cbd5e1", marginBottom: 8, opacity: 0.6 }}>Logout</div>
      </aside>

      {/* Main Content */}
      <main style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "48px 0"
      }}>
        {/* Centered Header */}
        <div style={{
          width: "100%",
          maxWidth: 900,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 32
        }}>
          <h1 style={{ color: "#1e293b", fontWeight: 700, fontSize: "2.2rem", margin: 0, textAlign: "center" }}>
            Floorplan Admin Dashboard
          </h1>
        </div>

        {/* Cards */}
        <div style={{
          display: "flex",
          gap: 32,
          width: "100%",
          maxWidth: 900,
          justifyContent: "center"
        }}>
          {/* Upload DXF Card */}
          <div style={{
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 2px 12px rgba(30,41,59,0.07)",
            padding: "32px 28px",
            minWidth: 260,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            transition: "box-shadow 0.2s",
            cursor: "pointer"
          }}
            onClick={handleUpload}
          >
            <FaUpload size={38} color="#38bdf8" style={{ marginBottom: 18 }} />
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 10 }}>Upload Floorplan Data</div>
            <div style={{ color: "#64748b", fontSize: 15, marginBottom: 18, textAlign: "center" }}>
              Import a new floorplan by uploading a DXF, GeoJSON, or image file.
            </div>
            <button style={{
              padding: "10px 24px",
              background: "linear-gradient(90deg, #38bdf8 0%, #2563eb 100%)",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              fontWeight: 600,
              fontSize: 16,
              cursor: "pointer"
            }}>
              Upload
            </button>
          </div>

          {/* Edit Existing Card */}
          <div style={{
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 2px 12px rgba(30,41,59,0.07)",
            padding: "32px 28px",
            minWidth: 260,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            transition: "box-shadow 0.2s",
            cursor: "pointer"
          }}
            onClick={handleEditExisting}
          >
            <FaEdit size={38} color="#6366f1" style={{ marginBottom: 18 }} />
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 10 }}>Edit Existing Floor Plan</div>
            <div style={{ color: "#64748b", fontSize: 15, marginBottom: 18, textAlign: "center" }}>
              View and edit previously uploaded floorplans.
            </div>
            <button style={{
              padding: "10px 24px",
              background: "linear-gradient(90deg, #6366f1 0%, #3b82f6 100%)",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              fontWeight: 600,
              fontSize: 16,
              cursor: "pointer"
            }}>
              Edit
            </button>
          </div>
        </div>

        {/* Upload Modal/Form */}
        {showUpload && (
          <div style={{
            position: "fixed",
            top: 0, left: 0, width: "100vw", height: "100vh",
            background: "rgba(30,41,59,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 9999
          }}>
            <form
              onSubmit={handleSubmit}
              style={{
                background: "#fff",
                padding: "32px 28px",
                borderRadius: 12,
                boxShadow: "0 2px 24px rgba(30,41,59,0.15)",
                minWidth: 340,
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}
            >
              <h2 style={{ marginBottom: 18, color: "#1e293b" }}>Upload Floorplan Data</h2>
              <input
                type="text"
                placeholder="Floor ID"
                value={floorId}
                onChange={e => setFloorId(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  marginBottom: "14px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "6px",
                  fontSize: "1rem"
                }}
              />
              <input
                type="text"
                placeholder="Floor Description (max 20 chars)"
                value={floorDesc}
                maxLength={20}
                onChange={e => setFloorDesc(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  marginBottom: "14px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "6px",
                  fontSize: "1rem"
                }}
              />
              {/* Upload Type Radio Buttons */}
              <div style={{
                display: "flex",
                gap: "18px",
                marginBottom: "14px",
                width: "100%",
                justifyContent: "center"
              }}>
                <label>
                  <input
                    type="radio"
                    name="uploadType"
                    value="dxf"
                    checked={uploadType === "dxf"}
                    onChange={() => setUploadType("dxf")}
                  /> DXF
                </label>
                <label>
                  <input
                    type="radio"
                    name="uploadType"
                    value="geojson"
                    checked={uploadType === "geojson"}
                    onChange={() => setUploadType("geojson")}
                  /> GeoJSON
                </label>
                <label>
                  <input
                    type="radio"
                    name="uploadType"
                    value="image"
                    checked={uploadType === "image"}
                    onChange={() => setUploadType("image")}
                  /> Image
                </label>
              </div>
              {/* File Input */}
              <input
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
                style={{
                  width: "100%",
                  marginBottom: "14px"
                }}
              />
              {error && <div style={{ color: "#dc2626", marginBottom: 12 }}>{error}</div>}
              <div style={{ display: "flex", gap: 12 }}>
                <button
                  type="button"
                  onClick={() => setShowUpload(false)}
                  style={{
                    padding: "10px 24px",
                    background: "#e5e7eb",
                    color: "#334155",
                    border: "none",
                    borderRadius: 6,
                    fontWeight: 600,
                    fontSize: 16,
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "10px 24px",
                    background: "linear-gradient(90deg, #38bdf8 0%, #2563eb 100%)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    fontWeight: 600,
                    fontSize: 16,
                    cursor: "pointer"
                  }}
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}