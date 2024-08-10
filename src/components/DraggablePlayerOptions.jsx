import React, { useEffect, useRef, useState } from 'react';
import useViewportResize from '../hooks/useViewportResize';
import chroma from 'chroma-js';
import { useDispatch, useSelector } from 'react-redux';
import { addoneinoptions, addplayers, setOptionsIndex } from '../features/players/firstboardPlayersSlice';
import useBreakpoint from '../hooks/useBreakpoint';
import { nanoid } from '@reduxjs/toolkit';


const DraggablePlayerOptions = () => {
  const dispatch = useDispatch();
  const playerOptions = useSelector((state) => state.board1players.Playeroptions);
  const breakpoints = useBreakpoint();
  const breakpoints2 = useViewportResize();
  const [WandH, setWandH] = useState({ w: 3.55, h: 3.55 });
  const optionsref = useRef([]);
  const [highlightedIndex, setHighlightedIndex] = useState(null);

  useEffect(() => {
    if (breakpoints2 === 90) {
      setWandH({ w: 3.0, h: 3.0 });
    } else if (breakpoints2 === 60) {
      setWandH({ w: 2.0, h: 2.0 });
    } else {
      setWandH({ w: 2.00, h: 2.00 });
    }
  }, [breakpoints2]);

  const getTextColor = (color) => {
    const luminance = chroma(color).luminance();
    return luminance > 0.5 ? '#000000' : '#ffffff'; // Black for light, white for dark
  };

  const getOuterRingColor = (innerColor) => {
    return chroma(innerColor).darken(1.5).hex(); // Darken the color
  };

  const playerStyle = {
    cursor: 'pointer',
    width: `${WandH.w}vw`,  // Responsive width
    height: `${WandH.h}vw`, // Responsive height
    textAlign: 'center', // Center the text
    margin: 0,
    padding: 0,
  };

  const handleDragStart = (index) => {
    setHighlightedIndex(index)
    dispatch(setOptionsIndex(index));
  };

  const svgStyle = {
    display: 'block',
    margin: 0,
    padding: 0,
    width: '100%',
    height: '100%',
  };

  const handleRef = (index) => {
    setHighlightedIndex(index);
  };
  // const buttonFontSize = `${Math.min(WandH.w / 2.5, 16)}px`; // Adjust the divisor and max value as needed

  const buttonStyle = {
    width: `auto`,  // Same width as player circle

    height: `auto`, // Same height as player circle
     backgroundColor: '#007bff', // Adjust as needed
    color: '#ffffff',
    borderRadius: '1vw', // Rectangular shape
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.65rem', // Use responsive font size
  };
  const handleaddplayer=()=>{
    dispatch(setOptionsIndex(highlightedIndex));
    dispatch(addplayers({
      id: nanoid(),
      playername: "",
      playercolor: playerOptions[highlightedIndex].color,
      position: 'lb',
      playernumber: playerOptions[highlightedIndex].number,
      x: 50,
      y: 50,
      x2: 50,
      y2: 50,
    }));
    

    dispatch(addoneinoptions());
  

  }


  return (
    <div className={`flex gap-0 ${(breakpoints === 'md' || breakpoints === 'sm' || breakpoints === 'xs') ? 'gap-0' : 'gap-0'}`}>
      {playerOptions.map((option, index) => {
        const textColor = getTextColor(option.color);
        const outerRingColor = getOuterRingColor(option.color);

        return (
          <div
            ref={(element) => optionsref.current[index] = element}
            draggable
            onDragStart={() => handleDragStart(index)}
            key={index}
            style={playerStyle}
            className={`moveable-target ${index === highlightedIndex ? 'scale-135' : 'scale-100'} transition-transform duration-150 ease-in-out`}
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
      {(breakpoints === 'md' || breakpoints === 'sm' || breakpoints === 'xs') && (
        <button style={buttonStyle} className='ml-1 pl-2 pr-2 ' onClick={handleaddplayer}>
          Add Player
        </button>
      )}
    </div>
  );
};

export default DraggablePlayerOptions;
