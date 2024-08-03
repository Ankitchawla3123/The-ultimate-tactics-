import React from 'react'
import { useDispatch, useSelector } from 'react-redux';

function ContextMenu() {
  const { x, y } = useSelector(state => state.board1players.ContextMenusave); // Adjust path if needed
  const styling={
    left:x,
    top:y,
    transform: ""

  } 
  return (
    <div style={styling} className=" absolute w-10 h-10 bg-red-500 text-white">
      yo 
    </div>
  )
}

export default ContextMenu