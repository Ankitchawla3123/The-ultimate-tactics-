import React from 'react';
import { useSelector } from 'react-redux';

function ContextMenu() {
  const { x, y } = useSelector(state => state.board1players.ContextMenusave); // Adjust path if needed
  

  
  // Calculate position relative to the board
  const styling = {
    left: x,
    top: y,
    position: "absolute",
    transform: "translate(20%,20%)"
  };

  return (
    <div style={styling} className="absolute w-10 h-10 bg-red-500 text-white">
      yo
    </div>
  );
}

export default ContextMenu;
