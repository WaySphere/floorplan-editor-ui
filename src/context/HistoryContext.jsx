import React, { createContext, useContext, useState } from "react";

// Create Context
const HistoryContext = createContext();

// Custom Hook to Use History
export const useHistory = () => useContext(HistoryContext);

export const HistoryProvider = ({ children }) => {
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [currentState, setCurrentState] = useState(null);

  const initializeState = (feature) => {
    setUndoStack([feature.features]);
    setRedoStack([]);
  };

  const saveState = (feature) => {
    setUndoStack((prev) => [...prev, feature]);
    setRedoStack([]); // Clear redo stack
  };

  const undo = () => {
    if (undoStack.length === 1) return;
    const lastState = undoStack.pop();
    setRedoStack((prev) => [...prev, lastState]);
    setCurrentState(undoStackPeek());
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const lastRedo = redoStack.pop();
    setUndoStack((prev) => [...prev, lastRedo]);
    setCurrentState(lastRedo);
  };

  const undoStackPeek = () => {
    return undoStack.length > 0 ? undoStack[undoStack.length - 1] : null;
  };
  const redoStackPeek = () => {
    return redoStack.length > 0 ? redoStack[redoStack.length - 1] : null;
  }
  const clearHistory = () => {
    setUndoStack([]);
    setRedoStack([]);
    setCurrentState(null);
  };
  return (
    <HistoryContext.Provider value={{ initializeState, saveState, undo, redo, undoStack, redoStack, currentState, setCurrentState, clearHistory }}>
      {children}
    </HistoryContext.Provider>
  );
};
