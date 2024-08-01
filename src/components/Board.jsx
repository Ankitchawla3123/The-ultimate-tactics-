import React, { useState, useEffect, useRef } from 'react';
import usePlayerData from '../hooks/usePlayerData.js';
import Moveable from "react-moveable";
import useViewportResize from '../hooks/useViewportResize.js';
import { useDispatch, useSelector } from 'react-redux';
import { addplayers, setPlayersRef , removeplayer } from '../features/players/firstboardPlayersSlice.js';
import { nanoid } from '@reduxjs/toolkit';



function Board({ children }) {
  const viewportwidth = useViewportResize();
  const boardStyle = {
    width: viewportwidth + 'vw',
    height: 'auto',
    position: 'relative',
    backgroundColor: 'green',
    aspectRatio: '1.62',
  };
  const dispatch=useDispatch();
  const players = useSelector((state) => state.board1players.players);
  // const moveableTargets=useSelector((state) => state.board1players.playersref)
  const [moveableTargets, setMoveableTargets] = useState([]);
  const playersref = useRef([]);
  

  useEffect(() => {  // important as sometimes as movebale renders before refs are assigned so i need to make sure that i render things when refs are assigned
    playersref.current = playersref.current.filter(ref => ref !== null);
    setMoveableTargets(playersref.current);
  }, [players,dispatch]);


  const addAplayer= ()=>{
    dispatch(addplayers({ id: nanoid(), position: 'lb', playernumber: 1 }))
  }



  const handlePlayerClick = (id, index) => {
    // setPlayers(prevPlayers => prevPlayers.filter(player => player.id !== id));
    useDispatch(removeplayer(id))
    playersref.current = playersref.current.filter((_, idx) => idx !== index);
    setMoveableTargets(playersref.current); // Update moveable targets
    
  };

  return (
    <>
    <div style={boardStyle} className="flex justify-center items-center">
      <div className='w-11/12 h-auto bg-green border-red-50 border-solid border-2'>
        {children}
      </div>
      {
        players.map((player, index) => (
          <div key={player.id}>
            <div
              style={{ top: `${10 }% `}}
              ref={(element) => playersref.current[index] = element}
              className="w-1/2 h-1/2 border-solid border-2 border-red-500 absolute top-0 left-0 moveable-target bg-red-300"
            >
              {player.id}
            </div>
          </div>
        ))
      }
      {
        moveableTargets.map((target, index) => (
          <Moveable
            key={players[index].id}
            target={target}
            draggable={true}
            throttleDrag={40}
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
          />
        ))
      }
    </div>
    <button onClick={addAplayer}> Click me</button>
    </>
  );
}

export default Board;
    