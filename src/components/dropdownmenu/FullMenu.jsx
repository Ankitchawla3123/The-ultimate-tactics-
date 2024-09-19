import React from 'react';
import DropMenu from './DropMenu';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown2 } from './Dropdown2';
import DraggablePlayerOptions from '../DraggablePlayerOptions';

function FullMenu() {
  const currentmode = useSelector((state) => state.board1players.currentmode);
  const drawingtype = useSelector((state) => state.board1players.drawingtype);
  const dispatch = useDispatch();

  const arrowThickness = 2; // Set the desired thickness here
  const leftarrow = (
    <svg
      fill="none" // Ensure fill is set to none to avoid any fill color
      height="20"
      width="20"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 330 330"
      transform="rotate(180)"
    >
      <path
        d="M15,180h263.787l-49.394,49.394c-5.858,5.857-5.858,15.355,0,21.213C232.322,253.535,236.161,255,240,255 s7.678-1.465,10.606-4.394l75-75c5.858-5.857,5.858-15.355,0-21.213l-75-75c-5.857-5.857-15.355-5.857-21.213,0 c-5.858,5.857-5.858,15.355,0,21.213L278.787,150H15c-8.284,0-15,6.716-15,15S6.716,180,15,180z"
        stroke="#000000" // Set stroke color to black
        strokeWidth={2} // Set stroke width to match the desired thickness
        fill="#000000" // Ensure fill is set to none
      />
    </svg>
  );
  const rightarrow = (
    <svg
      fill="none" // Ensure fill is set to none to avoid any fill color
      height="20"
      width="20"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 330 330"
    >
      <path
        d="M15,180h263.787l-49.394,49.394c-5.858,5.857-5.858,15.355,0,21.213C232.322,253.535,236.161,255,240,255 s7.678-1.465,10.606-4.394l75-75c5.858-5.857,5.858-15.355,0-21.213l-75-75c-5.857-5.857-15.355-5.857-21.213,0 c-5.858,5.857-5.858,15.355,0,21.213L278.787,150H15c-8.284,0-15,6.716-15,15S6.716,180,15,180z"
        stroke="#000000" // Set stroke color to black
        strokeWidth={2} // Set stroke width to match the desired thickness
        fill="#000000" // Ensure fill is set to none
      />
    </svg>
  );

  const leftend = (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M23 13H2v-2h21v2z" fill="#000000" strokeWidth={arrowThickness} />
      <path d="M32 21V3" stroke="#000000" transform="translate(-29.5, 0)" strokeWidth={arrowThickness} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  const rightend = (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M23 13H2v-2h21v2z" fill="#000000" strokeWidth={arrowThickness} />
      <path d="M32 21V3" stroke="#000000" transform="translate(-9.5, 0)" strokeWidth={arrowThickness} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const normalline = (
    <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" fill="#000000" viewBox="0 0 24 24">
      <path d="M23 13H2v-2h21v2z" fill="#000000" strokeWidth={arrowThickness} />
    </svg>
  );

  const dashedline = (
    <svg viewBox="0 0 17 17" height='20' width='20' version="1.1" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 8h7v1H0v-1zM10 8h7v1h-7v-1z" stroke="#000000" strokeWidth={1} fill="none" />
    </svg>
  );

  return (
    <div className='flex flex-col items-center gap-2 md:flex-row md:gap-2 w-full'>
  
      <div className='flex items-center gap-2 md:gap-4 md:flex-row '>
      <DraggablePlayerOptions/>
       <div className='flex items-center gap-2 md:flex-row ' >
       <DropMenu items={{ 'Drag&Resize': '🖱️Drag & Resize', 'Draw': '✏️ Draw' }} type={'tool'} />
        {
          currentmode === 'Draw'?(<DropMenu items={{ 'line': '━━ Line', 'polygon': '⬠ Polygon' }} type={'drawtype'} />):null
        }
        
       </div>
        
      </div>
      {currentmode === 'Draw' && drawingtype === 'line' && (
        <div className='flex gap-0.25'>
          <Dropdown2 items={{ 'leftending': leftend, 'leftarrow': leftarrow }} />
          <Dropdown2 items={{ 'normal': normalline, 'dashed': dashedline }} />
          <Dropdown2 items={{ 'rightending': rightend, 'rightarrow': rightarrow }} />
        </div>
      )}
    </div>
  );
}

export default FullMenu;
