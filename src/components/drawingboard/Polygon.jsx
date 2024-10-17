import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  changeContextMenutype,
  ContextMenuStatechange,
  setContextMenuDetails,
  setshapecolorforcontextmenu,
} from "../../features/players/firstboardPlayersSlice";

// Utility function to debounce a function
const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

function Polygon({
  polygon, // Array of points in percentage form (e.g., [[10, 20], [30, 40], ...])
  svgRef, // Reference to the SVG element
  startdragline,
  setDragelement,
  index: polygonIndex,
  startDragging,
  setOveranobject,
  color,
  polypointsemptychk,
}) {
  const [pixelPoints, setPixelPoints] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    const calculatePixelPoints = () => {
      const svgWidth = svgRef.current.clientWidth; // Get width from ref
      const svgHeight = svgRef.current.clientHeight; // Get height from ref

      const newPoints = polygon.map((point) => {
        const x = (point[0] / 100) * svgWidth; // Convert percentage to pixel
        const y = (point[1] / 100) * svgHeight; // Convert percentage to pixel
        return `${x},${y}`;
      });
      setPixelPoints(newPoints);
    };

    const debouncedCalculatePixelPoints = debounce(calculatePixelPoints, 100); // Debounce function

    calculatePixelPoints(); // Calculate points on mount
    window.addEventListener("resize", debouncedCalculatePixelPoints); // Recalculate on resize

    return () => {
      window.removeEventListener("resize", debouncedCalculatePixelPoints); // Clean up on unmount
    };
  }, [polygon, svgRef]); // Depend on polygon and svgRef

  const handleContextMenu = useCallback(
    (e) => {
      // if (!polypointsemptychk) {
      //   return;
      // }
      console.log(color);
      e.preventDefault();
      if (svgRef.current) {
        const svgRect = svgRef.current.getBoundingClientRect();
        const adjustedX = e.clientX - svgRect.left;
        const adjustedY = e.clientY - svgRect.top;

        dispatch(ContextMenuStatechange(true));
        dispatch(changeContextMenutype("shape"));
        dispatch(setshapecolorforcontextmenu(color));
        dispatch(
          setContextMenuDetails({
            type: "polygon",
            id: polygonIndex,
            x: adjustedX,
            y: adjustedY,
          })
        );
      }
    },
    [dispatch, polygonIndex, svgRef, color]
  );

  return (
    <g onContextMenu={handleContextMenu}>
      <polygon
        points={pixelPoints.join(" ")} // Use converted points
        style={{ cursor: "", zIndex: "20" }}
        stroke={color}
        fill={color}
        fillOpacity={0.4}
        strokeWidth="2"
        strokeLinecap="round"
        onMouseDown={(e) => {
          e.stopPropagation();
          startdragline(e);
          setDragelement({ type: "polygon", index: polygonIndex });
          // setOveranobject(true)
        }}
      />
      {polygon.map((point, index) => {
        const x = (point[0] / 100) * svgRef.current.clientWidth; // Convert percentage to pixel
        const y = (point[1] / 100) * svgRef.current.clientHeight; // Convert percentage to pixel
        return (
          <circle
            key={index}
            cx={x}
            cy={y}
            r="5"
            fill="blue"
            cursor="pointer"
            onMouseDown={(event) => {
              event.stopPropagation();
              setDragelement({
                type: "polygon",
                index: index,
                index2: polygonIndex,
              });
              startDragging(event, "polygon");
            }}
          />
        );
      })}
    </g>
  );
}

export default Polygon;
