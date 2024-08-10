import React from 'react'
import Board from './components/Board'
import FootballField from './components/Field'
import './App.css'; // Include your CSS file



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