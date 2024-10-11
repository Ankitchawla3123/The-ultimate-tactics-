import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import {
  setcurrentmode,
  setdrawingtype,
  setidrawing,
  setdrawpolystatus,
} from "../../features/players/firstboardPlayersSlice";

function DropMenu({ items, type }) {
  const [selectstate, setselectstate] = React.useState(Object.keys(items)[0]);
  const currentmode = useSelector((state) => state.board1players.currentmode);
  const drawingtype = useSelector((state) => state.board1players.drawingtype);
  const dispatch = useDispatch();
  if (currentmode === "Draw") {
    dispatch(setidrawing(true));
    if (drawingtype === "polygon") {
      dispatch(setdrawpolystatus(true));
    } else {
      dispatch(setdrawpolystatus(false));
    }
  }
  if (currentmode === "Drag&Resize") {
    dispatch(setidrawing(false));
  }

  const savestate = (value) => {
    setselectstate(value);
    if (type === "tool") {
      dispatch(setcurrentmode(value));
    }
    if (type === "drawtype") {
      dispatch(setdrawingtype(value));
    }
  };
  return (
    <div>
      <Select className="" value={selectstate} onValueChange={savestate}>
        <SelectTrigger>
          <SelectValue placeholder="🖱️Drag&Resize" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Features</SelectLabel>
            {Object.keys(items).map((keyname, i) => (
              <SelectItem value={keyname} key={i}>
                {items[keyname]}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

export default DropMenu;
