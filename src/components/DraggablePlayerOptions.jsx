import React, { useEffect, useRef, useState } from "react";
import useViewportResize from "../hooks/useViewportResize";
import chroma from "chroma-js";
import { useDispatch, useSelector } from "react-redux";
import {
  addoneinoptions,
  addplayers,
  setOptionsIndex,
} from "../features/players/firstboardPlayersSlice";
import useBreakpoint from "../hooks/useBreakpoint";
import { nanoid } from "@reduxjs/toolkit";
import { getPlayerDimensions } from "../utils/HeightAndWidthofplayer";

const DraggablePlayerOptions = () => {
  const dispatch = useDispatch();
  const playerOptions = useSelector(
    (state) => state.board1players.Playeroptions
  );
  const breakpoints = useBreakpoint();
  const breakpoints2 = useViewportResize();
  const [WandH, setWandH] = useState({ w: 3.55, h: 3.55 });
  const optionsref = useRef([]);
  const [highlightedIndex, setHighlightedIndex] = useState(null);

  useEffect(() => {
    if (breakpoints2 === 90) {
      setWandH({ w: 4.0, h: 4.0 });
    } else if (breakpoints2 === 60) {
      setWandH({ w: 2.2, h: 2.2 });
    } else {
      setWandH({ w: 2.0, h: 2.0 });
    }
  }, [breakpoints2]);

  const getTextColor = (color) => {
    const luminance = chroma(color).luminance();
    return luminance > 0.5 ? "#000000" : "#ffffff"; // Black for light, white for dark
  };

  const getOuterRingColor = (innerColor) => {
    return chroma(innerColor).darken(1.5).hex(); // Darken the color
  };

  const playerStyle = {
    cursor: "pointer",
    width: `${WandH.w}vw`, // Responsive width
    height: `${WandH.h}vw`, // Responsive height
    textAlign: "center", // Center the text
    margin: 0,
    padding: 0,
  };

  const handleDragStart = (index) => {
    setHighlightedIndex(index);
    dispatch(setOptionsIndex(index));
  };

  const svgStyle = {
    display: "block",
    margin: 0,
    padding: 0,
    width: "100%",
    height: "100%",
  };

  const handleRef = (index) => {
    setHighlightedIndex(index);
  };
  // const buttonFontSize = `${Math.min(WandH.w / 2.5, 16)}px`; // Adjust the divisor and max value as needed

  const buttonStyle = {
    width: `auto`, // Same width as player circle

    height: `auto`, // Same height as player circle
    backgroundColor: "#007bff", // Adjust as needed
    color: "#ffffff",
    borderRadius: "1vw", // Rectangular shape
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    cursor: "pointer",
    fontSize: "0.65rem", // Use responsive font size
  };
  const handleaddplayer = () => {
    if (highlightedIndex === null) return;
    console.log(breakpoints);
    const dimensions = getPlayerDimensions(breakpoints2);
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const playerWidth = (dimensions.width * viewportWidth) / 100; // in viewport width units
    const playerHeight = (dimensions.height * viewportHeight) / 100; // in viewport height units
    const newviewportw = (viewportWidth * breakpoints2) / 100;
    const newviewporth = (viewportHeight * breakpoints2) / 100;

    // Calculate the top-left position for the player's center to be at the desired percentage
    const xPosition = 50 - (playerWidth / 2 / newviewportw) * 100; // Center adjustment for x
    const yPosition = 50 - (playerHeight / 2 / newviewporth) * 100; // Center adjustment for y
    console.log(xPosition);

    dispatch(setOptionsIndex(highlightedIndex));
    dispatch(
      addplayers({
        id: nanoid(),
        playername: "",
        playercolor: playerOptions[highlightedIndex].color,
        position: "lb",
        playernumber: playerOptions[highlightedIndex].number,
        x: xPosition,
        y: yPosition,
        x2: xPosition,
        y2: yPosition,
      })
    );

    dispatch(addoneinoptions());
  };

  return (
    <div
      className={`flex gap-0 ${
        breakpoints === "md" || breakpoints === "sm" || breakpoints === "xs"
          ? "gap-0"
          : "gap-0"
      }`}
    >
      {playerOptions.map((option, index) => {
        const textColor = getTextColor(option.color);
        const outerRingColor = getOuterRingColor(option.color);

        return (
          <div
            ref={(element) => (optionsref.current[index] = element)}
            draggable
            onDragStart={() => handleDragStart(index)}
            key={index}
            style={playerStyle}
            className={`moveable-target ${
              index === highlightedIndex ? "scale-135" : "scale-100"
            } transition-transform duration-150 ease-in-out`}
            onClick={() => handleRef(index)}
          >
            <svg
              style={svgStyle}
              viewBox="0 0 50 50"
              preserveAspectRatio="xMidYMid meet"
            >
              <circle
                className="svg-player-shape"
                r="19.3"
                fill={option.color}
                cx="25"
                cy="25"
              />
              <text
                className="svg-player-number font-bold"
                textAnchor="middle"
                fontSize="22"
                fill={textColor}
                x="25"
                y="27"
                dominantBaseline="middle"
              >
                {option.number}
              </text>
              <circle
                r="19.3"
                strokeWidth="5"
                fill="none"
                stroke={outerRingColor}
                cx="25"
                cy="25"
              />
            </svg>
          </div>
        );
      })}
      {(breakpoints === "md" ||
        breakpoints === "sm" ||
        breakpoints === "xs") && (
        <button
          style={buttonStyle}
          className="ml-1 pl-2 pr-2 "
          onClick={handleaddplayer}
        >
          Add Player
        </button>
      )}
    </div>
  );
};

export default DraggablePlayerOptions;
