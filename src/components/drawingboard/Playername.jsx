import React, { useEffect, useState } from "react";
import useViewportResize from "../../hooks/useViewportResize";

function Playername({ player, index }) {
  const [WandH, setWandH] = useState({ w: 3.55, h: 3.55 });
  const breakpoints = useViewportResize();

  useEffect(() => {
    if (breakpoints === 90) {
      setWandH({ w: 3.68, h: 3.68 });
    } else if (breakpoints === 60) {
      setWandH({ w: 2.46, h: 2.46 });
    } else {
      setWandH({ w: 2.3, h: 2.3 });
    }
  }, [breakpoints]);

  const getRadius = () => {
    const viewportWidth = window.innerWidth;
    switch (WandH.w) {
      case 3.68:
        return (1.42 / 100) * viewportWidth; // Convert 1.42vw to pixels
      case 2.46:
        return (0.95 / 100) * viewportWidth; // Convert 0.95vw to pixels
      default:
        return (0.89 / 100) * viewportWidth; // Convert 0.89vw to pixels
    }
  };

  return (
    <text
      style={{ userSelect: "none" }} // Disable text selection
      x={player.x}
      y={player.y - 1.8 * getRadius()}
      dominantBaseline="middle"
      textAnchor="middle"
    >
      {player.name}
    </text>
  );
}

export default Playername;
