import React, { useEffect, useState } from 'react'
import Board from './components/Board'
import FootballField from './components/Field'
import './App.css'; // Include your CSS file
import { useDispatch, useSelector } from 'react-redux';
import { setdrawpolystatus } from './features/players/firstboardPlayersSlice';



function App() {

  return (
    <div className='flex justify-center'>
      <Board>

        <FootballField />
      </Board>
    </div>

  )
}

export default App