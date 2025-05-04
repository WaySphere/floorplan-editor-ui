import BottomPanel from "./components/BottomPanel";
import FloorPlanEditor from "./components/FloorPlanEditor";
import Sidebar from "./components/SideBar";
import TopNavbar from "./components/TopNavBar";
import { useRef, useState } from "react";
import {HistoryProvider} from "./context/HistoryContext";

export default function App() {
  const [mode, setMode] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteTrigger, setDeleteTrigger] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [saveStatus, setSaveStatus] = useState(0);
  const editorRef = useRef();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', position: 'relative' }}>
      {/* Top Navbar */}
      <div style={{ flexShrink: 0 }}>
        <TopNavbar />
      </div>

      {/* Middle Section */}
      <div style={{ display: 'flex', flexGrow: 1, position: 'relative', overflow: 'hidden' }}>
        <HistoryProvider>
        <Sidebar setMode={setMode} editorPage={editorRef} setDeleteTrigger={setDeleteTrigger} selectedFloor={selectedFloor} setSelectedFloor={setSelectedFloor} />
        <div ref={editorRef} style={{ flexGrow: 1, position: 'relative' }}>
          <FloorPlanEditor setSelectedItem={setSelectedItem} setDeleteTrigger={setDeleteTrigger} deleteTrigger={deleteTrigger} selectedFloor={selectedFloor} saveStatus={saveStatus} setSaveStatus={setSaveStatus} />
        </div>
        </HistoryProvider>
      </div>

      {/* Bottom Panel - Fixed */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        backgroundColor: '#f8f9fa',
        boxShadow: '0 -2px 5px rgba(0, 0, 0, 0.1)',
        zIndex: 1000
      }}>
        <BottomPanel
          setSaveStatus={setSaveStatus}
        />
      </div>
    </div>
  );
}
