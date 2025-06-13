import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const BottomPanel = ({ setSaveStatus }) => {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 20px'
    }}>
      {/* Left: Quit Editor */}
      <Button variant="secondary" onClick={() => navigate("/dashboard")}>
        Quit Editor
      </Button>
      {/* Right: Save & Discard */}
      <div>
        <Button variant="primary" className="me-2" onClick={() => setSaveStatus(1)}>
          Save
        </Button>
        <Button variant="outline-danger" onClick={() => setSaveStatus(-1)}>
          Discard
        </Button>
      </div>
    </div>
  );
};

export default BottomPanel;