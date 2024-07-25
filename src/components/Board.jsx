import React, { useState, useEffect, useRef } from 'react';
import usePlayerData from '../hooks/usePlayerData.js';
import Moveable from "react-moveable";

function Board({ children }) {
  const viewportwidth = 56;
  const boardStyle = {
    width: viewportwidth + 'vw',
    height: 'auto',
    position: 'relative',
    backgroundColor: 'green',
    aspectRatio: '1.62',
  };

  const playersData = usePlayerData();
  const [players, setPlayers] = useState([]);
  const [moveableTargets, setMoveableTargets] = useState([]);

  useEffect(() => {
    setPlayers(playersData);
  }, [playersData]);

  const playersref = useRef([]);

  useEffect(() => {
    playersref.current = playersref.current.filter(ref => ref !== null);
    setMoveableTargets(playersref.current);
  }, [players]);

  const handlePlayerClick = (id, index) => {
    setPlayers(prevPlayers => prevPlayers.filter(player => player.id !== id));
    playersref.current = playersref.current.filter((_, idx) => idx !== index);
    setMoveableTargets(playersref.current); // Update moveable targets
  };

  return (
    <div style={boardStyle} className="flex justify-center items-center">
      <div className='w-11/12 h-auto bg-green border-red-50 border-solid border-2'>
        {children}
      </div>
      {
        players.map((player, index) => (
          <div key={player.id}>
            <div
              style={{ top: `${10}%`, zIndex: 10 - index }}
              ref={(element) => playersref.current[index] = element}
              className="w-1/2 h-1/2 border-solid border-2 border-red-500 absolute top-0 left-0"
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
            throttleDrag={1}
            edgeDraggable={false}
            startDragRotate={0}
            throttleDragRotate={0}
            resizable={true}
            keepRatio={false}
            throttleResize={1}
            renderDirections={["nw", "n", "ne", "w", "e", "sw", "s", "se"]}
            rotatable={true}
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
  );
}

export default Board;
