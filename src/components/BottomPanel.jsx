import React from 'react';
import { Button } from 'react-bootstrap';

const BottomPanel = ({setSaveStatus}) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px' }}>
      <Button variant="primary" className="me-2" onClick={() => {setSaveStatus(1)}}>Save</Button>
      <Button variant="outline-danger" onClick={() => {setSaveStatus(-1)}}>Discard</Button>
    </div>
  );
};

export default BottomPanel;