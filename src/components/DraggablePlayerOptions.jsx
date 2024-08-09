import React, { useEffect, useState } from 'react';
import useViewportResize from '../hooks/useViewportResize';
import chroma from 'chroma-js';
import { useDispatch, useSelector } from 'react-redux';
import { setOptionsIndex } from '../features/players/firstboardPlayersSlice';



const DraggablePlayerOptions = () => {
  const dispatch=useDispatch()
  const playerOptions=useSelector((state)=>state.board1players.Playeroptions)
  const breakpoints = useViewportResize();
  const [WandH, setWandH] = useState({ w: 3.55, h: 3.55 });

  useEffect(() => {
    if (breakpoints === 90) {
      setWandH({ w: 5.71-1.8, h: 5.71 });
    } else if (breakpoints === 60) {
      setWandH({ w: 3.80-1.2, h: 3.80 });
    } else {
      setWandH({ w: 3.55-0.9, h: 3.55 });
    }
  }, [breakpoints]);

  const getTextColor = (color) => {
    const luminance = chroma(color).luminance();
    return luminance > 0.5 ? '#000000' : '#ffffff'; // Black for light, white for dark
  };

  // Generate outer ring color based on inner ring color
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
    // cursor: 'grab'
    //     display: 'flex',
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     margin: '0 5px',
        
  };

  const handleDragStart=(index)=>{
    dispatch(setOptionsIndex(index))
  }

  const svgStyle = {
    display: 'block',
    margin: 0,
    padding: 0,
    width: '75%',
    height: '68%',
  };

  // const handleDragStart(e,option){

  // }


  return (
    <div className="flex">
      {playerOptions.map((option, index) => {
        const textColor = getTextColor(option.color);
        const outerRingColor = getOuterRingColor(option.color);

        return (
          <div
            draggable
            onDragStart={() => handleDragStart( index)}
            key={index}
            style={playerStyle}
            className="moveable-target" // Handle context menu
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
                fill={textColor} // Set text color based on background color
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
                stroke={outerRingColor} // Set outer ring color based on inner ring color
                cx="25"
                cy="25"
              />
            </svg>
          </div>
        );
      })}
    </div>
  );
};

export default DraggablePlayerOptions;

        // <div
        //   key={index}
        //   draggable
        //   onDragStart={(e) => handleDragStart(e, option)}
        //   style={{
        //     width: '40px',
        //     height: '40px',
        //     borderRadius: '50%',
        //     backgroundColor: option.color,
        //     display: 'flex',
        //     justifyContent: 'center',
        //     alignItems: 'center',
        //     margin: '0 5px',
        //     cursor: 'grab',
        //   }}
        // >
        //   {option.number}
        // </div>