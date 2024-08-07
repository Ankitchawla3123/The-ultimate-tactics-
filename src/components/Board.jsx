import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addplayers, ContextMenuStatechange } from '../features/players/firstboardPlayersSlice';
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

  useEffect(() => {
    playersref.current = playersref.current.filter(ref => ref !== null);
    setMoveableTargets(playersref.current);
  }, [players]);

  const handleDragStart = (e, playerOption) => {
    e.dataTransfer.setData('playerOption', JSON.stringify(playerOption));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const playerOption = JSON.parse(e.dataTransfer.getData('playerOption'));
    const rect = boardRef.current.getBoundingClientRect();
    console.log(rect)
    console.log(e.clientX)
    console.log(e.clientY)
    const x =e.clientX - rect.left;
    const y = e.clientY - rect.top;
    dispatch(addplayers({
      id: nanoid(),
      playername: "",
      playercolor: playerOption.color,
      position: 'lb',
      playernumber: playerOption.number,
      x: x,
      y:y
    }));
  };

  return (
    <div className="flex flex-col items-center">
      <DraggablePlayerOptions handleDragStart={handleDragStart} />
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
    </div>
  );
}

export default Board;
