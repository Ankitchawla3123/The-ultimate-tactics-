import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";

import { useDispatch, useSelector } from "react-redux";
import {
  addoneinoptions,
  addplayers,
  ContextMenuStatechange,
  setdrawpolystatus,
  setidrawing,
  updatexy,
  updatexy2,
} from "../features/players/firstboardPlayersSlice";
import { nanoid } from "@reduxjs/toolkit";
import Moveable from "react-moveable";
import useViewportResize from "../hooks/useViewportResize";
import PlayerComponent from "./PlayerComponent";
import ContextMenu from "./ContextMenu";
import FootballField from "./Field";
import DraggablePlayerOptions from "./DraggablePlayerOptions";
import useBreakpoint from "../hooks/useBreakpoint";
import { getPlayerDimensions } from "../utils/HeightAndWidthofplayer";
import Drawingboard from "./drawingboard/Drawingboard";
import { Menu } from "lucide-react";
import DropMenu from "./dropdownmenu/DropMenu";
import FullMenu from "./dropdownmenu/FullMenu";

const Board = React.memo(() => {
  const viewportwidth = useViewportResize();
  const isTouchDevice =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.pointerEnabled;
  const breakpoints = useBreakpoint();

  const boardStyle = {
    width: viewportwidth + "vw",
    height: "auto",
    position: "relative",
    backgroundColor: "green",
    aspectRatio: "1.60",
  };

  const dispatch = useDispatch();
  const players = useSelector((state) => state.board1players.players);
  const [moveableTargets, setMoveableTargets] = useState([]);
  const contextmenu = useSelector(
    (state) => state.board1players.ContextMenuState
  );
  const playersref = useRef([]);
  const boardRef = useRef(null);
  const contextMenuRef = useRef(null);
  const [formation, setFormation] = useState([4, 1, 2, 1, 2]);
  const currentmode = useSelector((state) => state.board1players.currentmode);

  const setformationPercentway = () => {
    const playersposition = [];
    const formationlength = formation.length;
    if (formation != []) {
      playersposition.push("1:1");
      for (let i = 1; i <= formation.length; i++) {
        for (let j = 0; j < formation[i - 1]; j++) {
          playersposition.push(`${i + 1}:${j + 1}`);
        }
      }
    }
    console.log(playersposition);

    const rect = boardRef.current.getBoundingClientRect();
    const normalw = rect.width;
    const normalh = rect.height;
    const fieldportw = (rect.width * 89) / 100;
    const fieldporth = (rect.height * 89) / 100;
    const xnonfield = ((normalw - fieldportw) / 2 / fieldportw) * 100;
    const ynonfield = ((normalh - fieldporth) / 2 / fieldporth) * 100;
    const defencelinestartx = xnonfield * 2;
    const defencelinestarty = 90;
    console.log(defencelinestarty);

    dispatch(
      addplayers({
        id: nanoid(),
        playername: "",
        playercolor: "red",
        position: "lb",
        playernumber: 3,
        x: defencelinestartx,
        y: defencelinestarty,
        x2: 10,
        y2: 10,
      })
    );
  };

  // setformationPercentway();

  const setformations = () => {
    const dimensions = getPlayerDimensions(viewportwidth);
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const playerWidth = (dimensions.width * viewportWidth) / 100; // in viewport width units
    const playerHeight = (dimensions.height * viewportHeight) / 100; // in viewport height units
    const rect = boardRef.current.getBoundingClientRect();
    const newviewportw = rect.width;
    const newviewporth = rect.height;
    const fieldwidth = (newviewportw * 11) / 12;
    const fieldheight = fieldwidth / 1.62;
    const playerdiameter = (playerWidth / newviewportw) * 100;
    const playerdiameter2 = (playerHeight / newviewporth) * 100;

    const playerradius = (playerWidth / 2 / newviewportw) * 100;
    const playerradius2 = (playerHeight / 2 / newviewporth) * 100;

    const leftspace =
      ((newviewportw - fieldwidth) / 2 / newviewportw) * 100 -
      (playerWidth / 2 / newviewportw) * 100;
    const topspace =
      ((newviewporth - fieldheight) / 2 / newviewporth) * 100 + playerradius;
    const xstart = leftspace + playerradius;
    const xend = 100 - playerdiameter - xstart;
    const xmid = (xstart + xend) / 2;

    const ystart = topspace + playerradius2;
    const yend = 100 - topspace - topspace - playerradius;
    const ymid = (ystart + yend) / 2;

    const playersposition = [];
    const formationlength = formation.length;
    if (formation != []) {
      playersposition.push("1:1");
      for (let i = 1; i <= formation.length; i++) {
        for (let j = 0; j < formation[i - 1]; j++) {
          playersposition.push(`${i + 1}:${j + 1}`);
        }
      }
    }
    console.log(playersposition);
    const defencelinestart = xstart + (xmid - xstart) / 4.5;
    const division =
      (xmid - playerradius - defencelinestart) / (formationlength - 1);
    for (let i = 0; i < formationlength; i++) {
      const ydivision = (yend - ystart + 2 * ystart) / (formation[i] + 1);
      for (let j = 1; j <= formation[i]; j++) {
        dispatch(
          addplayers({
            id: nanoid(),
            playername: "",
            playercolor: "red",
            position: "lb",
            playernumber: 3,
            x: defencelinestart + i * division,
            y: j * ydivision,
            x2: defencelinestart + i * division,
            y2: j * ydivision,
          })
        );
      }
    }

    // xstart+playerradius = goalkeeper
    // xstart+(xmid-xstart)/4.5 = defence line start
  };

  // Memoized ChangeContextMenu function
  const ChangeContextMenu = useCallback(
    (e) => {
      if (contextMenuRef.current && contextMenuRef.current.contains(e.target)) {
        return;
      }
      dispatch(ContextMenuStatechange(false));
    },
    [dispatch]
  );

  useEffect(() => {
    window.addEventListener("click", ChangeContextMenu);
    return () => {
      window.removeEventListener("click", ChangeContextMenu);
    };
  }, [ChangeContextMenu]);

  // Memoized handleResize function
  const handleResize = useCallback(() => {
    // dispatch(updatexy()); // Updates x and y from xy2

    // Remove transform property from all moveable targets
    playersref.current.forEach((playerRef) => {
      if (playerRef) {
        playerRef.style.transform = ""; // Clear transform property
      }
    });
  }, [dispatch]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize(); // Initial update on mount

    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  useEffect(() => {
    playersref.current = playersref.current.filter((ref) => ref !== null);
    setMoveableTargets(playersref.current);
  }, [players]);

  const options = useSelector((state) => state.board1players.Playeroptions);
  const optionindex = useSelector((state) => state.board1players.optionsindex);

  // Memoized handleDrop function
  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      const dimensions = getPlayerDimensions(viewportwidth);
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const playerWidth = (dimensions.width * viewportWidth) / 100; // in viewport width units
      const playerHeight = (dimensions.height * viewportHeight) / 100; // in viewport height units
      const newviewportw = (viewportWidth * viewportwidth) / 100;
      const newviewporth = newviewportw / 1.62;

      const playerOption = options[optionindex];
      const rect = boardRef.current.getBoundingClientRect();
      const x =
        ((e.clientX - rect.left) / rect.width) * 100 -
        (playerWidth / 2 / newviewportw) * 100;
      const y =
        ((e.clientY - rect.top) / rect.height) * 100 -
        (playerHeight / 2 / newviewporth) * 100;

      dispatch(
        addplayers({
          id: nanoid(),
          playername: "",
          playercolor: playerOption.color,
          position: "lb",
          playernumber: playerOption.number,
          x: x,
          y: y,
          x2: x,
          y2: y,
        })
      );
      dispatch(addoneinoptions());
    },
    [dispatch, options, optionindex, viewportwidth]
  );

  // Memoized onDrag function for Moveable
  const onDrag = useCallback(
    (e, index) => {
      e.target.style.transform = e.transform;
      if (contextmenu) {
        dispatch(ContextMenuStatechange(false));
      }

      const rect = boardRef.current.getBoundingClientRect();
      const targetRect = e.target.getBoundingClientRect();
      const x = ((targetRect.left - rect.left) / rect.width) * 100;
      const y = ((targetRect.top - rect.top) / rect.height) * 100;

      // dispatch(updatexy2({ id: players[index].id, x: x, y: y }));
    },
    [dispatch, contextmenu, players]
  );

  // Memoized onResize function for Moveable
  const onResize = useCallback((e) => {
    e.target.style.width = `${e.width}px`;
    e.target.style.height = `${e.height}px`;
    e.target.style.transform = e.drag.transform;
  }, []);

  // Memoized onRotate function for Moveable
  const onRotate = useCallback((e) => {
    e.target.style.transform = e.drag.transform;
  }, []);

  const drawingstatus = () => {
    dispatch(setidrawing(true));
    // setIsdrawing(true)
  };
  const drawpolygonstatus = (e) => {
    dispatch(setdrawpolystatus(true));
  };
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [touchedIndex, setTouchedIndex] = useState(null);

  // **Handle hover events**
  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const handleformation = () => {
    setformationPercentway();
  };

  return (
    <div className="flex flex-col">
      <div
        style={boardStyle}
        className="flex justify-center items-center"
        ref={boardRef}
        onContextMenu={(e) => e.preventDefault()}
        // onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <div className=" relative  w-85per h-auto bg-green z-10">
          <FootballField />
        </div>
        <div className="absolute ">
          <Drawingboard />
        </div>
        {/* {players.map((player, index) => (
          <PlayerComponent
            key={player.id}
            player={player}
            index={index}
            playersref={playersref}
            onMouseMove={() => handleMouseEnter(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            onTouchStart={() => handleMouseEnter(index)}
            onTouchEnd={handleMouseLeave}
            zIndex={touchedIndex === index || hoveredIndex === index ? 10 : 20}
          />
        ))} */}
        {contextmenu && (
          <div ref={contextMenuRef}>
            <ContextMenu />
          </div>
        )}
        {moveableTargets.map((target, index) => (
          <Moveable
            key={index}
            target={target}
            draggable={true}
            throttleDrag={0}
            pinchable={true}
            edgeDraggable={false}
            startDragRotate={0}
            throttleDragRotate={0}
            resizable={false}
            keepRatio={false}
            throttleResize={1}
            renderDirections={["nw", "n", "ne", "w", "e", "sw", "s", "se"]}
            rotatable={false}
            throttleRotate={0}
            rotationPosition={"top"}
            bounds={{ left: 0, top: 0, right: 0, bottom: 0, position: "css" }}
            snappable={true}
            onBound={(e) => {
              console.log(e);
            }}
            onDrag={(e) => onDrag(e, index)}
            onResize={onResize}
            onRotate={onRotate}
            style={{ border: "none", boxShadow: "none" }} // Inline style
          />
        ))}
      </div>

      <div className="flex items-center mt-0.5">
        <FullMenu />
      </div>
      <button onClick={handleformation}>add formation</button>
    </div>
  );
});

export default Board;
