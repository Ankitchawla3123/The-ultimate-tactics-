import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { ContextMenuStatechange, setContextMenuDetails} from '../features/players/firstboardPlayersSlice.js';

function PlayerComponent({ player, index, playersref }) {
  const playerRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    // Update the reference to the player element
    playersref.current[index] = playerRef.current;
  }, [index, playersref]);

  const playerStyle = {
    top: '10%',
    position: 'absolute',
    left: '0%',
    cursor: 'pointer',
    width: '3.55vw',  // Responsive width
    height: '3.55vw', // Responsive height
    textAlign: 'center', // Center the text
    margin: 0,
    padding: 0,
  };

  const svgStyle = {
    display: 'block',
    margin: 0,
    padding: 0,
    width: '75%',
    height: '68%',
  };

  const handleContextMenu = (e) => {
    e.preventDefault(); // Prevent the default context menu
    dispatch(ContextMenuStatechange()); // Dispatch the action to toggle the context menu
    dispatch(setContextMenuDetails({id:player.id,x:e.pageX,y:e.pageY }))
    console.log("new")


  };

  return (
    <div
      style={playerStyle}
      className="moveable-target"
      ref={playerRef}
      onContextMenu={handleContextMenu} // Handle context menu
    >
      <svg
        style={svgStyle}
        viewBox="0 0 50 50"
        preserveAspectRatio="xMidYMid meet"
      >
        <circle
          className="svg-player-shape"
          r="19.3"
          fill="#333333"
          cx="25"
          cy="25"
        />
        <text
          className="svg-player-number"
          textAnchor="middle"
          fontSize="19"
          fill="#ffffff"
          x="25"
          y="27"
          dominantBaseline="middle"
        >
          {player.playernumber}
        </text>
        <circle
          r="19.3"
          strokeWidth="2"
          fill="none"
          stroke="#2b2b2b"
          cx="25"
          cy="25"
        />
      </svg>
      <div
       className="w-3/4 h-0 p-0 m-0 text-center text-sm" >
        {player.position}
      </div>
    </div>
  );
}

export default PlayerComponent;
