import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { ContextMenuStatechange, setContextMenuDetails } from '../features/players/firstboardPlayersSlice.js';
import chroma from 'chroma-js';

function PlayerComponent({ player, index, playersref }) {
  const playerRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    // Update the reference to the player element
    playersref.current[index] = playerRef.current;
  }, [index, playersref]);

  // Determine text color based on the player's color
  const getTextColor = (color) => {
    const luminance = chroma(color).luminance();
    return luminance > 0.5 ? '#000000' : '#ffffff'; // Black for light, white for dark
  };

  // Generate outer ring color based on inner ring color
  const getOuterRingColor = (innerColor) => {
    return chroma(innerColor).darken(1.5).hex(); // Darken the color
  };
  

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

    if (playerRef.current) {
      const playerRect = playerRef.current.getBoundingClientRect();
      const boardRect = playerRef.current.closest('.flex').getBoundingClientRect(); // Assuming the parent board is in a flex container

      // Calculate the position for the context menu
      const adjustedX = playerRect.left - boardRect.left; // Position relative to board
      const adjustedY = playerRect.bottom - boardRect.top; // Position right below player

      dispatch(ContextMenuStatechange(true)); // Show the context menu
      dispatch(setContextMenuDetails({ id: player.id, x: adjustedX, y: adjustedY }));
      console.log("Context Menu position updated");
    }
  };

  const textColor = getTextColor(player.playercolor);
  const outerRingColor = getOuterRingColor(player.playercolor);

  return (
    <div
      style={playerStyle}
      className="moveable-target"
      ref={playerRef}
      onContextMenu={handleContextMenu} // Handle context menu
    >
      <div className="w-3/4 p-0 m-0 text-center text-sm">
        {player.name}
      </div>
      <svg
        style={svgStyle}
        viewBox="0 0 50 50"
        preserveAspectRatio="xMidYMid meet"
      >
        <circle
          className="svg-player-shape"
          r="19.3"
          fill={player.playercolor}
          cx="25"
          cy="25"
        />
        <text
          className="svg-player-number  font-bold"
          textAnchor="middle"
          fontSize="22"
          fill={textColor} // Set text color based on background color
          x="25"
          y="27"
          dominantBaseline="middle"
          
        >
          {player.playernumber}
        </text>
        <circle
          r="19.3"
          strokeWidth="5"
          fill="none"
          stroke={outerRingColor} // Set outer ring color based on inner ring color
          cx="25"
          cy="25"
        />
      </svg>
    </div>
  );
}

export default PlayerComponent;
