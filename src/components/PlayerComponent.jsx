import React, { useEffect, useRef } from 'react';

function PlayerComponent({ player, index, playersref }) {
  const playerRef = useRef(null);

  useEffect(() => {
    playersref.current[index] = playerRef.current;
  }, [index, playersref]);

  const playerStyle = {
    top: '10%',
    position: 'absolute',
    left: '0%',
    cursor: 'pointer',
    width: '3.55vw',  // Viewport width units to ensure responsiveness
    height: '3.55vw', // Viewport height units to ensure responsiveness
  };

  return (
    <div
      style={playerStyle}
      className="moveable-target"
      ref={playerRef}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 50 50"
        preserveAspectRatio="xMidYMid meet"
      >
        <circle
          className="svg-player-shape"
          r="13"
          fill="#333333"
          cx="25"
          cy="25"
        ></circle>
        <text
          className="svg-player-number"
          textAnchor="middle"
          fontSize="14"
          fill="#ffffff"
          x="25"
          y="27"
          dominantBaseline="middle"
        >
          {player.playernumber}
        </text>
        <circle
          r="13"
          strokeWidth="2"
          fill="none"
          stroke="#2b2b2b"
          cx="25"
          cy="25"
        ></circle>
      </svg>
    </div>
  );
}

export default PlayerComponent;
