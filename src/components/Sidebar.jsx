import { useEffect, useState } from 'react';
import { Button, Dropdown, OverlayTrigger, Tooltip, ButtonGroup, Alert } from 'react-bootstrap';
import { Cursor, VectorPen, GeoAlt, Type, Trash, ArrowCounterclockwise, ArrowClockwise } from 'react-bootstrap-icons';
import { fetchFloors } from '../utils/api';
import { useHistory } from "../context/HistoryContext";

const FloorDropdown = ({organizationId, selectedFloor, setSelectedFloor}) => {
  const [allFloors, setAllFloors] = useState([]);
  
  useEffect(() => {
    const loadFloors = async () => {
      try {
        const data = await fetchFloors(organizationId);
        console.log('Loaded Floors Data:', data);
        const extractedFloors = data.map( (d) => d.id);
        setAllFloors(extractedFloors);
        setSelectedFloor(extractedFloors && extractedFloors[0]);
      } catch (err) {
        // setError('Failed to load floors. Please try again later.');
      }
    };

    loadFloors();
  }, []);
  return (
    (allFloors.length === 0) ? <Alert variant='warning'>Floors map not found</Alert> :

      <Dropdown as={ButtonGroup}>
        <Button variant="outline-secondary">{selectedFloor}</Button>

        <Dropdown.Toggle split variant="outline-secondary" id="dropdown-split-basic" />

        <Dropdown.Menu>
          {allFloors.map((floor, index) => (
            <Dropdown.Item
              key={index}
              onClick={() => {
                setSelectedFloor(floor);
                console.log('Selected floor:', floor);
              }}
            >
              {floor}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
  )
}
const Sidebar = ({ organizationId, mode, setMode, editorPage, setDeleteTrigger, selectedFloor, setSelectedFloor }) => {
  const { undo, redo } = useHistory();
  const tools = [
    { name: 'select', icon: <Cursor />, label: 'Select' },
    { name: 'drawPath', icon: <VectorPen />, label: 'Draw Path' },
    { name: 'addPOI', icon: <GeoAlt />, label: 'Add POI' },
    { name: 'delete', icon: <Trash />, label: 'Delete' },
    { name: 'undo', icon: <ArrowCounterclockwise />, label: 'Undo' },
    { name: 'redo', icon: <ArrowClockwise />, label: 'Redo' }
  ];

  const handleToolSelection = (toolName) => {
    if (toolName === 'delete') {
      setDeleteTrigger(true);
    } else if (toolName === 'undo') {
      undo();
    } else if (toolName === 'redo') {
      redo();
    } else if (toolName === 'addPOI') {
      setMode(mode === 'addPOI' ? null : 'addPOI'); // Toggle addPOI mode
    } else if (toolName === 'drawPath') {
      setMode(mode === 'drawPath' ? null : 'drawPath'); // Toggle drawPath mode
    } else {
      setMode(toolName);
    }
  };

  return (
    <>
      <div style={{ position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000 }}>
        <FloorDropdown organizationId={organizationId} setSelectedFloor={setSelectedFloor} selectedFloor={selectedFloor} />
      </div>
      <div style={{
        width: '60px', backgroundColor: '#f8f9fa', padding: '10px', position: 'relative', display: 'flex',
        flexDirection: 'column', alignItems: 'center', boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)'
      }}>
        {tools.map((tool) => (
          <OverlayTrigger key={tool.name} placement="right" overlay={<Tooltip>{tool.label}</Tooltip>}>
            <Button
              variant={
                (tool.name === 'addPOI' && mode === 'addPOI') ||
                (tool.name === 'drawPath' && mode === 'drawPath')
                  ? "primary"
                  : "light"
              }
              active={
                (tool.name === 'addPOI' && mode === 'addPOI') ||
                (tool.name === 'drawPath' && mode === 'drawPath')
              }
              className="mb-2 d-flex align-items-center justify-content-center"
              style={{ width: '40px', height: '40px' }}
              onClick={() => handleToolSelection(tool.name)}
            >
              {tool.icon}
            </Button>
          </OverlayTrigger>
        ))}
      </div>
    </>
  );
};

export default Sidebar;
