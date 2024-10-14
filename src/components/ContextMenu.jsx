import React, { useState, useEffect, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  ChangePlayername,
  changeplayernumber,
  ChangeColor,
  removeplayer,
  ContextMenuStatechange,
  setshapecolorforcontextmenu,
  setshapremoval,
} from "../features/players/firstboardPlayersSlice";

const ContextMenu = memo(() => {
  const { id, x, y } = useSelector(
    (state) => state.board1players.ContextMenusave
  );
  const ContextMenutype = useSelector(
    (state) => state.board1players.ContextMenutype
  );

  const player = useSelector((state) =>
    state.board1players.players.find((player) => player.id === id)
  );
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [color, setColor] = useState("#ffffff");
  const shaperemoval = useSelector((state) => state.board1players.shaperemoval);

  const [color2, setColor2] = useState(
    useSelector((state) => state.board1players.shapecolorforcontextmenu)
  );
  const onColorChange2 = (e) => {
    setColor2(e.target.value);
  };

  const changethecolor2 = (e) => {
    e.preventDefault();
    console.log(color2);
    dispatch(setshapecolorforcontextmenu(color2));
  };
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
    transform: `translate(0%, 10%)`,
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
  const removaeashape = (e) => {
    dispatch(setshapremoval(!shaperemoval));
    dispatch(ContextMenuStatechange(false));
  };

  // Render the context menu based on type
  return (
    <div style={styling} className="z-50">
      {ContextMenutype === "player" ? (
        <>
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
        </>
      ) : ContextMenutype === "shape" ? (
        <div>
          <form onSubmit={changethecolor2}>
            <input type="color" value={color2} onChange={onColorChange2} />
            <button type="submit">Change Color</button>
          </form>
          <button className=" bg-white text-black p-1 " onClick={removaeashape}>
            Remove
          </button>
        </div>
      ) : null}
    </div>
  );
});

export default ContextMenu;
