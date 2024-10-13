import React, { useEffect, useRef, useState, useCallback, memo } from "react";
import { useDispatch } from "react-redux";
import chroma from "chroma-js";
import {
  ContextMenuStatechange,
  setContextMenuDetails,
} from "../../features/players/firstboardPlayersSlice.js";
import useViewportResize from "../../hooks/useViewportResize.js";

const PlayerComponent2 = memo(
  ({ player, index, startdragline, startDragging, setDragelement }) => {
    const playerRef = useRef(null);
    const dispatch = useDispatch();
    const breakpoints = useViewportResize();
    const [WandH, setWandH] = useState({ w: 3.55, h: 3.55 });

    useEffect(() => {
      if (breakpoints === 90) {
        setWandH({ w: 3.68, h: 3.68 });
      } else if (breakpoints === 60) {
        setWandH({ w: 2.46, h: 2.46 });
      } else {
        setWandH({ w: 2.3, h: 2.3 });
      }
    }, [breakpoints]);

    const getTextColor = useCallback((color) => {
      const luminance = chroma(color).luminance();
      return luminance > 0.5 ? "#000000" : "#ffffff";
    }, []);

    const getOuterRingColor = useCallback((innerColor) => {
      return chroma(innerColor).darken(1.5).hex();
    }, []);

    const handleContextMenu = useCallback(
      (e) => {
        e.preventDefault();
        if (playerRef.current) {
          const playerRect = playerRef.current.getBoundingClientRect();
          const boardRect = playerRef.current
            .closest(".flex")
            .getBoundingClientRect();
          const adjustedX = playerRect.left - boardRect.left;
          const adjustedY = playerRect.bottom - boardRect.top;

          dispatch(ContextMenuStatechange(true));
          dispatch(
            setContextMenuDetails({ id: player.id, x: adjustedX, y: adjustedY })
          );
        }
      },
      [dispatch, player.id]
    );

    const getRadius = () => {
      switch (WandH.w) {
        case 3.68:
          return "1.42vw"; // Radius for 3.68
        case 2.46:
          return "0.95vw"; // Radius for 2.46
        default:
          return "0.89vw"; // Radius for 2.3
      }
    };

    const getStrokeWidth = () => {
      switch (WandH.w) {
        case 3.68:
          return "0.4vw"; // Stroke width for 3.68
        case 2.46:
          return "0.256vw"; // Stroke width for 2.46
        default:
          return "0.25vw"; // Stroke width for 2.3
      }
    };

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

    const onLongPress = useCallback((element, callback) => {
      let timer;
      const startPress = () => {
        timer = setTimeout(() => {
          timer = null;
          callback();
        }, 700); // Trigger after 700ms
      };

      const cancel = () => {
        if (timer) {
          clearTimeout(timer);
        }
      };

      element.addEventListener("touchstart", startPress, { passive: true });
      element.addEventListener("touchend", cancel, { passive: true });
      element.addEventListener("touchmove", cancel, { passive: true });

      return () => {
        element.removeEventListener("touchstart", startPress);
        element.removeEventListener("touchend", cancel);
        element.removeEventListener("touchmove", cancel);
      };
    }, []);

    useEffect(() => {
      if (playerRef.current) {
        const cleanUp = onLongPress(playerRef.current, () => {
          handleContextMenu(new Event("contextmenu"));
        });

        return () => cleanUp();
      }
    }, [handleContextMenu, onLongPress]);

    const textColor = getTextColor(player.playercolor);
    const outerRingColor = getOuterRingColor(player.playercolor);

    return (
      <g
        onMouseDown={(e) => {
          e.stopPropagation();
          startdragline(e);
          setDragelement({ type: "player", index: index });
        }}
        onMouseUp={() => {}}
        ref={playerRef}
        onContextMenu={handleContextMenu}
        width={`${WandH.w}vw`}
        height={`${WandH.h}vw`}
      >
        {/* Inner circle (Player color) */}
        <circle
          className="svg-player-shape"
          r={getRadius()} // Use getRadius function here
          fill={player.playercolor}
          cx={`${player.x}%`} // Set cx as a percentage
          cy={`${player.y}%`} // Set cy as a percentage
        />

        {/* Text inside the circle (Player number) */}
        <text
          style={{ userSelect: "none" }} // Disable text selection
          className="svg-player-number font-bold"
          textAnchor="middle"
          fontSize={fontsize()}
          fill={textColor}
          x={`${player.x}%`} // Center text horizontally
          y={`${player.y}%`} // Center text vertically
          dominantBaseline="middle"
        >
          {player.playernumber}
        </text>

        {/* Outer ring (Darker color) */}
        <circle
          r={getRadius()} // Use getRadius function here
          strokeWidth={getStrokeWidth()} // Use getStrokeWidth function here
          fill="none"
          stroke={outerRingColor}
          cx={`${player.x}%`} // Center outer circle horizontally
          cy={`${player.y}%`} // Center outer circle vertically
        />
      </g>
    );
  }
);

export default PlayerComponent2;
