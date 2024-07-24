import React from 'react';

function Board({ children }) {
const viewportwidth=56
  const boardStyle = {
    // display: 'flex',
    width: viewportwidth + 'vw', // 65% of the viewport width
    height: 'auto', // Maintain aspect ratio
    position: 'relative', // For absolute positioning of children
    backgroundColor: 'green', // Background color to simulate the field
    aspectRatio: '1.62', // Maintain aspect ratio (you can adjust as needed)
  };

  return (
    <div style={boardStyle} className="flex justify-center items-center">
      {/* {children} */}
      <div className=' w-11/12 h-auto  bg-green border-red-50 border-solid border-2'>
      {children}
      </div>
      {/* Sorry, your browser does not support this feature. */}
    </div>
  );
}

export default Board;
