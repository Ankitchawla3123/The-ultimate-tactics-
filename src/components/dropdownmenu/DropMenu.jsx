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

  // Move side effects related to currentmode and drawingtype inside useEffect
  React.useEffect(() => {
    if (currentmode === "Draw") {
      dispatch(setidrawing(true));
      dispatch(setdrawpolystatus(drawingtype === "polygon"));
    } else if (currentmode === "Drag&Resize") {
      dispatch(setidrawing(false));
      dispatch(setdrawpolystatus(false));
      dispatch(setdrawingtype("line"));
    }
  }, [currentmode, drawingtype, dispatch]); // Add these dependencies

  const savestate = (value) => {
    setselectstate(value);
    if (type === "tool") {
      dispatch(setcurrentmode(value));
    } else if (type === "drawtype") {
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
