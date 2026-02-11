# 🗺️ Floorplan Editor UI

An interactive web application for editing and managing indoor floorplans with navigation features. Built with React and Leaflet for seamless map editing, POI management, and navigation path creation.

---

## ✨ Features

### 📍 Interactive Map Editing
- **Select Mode** - Click and modify existing floorplan features
- **Draw Path Mode** - Create navigation path nodes by clicking on the map
- **Add POI Mode** - Place Points of Interest with custom labels
- **Delete** - Remove selected features with a single click
- **Undo/Redo** - Full edit history with keyboard shortcuts (Ctrl+Z / Ctrl+Y)

### 🏢 Multi-Floor Management
- Upload and manage multiple floors per organization
- Switch between floors instantly
- Support for DXF and GeoJSON file formats

### 🔧 Admin Dashboard
- Upload new floorplan data (DXF or GeoJSON)
- Access existing floorplans for editing
- Manage organization and floor data

### 🧭 Navigation Nodes
- **POI Nodes** - Points of Interest with custom labels
- **Path Nodes** - Navigation routing waypoints
- **Exit Nodes** - Configure exits with connected nodes
- Visual distinction between node types

---

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ 
- npm or yarn
- Backend API running on `http://localhost:5767` (or configure your own)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd floorplan-editor-ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_ODATA_API_BASE_URL=http://localhost:5767
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173`

---

## 📖 Usage Guide

### Getting Started with Editing

1. **Login** - Access the application through the login page
2. **Admin Dashboard** - Upload a new floorplan or select an existing one
3. **Floorplan Editor** - Use the sidebar tools to edit your floorplan:

   - **🎯 Select Mode**: Click features to select and modify them
   - **🛤️ Draw Path**: Click on the map to place navigation nodes
   - **📌 Add POI**: Click to add a Point of Interest, then fill in the label
   - **🗑️ Delete**: Select a feature first, then click delete
   - **💾 Save**: Save all your changes to the server
   - **↩️ Discard**: Revert all unsaved changes

### Keyboard Shortcuts

- `Ctrl + Z` - Undo last action
- `Ctrl + Y` - Redo action
- `Escape` - Deselect current feature

### Working with Navigation Nodes

**Adding a POI:**
1. Click "Add POI" in the sidebar
2. Click on the map where you want the POI
3. Enter a label in the modal (e.g., "Main Entrance", "Conference Room A")
4. Optionally mark as exit node and set connected node
5. Click "Add POI"

**Adding a Path Node:**
1. Click "Draw Path" in the sidebar
2. Click on the map to place path nodes
3. Nodes are automatically numbered and connected
4. Click "Select" mode when done

---

## 🏗️ Project Structure

```
floorplan-editor-ui/
├── public/
│   ├── mockFloorPlan.json      # Sample floorplan data
│   └── mockFloors.json         # Sample floor metadata
├── src/
│   ├── components/
│   │   ├── AdminDashboard.jsx   # Upload & manage floorplans
│   │   ├── FloorPlanEditor.jsx  # Main editor component
│   │   ├── GeoJsonWithSelection.jsx  # GeoJSON rendering with selection
│   │   ├── LoginPage.jsx        # Authentication page
│   │   ├── Sidebar.jsx          # Editor tools sidebar
│   │   ├── TopNavBar.jsx        # Top navigation bar
│   │   └── BottomPanel.jsx      # Bottom control panel
│   ├── context/
│   │   └── HistoryContext.jsx   # Undo/Redo state management
│   ├── utils/
│   │   └── api.js               # API service functions
│   ├── App.jsx                  # Main app component & routing
│   ├── App.css                  # Global styles
│   └── main.jsx                 # Application entry point
├── .env                         # Environment variables (create this)
├── package.json                 # Dependencies & scripts
├── vite.config.js               # Vite configuration
└── README.md                    # This file
```

---

## 🔌 API Integration

The application communicates with a backend API for all data operations.

### Required Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/floors/{orgId}` | GET | Fetch all floors for an organization |
| `/floorplans/{orgId}/{floorId}` | GET | Get floorplan GeoJSON data |
| `/features/{featureId}` | PATCH | Update feature geometry/properties |
| `/navigation-nodes/floor/poi` | GET | Get POI nodes for a floor |
| `/navigation-nodes/floor/path` | GET | Get path nodes for a floor |
| `/navigation-nodes` | POST | Create new navigation node |
| `/upload/dxf` | POST | Upload DXF file |

### API Configuration

Configure your backend URL in `.env`:
```env
VITE_ODATA_API_BASE_URL=http://your-backend-url:port
```

---

## 🛠️ Tech Stack

- **React 19** - UI framework
- **Vite** - Lightning-fast build tool
- **React Router** - Client-side routing
- **Leaflet** - Interactive mapping library
- **React-Leaflet** - React components for Leaflet
- **Leaflet Editable** - Drawing and editing features
- **Bootstrap 5** - UI components and styling
- **React Bootstrap** - Bootstrap components for React
- **Turf.js** - Geospatial analysis

---

## 📝 Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run ESLint
npm run lint
```

---

## 🎨 Customization

### Styling
- Global styles: [src/App.css](src/App.css)
- Component styles: Inline styles or Bootstrap classes
- Map marker icons: Customizable in [FloorPlanEditor.jsx](src/components/FloorPlanEditor.jsx)

### Map Configuration
Modify map settings in [FloorPlanEditor.jsx](src/components/FloorPlanEditor.jsx):
- Default zoom level
- Max zoom bounds
- Marker icons
- Map controls

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

