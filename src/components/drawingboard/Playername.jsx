import React, { useEffect, useState } from "react";
import useViewportResize from "../../hooks/useViewportResize";

function Playername({ player, index, svgRef }) {
  const [WandH, setWandH] = useState({ w: 3.55, h: 3.55 });
  const breakpoints = useViewportResize();

  useEffect(() => {
    if (breakpoints === 94.824) {
      setWandH({ w: 3.68, h: 3.68 });
    } else if (breakpoints === 63.216) {
      setWandH({ w: 2.46, h: 2.46 });
    } else {
      setWandH({ w: 2.3, h: 2.3 });
    }
  }, [breakpoints]);

  const fontsize = () => {
    switch (WandH.w) {
      case 3.68:
        return "1.619vw"; // Font size for 3.68
      case 2.46:
        return "1.084vw"; // Font size for 2.46
      default:
        return "1.01vw"; // Font size for 2.3
    }
  };

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

  // Extract the height of the SVG container from the reference
  const svgHeight = svgRef.current ? svgRef.current.clientHeight : 0;

  // Calculate the adjustment for y based on the height and radius (in pixels)
  const yAdjustment = ((1.7 * getRadius()) / svgHeight) * 100; // Convert the adjustment to percentage

  return (
    <text
      style={{ userSelect: "none" }} // Disable text selection
      x={`${player.x}%`} // Keep percentage for x
      y={`${player.y - yAdjustment}%`} // Adjust y based on the radius, but keep percentage
      dominantBaseline="middle"
      textAnchor="middle"
      fontSize={fontsize()}
    >
      {player.name}
    </text>
  );
}

export default Playername;
