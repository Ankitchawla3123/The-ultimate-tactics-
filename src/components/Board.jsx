import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addoneinoptions, addplayers, ContextMenuStatechange, updatexy, updatexy2 } from '../features/players/firstboardPlayersSlice';
import { nanoid } from '@reduxjs/toolkit';
import Moveable from "react-moveable";
import useViewportResize from '../hooks/useViewportResize';
import PlayerComponent from './PlayerComponent';
import ContextMenu from './ContextMenu';
import FootballField from './Field';
import DraggablePlayerOptions from './DraggablePlayerOptions';

function Board() {
  const viewportwidth = useViewportResize();

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

  useEffect(() => {
    const ChangeContextMenu = (e) => {
      if (contextMenuRef.current && contextMenuRef.current.contains(e.target)) {
        return;
      }
    
      dispatch(ContextMenuStatechange(false));
    };
    window.addEventListener("click", ChangeContextMenu);
    return () => {
      window.removeEventListener("click", ChangeContextMenu);
    };
  }, [dispatch]);

  const handleResize = () => {
    dispatch(updatexy()); // Updates x and y from xy2
  
    // Remove transform property from all moveable targets
    playersref.current.forEach(playerRef => {
      if (playerRef) {
        playerRef.style.transform = ''; // Clear transform property
      }
    });
  };
  
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial update on mount
  
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  

  useEffect(() => {
    playersref.current = playersref.current.filter(ref => ref !== null);
    setMoveableTargets(playersref.current);
  }, [players]);

  const options=useSelector((state)=>state.board1players.Playeroptions)
  const optionindex=useSelector((state)=>state.board1players.optionsindex)

  const handleDrop = (e) => {
    e.preventDefault();

    const playerOption =options[optionindex] ;
    console.log(playerOption)
    const rect = boardRef.current.getBoundingClientRect();
    console.log(rect)
    console.log(e.clientX)
    console.log(e.clientY)
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
  
    dispatch(addplayers({
      id: nanoid(),
      playername: "",
      playercolor: playerOption.color,
      position: 'lb',
      playernumber: playerOption.number,
      x: x,
      y:y,
      x2:x,
      y2:y,
    }));
    dispatch(addoneinoptions())
  };

  return (
    <div className="flex flex-col ">
      
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
            key={players[index].id}
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
onDrag={e => {
  e.target.style.transform = e.transform;
  if (contextmenu) {
    dispatch(ContextMenuStatechange(false));
  }

  const rect = boardRef.current.getBoundingClientRect();
  const targetRect = e.target.getBoundingClientRect();
  const x = ((targetRect.left - rect.left) / rect.width) * 100;
  const y = ((targetRect.top - rect.top) / rect.height) * 100;
  
  dispatch(updatexy2({ id: players[index].id, x: x, y: y }));
}}
            
            
            
            
            onResize={e => {
              e.target.style.width = `${e.width}px`;
              e.target.style.height = `${e.height}px`;
              e.target.style.transform = e.drag.transform;
            }}
            onRotate={e => {
              e.target.style.transform = e.drag.transform;
            }}
            style={{ border: 'none', boxShadow: 'none' }} // Inline style
          />
        ))}
      </div>
      <div>
      <DraggablePlayerOptions />
      </div>
      
    </div>
  );
}

export default Board;
