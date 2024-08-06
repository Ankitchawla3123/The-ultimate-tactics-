import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ChangePlayername } from '../features/players/firstboardPlayersSlice';

function ContextMenu() {
  const { id, x, y } = useSelector(state => state.board1players.ContextMenusave);
  const player = useSelector(state => state.board1players.players.find(player => player.id === id)); // Get the player from state
  const dispatch = useDispatch();
  
  const [name, setName] = useState(player ? player.name : '');

  useEffect(() => {
    // Update local state if player name changes in the Redux store
    setName(player ? player.name : '');
  }, [player]);

  const styling = {
    left: x,
    top: y,
    position: "absolute",
    transform: "translate(0%,10%)",
  };

  const onNameChange = (e) => {
    setName(e.target.value);
    dispatch(ChangePlayername({ id, name: e.target.value }));
  };

  return (
    <div style={styling} className="">
      <input
        type="text"
        placeholder='Player name'
        value={name || ''} // Ensure the value is never undefined
        onChange={onNameChange}
      />
      <br />
      <input type="text" placeholder='Player number' />
      <br />
      <input type="color" />
      <button>Change color</button>
    </div>
  );
}

export default ContextMenu;
