import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ChangePlayername, changeplayernumber, ChangeColor } from '../features/players/firstboardPlayersSlice';

function ContextMenu() {
  const { id, x, y } = useSelector(state => state.board1players.ContextMenusave);
  const player = useSelector(state => state.board1players.players.find(player => player.id === id));
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [color, setColor] = useState('#ffffff'); // Default color value

  useEffect(() => {
    if (player) {
      setName(player.name || '');
      setNumber(player.playernumber != null ? String(player.playernumber) : '');
      setColor(player.playercolor || '#ffffff'); // Ensure default color value
    }
  }, [player]);

  const styling = {
    left: x,
    top: y,
    position: "absolute",
    transform: `translate(0%, ${player && player.name ? '30%' : '10%'})`, // Conditional translation
  };

  const onNameChange = (e) => {
    setName(e.target.value);
    dispatch(ChangePlayername({ id, name: e.target.value }));
  };

  const onNumberChange = (e) => {
    setNumber(e.target.value);
    dispatch(changeplayernumber({ id, number: e.target.value }));
  };

  const onColorChange = (e) => {
    setColor(e.target.value);
  };

const changethecolor=(e)=>{
  e.preventDefault();
  dispatch(ChangeColor({id:player.id, color:color}));
}


  return (
    <div style={styling}>
      <input
        type="text"
        placeholder='Player name'
        value={name}
        onChange={onNameChange}
      />
      <br />
      <input
        type="number"
        placeholder='Player number'
        value={number}
        onChange={onNumberChange}
      />
      <br />
      <form onSubmit={changethecolor}>
      <input
        type="color"
        value={color}
        onChange={onColorChange}
      />
      <button type='submit'>Change Color</button>
      </form>

    </div>
  );
}

export default ContextMenu;
