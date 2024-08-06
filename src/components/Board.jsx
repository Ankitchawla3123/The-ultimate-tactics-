import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addplayers , changeplayername } from '../features/players/firstboardPlayersSlice.js';
import { nanoid } from '@reduxjs/toolkit';
import Moveable from "react-moveable";
import useViewportResize from '../hooks/useViewportResize.js';
import PlayerComponent from './PlayerComponent.jsx';
import ContextMenu from './ContextMenu.jsx';
import FootballField from './Field.jsx';

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
  const [contextMenu, setContextMenu] = useState(false);
  const playersref = useRef([]);
  const boardRef = useRef(null);

  



  useEffect(() => {
    playersref.current = playersref.current.filter(ref => ref !== null);
    setMoveableTargets(playersref.current);
  }, [players]);

  

  const addAplayer = () => {
    dispatch(addplayers({ id: nanoid(),playername:"",playercolor:"#000000", position: 'lb', playernumber: 2 }));
  };




  return (
    <div className="flex flex-col items-center">
      <div style={boardStyle} className="flex justify-center items-center" ref={boardRef} onContextMenu={(e)=>e.preventDefault()}>
        <div className='w-11/12 h-auto bg-green border-red-50 border-solid border-2'>
          <FootballField/>
        </div>
        {players.map((player, index) => (
          <PlayerComponent
            key={player.id}
            player={player}
            index={index}
            playersref={playersref}
          
          />
        ))}
        <ContextMenu />
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
      <button onClick={addAplayer} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Add Player
      </button>
    </div>
  );
}

export default Board;
