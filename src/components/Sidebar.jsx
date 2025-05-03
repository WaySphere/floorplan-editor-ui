import { useEffect, useState } from 'react';
import { Button, Dropdown, OverlayTrigger, Tooltip, ButtonGroup, Alert } from 'react-bootstrap';
import { Cursor, VectorPen, GeoAlt, Type, Trash, ArrowCounterclockwise, ArrowClockwise } from 'react-bootstrap-icons';
import { useHistory } from "../context/HistoryContext";

const FloorDropdown = () => {
  const [allFloors, setAllFloors] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState(null);
  useEffect(() => {
    fetch('/mockFloors.json').then((res) => {
      res.json().then((data) => {
        console.log('Loaded Floors Data:', data);
        setAllFloors(data.floors);
        setSelectedFloor(data.floors && data.floors[0]);
      });
    })
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
const Sidebar = ({ setMode, editorPage, setDeleteTrigger }) => {
  const { undo, redo } = useHistory();
  const tools = [
    { name: 'select', icon: <Cursor />, label: 'Select' },
    { name: 'drawPath', icon: <VectorPen />, label: 'Draw Path' },
    { name: 'addPOI', icon: <GeoAlt />, label: 'Add POI' },
    { name: 'delete', icon: <Trash />, label: 'Delete' },
    { name: 'undo', icon: <ArrowCounterclockwise />, label: 'Undo' },
    { name: 'redo', icon: <ArrowClockwise />, label: 'Redo' }
  ];

  const handleToolSelection = (event, toolName) => {
    if (event === 'select') {
      this.prototype.handleSelect();
    } else if (event === 'drawPath') {
      console.log('Undo');
    } else if (event === 'addPOI') {
      console.log('Redo');
    } else if (event === 'delete') {
      setDeleteTrigger(true);
    } else if (event === 'undo') {
      console.log('Undo');
      undo();
    } else if (event === 'redo') {
      console.log('Redo');
      redo();
    } else {
      setMode(toolName);
    }
  }

  return (
    <>
      <div style={{ position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000 }}><FloorDropdown /></div>
      <div style={{
        width: '60px', backgroundColor: '#f8f9fa', padding: '10px', position: 'relative', display: 'flex',
        flexDirection: 'column', alignItems: 'center', boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)'
      }}>
        {tools.map((tool) => (
          <OverlayTrigger key={tool.name} placement="right" overlay={<Tooltip>{tool.label}</Tooltip>}>
            <Button
              variant="light"
              className="mb-2 d-flex align-items-center justify-content-center"
              style={{ width: '40px', height: '40px' }}
              onClick={handleToolSelection.bind(null, tool.name)}
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
