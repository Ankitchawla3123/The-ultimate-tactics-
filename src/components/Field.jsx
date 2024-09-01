import React from 'react';

function FootballField() {
  const penaltySpotRadius = 5; // Radius for the penalty spots
  const penaltyBoxX = 200; // X position of the penalty box
  const goalX = 0; // X position of the goal
  const penaltyArcRadius = 100; // Radius for the penalty arcs

  // Calculate the midpoint between the goal and the penalty box
  const midpointX = (goalX + penaltyBoxX) / 2;

  return (
    <svg
      width="100%" 
      viewBox="0 0 1600 900" // Aspect ratio 16:9
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      style={{ border: '1px solid black' }} // Optional: adds a border for visibility
    >
      {/* Field outline */}
      <rect x="0" y="0" width="1600" height="900" fill="#4CAF50" stroke="#000" strokeWidth="5" />

      {/* Center circle */}
      <circle cx="800" cy="450" r="170" fill="none" stroke="#000" strokeWidth="5" />

      {/* Penalty areas */}
      <rect x="0" y="150" width="200" height="600" fill="none" stroke="#000" strokeWidth="5" />
      <rect x="1400" y="150" width="200" height="600" fill="none" stroke="#000" strokeWidth="5" />

      {/* Smaller penalty areas */}
      <rect x="0" y="325" width="75" height="250" fill="none" stroke="#000" strokeWidth="5" />
      <rect x="1525" y="325" width="75" height="250" fill="none" stroke="#000" strokeWidth="5" />

      {/* Penalty spots */}
      <circle cx={midpointX + 28} cy="450" r={penaltySpotRadius} fill="#000" />
      <circle cx={1600 - midpointX -28} cy="450" r={penaltySpotRadius} fill="#000" />

      {/* Goals */}
      <rect x="0" y="400" width="15" height="100" fill="none" stroke="#000" strokeWidth="5" />
      <rect x="1585" y="400" width="20" height="100" fill="none" stroke="#000" strokeWidth="5" />

      {/* Center line */}
      <line x1="800" y1="0" x2="800" y2="900" stroke="#000" strokeWidth="5" />

      {/* Penalty arcs */}
      <path
        d={`M 200,${450 - penaltyArcRadius} A ${penaltyArcRadius},${penaltyArcRadius} 0 0,1 200,${450 + penaltyArcRadius}`}
        fill="none"
        stroke="#000"
        strokeWidth="5"
      />
      <path
        d={`M 1400,${450 - penaltyArcRadius} A ${penaltyArcRadius},${penaltyArcRadius} 0 0,0 1400,${450 + penaltyArcRadius}`}
        fill="none"
        stroke="#000"
        strokeWidth="5"
      />
    </svg>
  );
}

export default FootballField;
