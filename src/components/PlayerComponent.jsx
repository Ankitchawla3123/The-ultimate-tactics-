import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ContextMenuStatechange, setContextMenuDetails } from '../features/players/firstboardPlayersSlice.js';
import chroma from 'chroma-js';

import useViewportResize from '../hooks/useViewportResize.js';


function PlayerComponent({ player, index, playersref }) {
  const playerRef = useRef(null);
  const dispatch = useDispatch();
  const breakpoints=useViewportResize();
  const [WandH, setWandH] = useState({w:3.55, h:3.55})
  useEffect(()=>{
    if (breakpoints===90){
      setWandH({w:3.68,h:3.68})
    }
    else if(breakpoints===60){
      setWandH({w:2.46,h:2.46})
    }
    else{
      setWandH({w:2.30,h:2.30})
    }
  },[breakpoints])

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
    top: `${player.y}%`,
    position: 'absolute',
    left: `${player.x}%`,
    cursor: 'pointer',
    width: `${WandH.w}vw`,  // Responsive width
    height: `${WandH.w}vw`, // Responsive height
    textAlign: 'center', // Center the text
    margin: 0,
    padding: 0,
    // transform: "translate(-50%, -50%)"

  };

  const svgStyle = {
    display: 'block',
    margin: 0,
    padding: 0,
    width: '100%',
    height: '100%',
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
      <div className="w-full p-0 m-0 flex items-center justify-center">
      <div className="self-center">
      {player.name}
      </div>
        
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
