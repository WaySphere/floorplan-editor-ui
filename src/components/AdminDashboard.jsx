import { useNavigate } from "react-router-dom";
import { FaUpload, FaEdit, FaUserCircle } from "react-icons/fa";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleUpload = () => {
    // TODO: Implement DXF upload logic or open upload modal
    alert("DXF upload logic goes here!");
  };

  const handleEditExisting = () => {
    navigate("/editor");
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
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 10 }}>Upload DXF File</div>
            <div style={{ color: "#64748b", fontSize: 15, marginBottom: 18, textAlign: "center" }}>
              Import a new floorplan by uploading a DXF file.
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
      </main>
    </div>
  );
}