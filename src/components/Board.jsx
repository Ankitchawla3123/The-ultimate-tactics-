import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addoneinoptions, addplayers, ContextMenuStatechange, updatexy, updatexy2 } from '../features/players/firstboardPlayersSlice';
import { nanoid } from '@reduxjs/toolkit';
import Moveable from "react-moveable";
import useViewportResize from '../hooks/useViewportResize';
import PlayerComponent from './PlayerComponent';
import ContextMenu from './ContextMenu';
import FootballField from './Field';
import DraggablePlayerOptions from './DraggablePlayerOptions';
import useBreakpoint from '../hooks/useBreakpoint';
import { getPlayerDimensions } from '../utils/HeightAndWidthofplayer';

const Board = React.memo(() => {
  const viewportwidth = useViewportResize();
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.pointerEnabled;
  const breakpoints = useBreakpoint();

  const boardStyle = {
    width: viewportwidth + 'vw',
    height: 'auto',
    position: 'relative',
    backgroundColor: 'green',
    aspectRatio: '1.62',
  };

  const dispatch = useDispatch();
  const players = useSelector((state) => state.board1players.players);
  const [moveableTargets, setMoveableTargets] = useState([]);
  const contextmenu = useSelector((state) => state.board1players.ContextMenuState);
  const playersref = useRef([]);
  const boardRef = useRef(null);
  const contextMenuRef = useRef(null);

  // Memoized ChangeContextMenu function
  const ChangeContextMenu = useCallback((e) => {
    if (contextMenuRef.current && contextMenuRef.current.contains(e.target)) {
      return;
    }
    dispatch(ContextMenuStatechange(false));
  }, [dispatch]);

  useEffect(() => {
    window.addEventListener("click", ChangeContextMenu);
    return () => {
      window.removeEventListener("click", ChangeContextMenu);
    };
  }, [ChangeContextMenu]);

  // Memoized handleResize function
  const handleResize = useCallback(() => {
    dispatch(updatexy()); // Updates x and y from xy2

    // Remove transform property from all moveable targets
    playersref.current.forEach(playerRef => {
      if (playerRef) {
        playerRef.style.transform = ''; // Clear transform property
      }
    });
  }, [dispatch]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial update on mount

    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  useEffect(() => {
    playersref.current = playersref.current.filter(ref => ref !== null);
    setMoveableTargets(playersref.current);
  }, [players]);

  const options = useSelector((state) => state.board1players.Playeroptions);
  const optionindex = useSelector((state) => state.board1players.optionsindex);

  // Memoized handleDrop function
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const dimensions = getPlayerDimensions(viewportwidth);
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const playerWidth = (dimensions.width * viewportWidth) / 100; // in viewport width units
    const playerHeight = (dimensions.height * viewportHeight) / 100; // in viewport height units
    const newviewportw = (viewportWidth * viewportwidth) / 100;
    const newviewporth = (viewportHeight * viewportwidth) / 100;

    const playerOption = options[optionindex];
    const rect = boardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100 - ((playerWidth / 2) / newviewportw) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100 - ((playerHeight / 2) / newviewporth) * 100;

    dispatch(addplayers({
      id: nanoid(),
      playername: "",
      playercolor: playerOption.color,
      position: 'lb',
      playernumber: playerOption.number,
      x: x,
      y: y,
      x2: x,
      y2: y,
    }));
    dispatch(addoneinoptions());
  }, [dispatch, options, optionindex, viewportwidth]);

  // Memoized onDrag function for Moveable
  const onDrag = useCallback((e, index) => {
    e.target.style.transform = e.transform;
    if (contextmenu) {
      dispatch(ContextMenuStatechange(false));
    }

    const rect = boardRef.current.getBoundingClientRect();
    const targetRect = e.target.getBoundingClientRect();
    const x = ((targetRect.left - rect.left) / rect.width) * 100;
    const y = ((targetRect.top - rect.top) / rect.height) * 100;

    dispatch(updatexy2({ id: players[index].id, x: x, y: y }));
  }, [dispatch, contextmenu, players]);

  // Memoized onResize function for Moveable
  const onResize = useCallback((e) => {
    e.target.style.width = `${e.width}px`;
    e.target.style.height = `${e.height}px`;
    e.target.style.transform = e.drag.transform;
  }, []);

  // Memoized onRotate function for Moveable
  const onRotate = useCallback((e) => {
    e.target.style.transform = e.drag.transform;
  }, []);

  return (
    <div className="flex flex-col">
      <div
        style={boardStyle}
        className="flex justify-center items-center"
        ref={boardRef}
        onContextMenu={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <div className='w-11/12 h-auto bg-green border-red-50 border-solid border-2'>
          <FootballField />
        </div>
        {players.map((player, index) => (
          <PlayerComponent
            key={player.id}
            player={player}
            index={index}
            playersref={playersref}
          />
        ))}
        {contextmenu &&
          <div ref={contextMenuRef}>
            <ContextMenu />
          </div>
        }
        {moveableTargets.map((target, index) => (
          <Moveable
            key={index}
            target={target}
            draggable={true}
            throttleDrag={0}
            pinchable={true}
            edgeDraggable={false}
            startDragRotate={0}
            throttleDragRotate={0}
            resizable={false}
            keepRatio={false}
            throttleResize={1}
            renderDirections={["nw", "n", "ne", "w", "e", "sw", "s", "se"]}
            rotatable={false}
            throttleRotate={0}
            rotationPosition={"top"}
            bounds={{ "left": 0, "top": 0, "right": 0, "bottom": 0, "position": "css" }}
            snappable={true}

            onBound={e => {
              console.log(e);
            }}

            onDrag={e => onDrag(e, index)}

            onResize={onResize}
            onRotate={onRotate}
            style={{ border: 'none', boxShadow: 'none' }} // Inline style
          />
        ))}
      </div>
      <div className="flex items-center">
        <DraggablePlayerOptions />
      </div>
    </div>
  );
});

export default Board;
