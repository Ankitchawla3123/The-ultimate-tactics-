import React, { useState, useEffect, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  ChangePlayername,
  changeplayernumber,
  ChangeColor,
  removeplayer,
  ContextMenuStatechange,
} from "../features/players/firstboardPlayersSlice";

const ContextMenu = memo(() => {
  const { id, x, y } = useSelector(
    (state) => state.board1players.ContextMenusave
  );
  const player = useSelector((state) =>
    state.board1players.players.find((player) => player.id === id)
  );
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [color, setColor] = useState("#ffffff");

  useEffect(() => {
    if (player) {
      setName(player.name || "");
      setNumber(player.playernumber != null ? String(player.playernumber) : "");
      setColor(player.playercolor || "#ffffff");
    }
  }, [player]);

  const styling = {
    left: x,
    top: y,
    position: "absolute",
    transform: `translate(0%, ${player && player.name ? "30%" : "10%"})`,
  };

  const onNameChange = (e) => {
    setName(e.target.value);
    dispatch(ChangePlayername({ id, name: e.target.value }));
  };

  const onNumberChange = (e) => {
    const value = e.target.value;

    // Allow only digits
    if (/^\d*$/.test(value)) {
      setNumber(value);
      // Dispatch the action to update the number immediately
      if (value !== "") {
        dispatch(changeplayernumber({ id, number: Number(value) })); // Convert to a number
      }
    }
  };

  const onColorChange = (e) => {
    setColor(e.target.value);
  };

  const changethecolor = (e) => {
    e.preventDefault();
    dispatch(ChangeColor({ id: player.id, color: color }));
  };

  const removeaplayer = () => {
    dispatch(removeplayer(player.id));
    dispatch(ContextMenuStatechange(false));
  };

  return (
    <div style={styling} className="z-50">
      <input
        type="text"
        placeholder="Player name"
        value={name}
        onChange={onNameChange}
      />
      <br />
      <input
        type="text" // Keep as text input
        placeholder="Player number"
        value={number}
        onChange={onNumberChange} // Only allow numeric input
      />
      <br />
      <form onSubmit={changethecolor}>
        <input type="color" value={color} onChange={onColorChange} />
        <button type="submit">Change Color</button>
      </form>
      <button onClick={removeaplayer}>Remove Player</button>
    </div>
  );
});

export default ContextMenu;
