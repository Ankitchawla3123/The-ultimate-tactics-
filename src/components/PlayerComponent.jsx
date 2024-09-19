import React, { useEffect, useRef, useState, useCallback, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ContextMenuStatechange, setContextMenuDetails } from '../features/players/firstboardPlayersSlice.js';
import chroma from 'chroma-js';
import useViewportResize from '../hooks/useViewportResize.js';

const PlayerComponent = memo(({ player, index, playersref, onMouseEnter, onMouseLeave, onTouchStart, onTouchEnd, zIndex , onMouseMove}) => {
  const playerRef = useRef(null);
  const dispatch = useDispatch();
  const breakpoints = useViewportResize();
  const [WandH, setWandH] = useState({ w: 3.55, h: 3.55 });
  const drawdragcheck=useSelector((state)=> state.board1players.drawordragstarted)

  useEffect(() => {
    if (breakpoints === 90) {
      setWandH({ w: 3.68, h: 3.68 });
    } else if (breakpoints === 60) {
      setWandH({ w: 2.46, h: 2.46 });
    } else {
      setWandH({ w: 2.30, h: 2.30 });
    }
  }, [breakpoints]);

  useEffect(() => {
    playersref.current[index] = playerRef.current;
  }, [index, playersref]);

  const getTextColor = useCallback((color) => {
    const luminance = chroma(color).luminance();
    return luminance > 0.5 ? '#000000' : '#ffffff';
  }, []);

  const getOuterRingColor = useCallback((innerColor) => {
    return chroma(innerColor).darken(1.5).hex();
  }, []);

  const playerStyle = {
    top: `${player.y}%`,
    position: 'absolute',
    left: `${player.x}%`,
    width: `${WandH.w}vw`,
    height: `${WandH.h}vw`,
    textAlign: 'center',
    margin: 0,
    padding: 0,
    // **Apply zIndex here**
    zIndex,
    pointerEvents: `${drawdragcheck?'none':'auto'}`
   };

  const svgStyle = {
    display: 'block',
    margin: 0,
    padding: 0,
    width: '100%',
    height: '100%',
  };

  const handleContextMenu = useCallback((e) => {
    e.preventDefault();
    if (playerRef.current) {
      const playerRect = playerRef.current.getBoundingClientRect();
      const boardRect = playerRef.current.closest('.flex').getBoundingClientRect();

      const adjustedX = playerRect.left - boardRect.left;
      const adjustedY = playerRect.bottom - boardRect.top;

      dispatch(ContextMenuStatechange(true));
      dispatch(setContextMenuDetails({ id: player.id, x: adjustedX, y: adjustedY }));
    }
  }, [dispatch, player.id]);

  const onLongPress = useCallback((element, callback) => {
    let timer;
    const startPress = () => {
      timer = setTimeout(() => {
        timer = null;
        callback();
      }, 700);
    };

    const cancel = () => {
      clearTimeout(timer);
    };

    element.addEventListener('touchstart', startPress, { passive: true });
    element.addEventListener('touchend', cancel, { passive: true });
    element.addEventListener('touchmove', cancel, { passive: true });

    return () => {
      element.removeEventListener('touchstart', startPress, { passive: true });
      element.removeEventListener('touchend', cancel, { passive: true });
      element.removeEventListener('touchmove', cancel, { passive: true });
    };
  }, []);

  useEffect(() => {
    if (playerRef.current) {
      const cleanUp = onLongPress(playerRef.current, () => {
        handleContextMenu(new Event('contextmenu'));
      });

      return () => cleanUp();
    }
  }, [handleContextMenu, onLongPress]);

  const textColor = getTextColor(player.playercolor);
  const outerRingColor = getOuterRingColor(player.playercolor);

  return (
    <div
      style={playerStyle}
      className="moveable-target"
      ref={playerRef}
      onContextMenu={handleContextMenu}
      // **Add touch event handlers here**
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      // onMouseEnter={onMouseEnter}
      // onMouseLeave={onMouseLeave}
      // onMouseMove={onMouseMove}
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
          className="svg-player-number font-bold"
          textAnchor="middle"
          fontSize="22"
          fill={textColor}
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
          stroke={outerRingColor}
          cx="25"
          cy="25"
        />
      </svg>
    </div>
  );
});

export default PlayerComponent;
