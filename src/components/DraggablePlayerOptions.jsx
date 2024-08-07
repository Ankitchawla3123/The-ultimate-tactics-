// src/components/DraggablePlayerOptions.jsx
import React from 'react';

const playerOptions = [
  { number: 1, color: '#8B0000' }, // Dark Red
  { number: 1, color: '#FFD700' }, // Gold
  { number: 1, color: '#8A2BE2' }, // BlueViolet
  { number: 1, color: '#32CD32' }, // LimeGreen
  { number: 1, color: '#0000FF' }, // Blue
  { number: 1, color: '#FF4500' }, // OrangeRed
  { number: 1, color: '#00CED1' }, // DarkTurquoise
  { number: 1, color: '#FFFFFF' }, // White
  { number: 1, color: '#000000' }, // Black
];

const DraggablePlayerOptions = ({ handleDragStart }) => {
  return (
    <div className="flex justify-center my-4">
      {playerOptions.map((option, index) => (
        <div
          key={index}
          draggable
          onDragStart={(e) => handleDragStart(e, option)}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: option.color,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '0 5px',
            cursor: 'grab',
          }}
        >
          {option.number}
        </div>
      ))}
    </div>
  );
};

export default DraggablePlayerOptions;
