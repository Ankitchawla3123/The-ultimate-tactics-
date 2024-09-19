import React, { useState, useRef, useEffect } from 'react';
import Line from './Line';
import Polygon from './Polygon';
import { useDispatch, useSelector } from 'react-redux';
import { setdrawingstarted, setdrawpolystatus, setidrawing } from '../../features/players/firstboardPlayersSlice';
import useViewportResize from '../../hooks/useViewportResize';



const Drawingboard = () => {
  const viewportwidth = useViewportResize();

  const [overanobject, setOveranobject] = useState(false)
  const dispatch = useDispatch();
  const currentmode = useSelector((state) => state.board1players.currentmode);
  const drawingtype = useSelector((state) => state.board1players.drawingtype)

  const [dragline, setDragline] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [draggingEnd, setDraggingEnd] = useState(null);
  const [dragelement, setDragelement] = useState()
  const [start, setStart] = useState();
  const [drawstart, setDrawstart] = useState({})
  const [drawpoly2, setdrawpoly2] = useState(true)
  const isdrawing = useSelector((state) => state.board1players.isdrawing);
  const drawpolystatus = useSelector((state) => state.board1players.drawpolystatus)
  const drawdragcheck = useSelector((state) => state.board1players.drawordragstarted)


  const [point, setPoint] = useState(null)
  const [nextpoint, setNextpoint] = useState(null)
  const [polypoints, setpolypoints] = useState([])
  const [polygon, setpolygon] = useState("")
  const [svgSize, setSvgSize] = useState({ width: 860, height: 531 });

  // console.log(svgSize)
  const [lines, setLines] = useState([])

  const [drawlinestatus, setDrawlinestatus] = useState(false)
  const [line, setLine] = useState(null);
  const svgRef = useRef(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentmode === 'Draw') {
        if (drawingtype === 'polygon') {
          // dispatch(setdrawpolystatus(true));
        }
      }
    }, ); // 0.1 seconds = 100 milliseconds
  
    return () => clearTimeout(timeoutId); 
  }, [drawpolystatus]);
  useEffect(() => {
    const resizeofwindow = () => {
      if (!svgRef.current) return;
      const wscale = svgRef.current.clientWidth / svgSize.width;
      const hscale = svgRef.current.clientHeight / svgSize.height;
      setLines(prevLines =>
        prevLines.map(line => ({
          ...line,
          x1: line.x1 * wscale,
          y1: line.y1 * hscale,
          x2: line.x2 * wscale,
          y2: line.y2 * hscale
        }))
      );
      setPolygons(prevPolygons =>
        prevPolygons.map(polygon =>
          polygon.map(point => [
            point[0] * wscale,
            point[1] * hscale
          ])
        )
      );
      setSvgSize({ width: svgRef.current.clientWidth, height: svgRef.current.clientHeight });
    };
    resizeofwindow();
    window.addEventListener('resize', resizeofwindow);
    return () => {
      window.removeEventListener('resize', resizeofwindow);
    };
  }, [svgSize.width, svgSize.height, viewportwidth]);


  const getPointerPosition = (event) => {
    const svg = svgRef.current;
    const { clientX, clientY } = event.type.startsWith('touch') ? event.touches[0] : event;
    const { left, top } = svg.getBoundingClientRect();
    return { x: clientX - left, y: clientY - top };
  };

  const startDragging = (event, end) => {
    if (!(event.type === 'touchstart' || event.type === 'touchmove' || event.type === 'touchend')) {
      event.preventDefault();
    }
    setIsDragging(true);
    setDraggingEnd(end);
  };


  const drag = (event) => {
    if (!isDragging) return;
    const { x, y } = getPointerPosition(event);
    const svg = svgRef.current;
    const svgWidth = svg.clientWidth;
    const svgHeight = svg.clientHeight;
    if (!drawdragcheck) {
      dispatch(setdrawingstarted(true))
    }

    if (dragelement.type === 'line') {

      setLines(
        lines.map((line, index) => {
          if (index === dragelement.index) {
            const boundcheck = (x <= svgWidth && x >= 0 && y <= svgHeight && y >= 0);
            if (boundcheck) {
              return {
                ...line,
                ...(draggingEnd === 'start'
                  ? { x1: x, y1: y }
                  : { x2: x, y2: y }
                )
              };
            }
          }
          return line;
        })
      );
    }
    else if (dragelement.type === 'polygon') {
      setPolygons(polygons.map((polygon, index) => {
        if (index === dragelement.index2) {
          return polygon.map((point, index) => {
            const boundcheck = (x <= svgWidth && x >= 0 && y <= svgHeight && y >= 0);
            if (boundcheck && index === dragelement.index) {
              return [x, y]
            }
            return point;
          })
        }
        return polygon;
      }))
      // setpolypoints(
      //   polypoints.map((point, index) => {
      //     const boundcheck = (x <= svgWidth && x >= 0 && y <= svgHeight && y >= 0);
      //     if (boundcheck && index === dragelement.index2) {
      //       return [x, y]
      //     }
      //     return point;

      //   })
      // )
    }
  };

  const startdragline = (e) => {
    if (!(e.type === 'touchstart' || e.type === 'touchmove' || e.type === 'touchend')) {
      e.preventDefault();
    }
    // setdrawpoly2(false);
    setDragline(true);
    const { x, y } = getPointerPosition(e);
    setStart({ x, y });
  };


  const draglines = (e) => {
    if (dragline) {
      setDrawlinestatus(false)
      // setdrawpoly2(false)
      // setdrawpolystatus(false);
      // dispatch(setdrawpolystatus(false))

      if (!drawdragcheck) {
        dispatch(setdrawingstarted(true))
      }

      const { x, y } = getPointerPosition(e);
      const svg = svgRef.current;
      const svgWidth = svg.clientWidth;
      const svgHeight = svg.clientHeight;
      const deltaX = x - start.x;
      const deltaY = y - start.y;

      if (dragelement !== null && dragelement.type === 'polygon') {
        setPolygons(polygons.map((polygon, index) => {
          if (index === dragelement.index) {
            const allWithinBounds = polygon.every(([px, py]) => {
              const newX = px + deltaX;
              const newY = py + deltaY;
              return newX >= 0 && newX <= svgWidth && newY >= 0 && newY <= svgHeight;
            });

            if (allWithinBounds) {
              return polygon.map(([px, py]) => [px + deltaX, py + deltaY]);
            } else {
              return polygon;
            }
          }
          return polygon
        }))

      }

      if (dragelement !== null && dragelement.type == 'line') {
        setLines(lines.map((line, index) => {
          if (index === dragelement.index) {
            const isWithinBounds =
              line.x1 + deltaX >= 0 &&
              line.x2 + deltaX >= 0 &&
              line.x1 + deltaX <= svgWidth &&
              line.x2 + deltaX <= svgWidth &&
              line.y1 + deltaY >= 0 &&
              line.y2 + deltaY >= 0 &&
              line.y1 + deltaY <= svgHeight &&
              line.y2 + deltaY <= svgHeight;

            return isWithinBounds
              ? {
                ...line,
                x1: line.x1 + deltaX,
                y1: line.y1 + deltaY,
                x2: line.x2 + deltaX,
                y2: line.y2 + deltaY,
              }
              : line;
          }
          return line;
        }))
      }
      setStart({ x, y });
    }
  };


  const stopDragging = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isdrawing && drawlinestatus) {
      if (line != null) {
        setLines((prev) => [...prev, line]);
        setDrawstart(null)
        setLine(null)
      }
      console.log(lines)
    }
    // if (isDragging) {
    //   e.stopPropagation()
    // }

    const timeoutId = setTimeout(() => {

      setIsDragging(false);
      setDragline(false);
      // dispatch(setidrawing(false))
  
      
    }, 100); // 0.1 seconds = 100 milliseconds
    setDragelement(null)
    setDrawlinestatus(false)
    setDraggingEnd(null);



    // setdrawpoly2(true)

    // if (drawdragcheck) {
    //   dispatch(setdrawingstarted(false))
    // }

  };

  // useEffect(()=>{
  //   if (!dragline ) {
  //     setdrawpoly2(true)
  //   }

  // },[dragline,isDragging])

  useEffect(() => {
    let string = ''
    for (let i = 0; i < polypoints.length; i++) {
      string += `${polypoints[i][0]},${polypoints[i][1]}` + ' '
    }

    setpolygon(string)

  }, [polypoints])


  const draw = (e) => {
    if (isdrawing && !isDragging) {
      setDrawlinestatus(true)
      const { x, y } = getPointerPosition(e)
      setDrawstart({
        x: x,
        y: y,
      })
    }

  }

  const drawlines = (e) => {
    if (isdrawing && drawlinestatus) {
      if (drawstart != null && !drawdragcheck) {
        dispatch(setdrawingstarted(true))
      }
      const { x, y } = getPointerPosition(e);
      setLine({ x1: drawstart.x, y1: drawstart.y, x2: x, y2: y })
    }
  }
  const drawingstatus = () => {
    dispatch(setidrawing(true))
    // setIsdrawing(true)
  }

  const drawpolygonstatus = (e) => {
    dispatch(setdrawpolystatus(true))
  }
  const drawpolygonstatus2 = (e) => {
    e.preventDefault()
    // dispatch(setdrawpolystatus(false))

    setNextpoint(null)
    setPoint(null)
    setpolygon('')
    // setpolygon('')
    console.log(drawpolystatus)
    if (polypoints.length > 1) {
      setPolygons((prev) => [...prev, polypoints]);
    }

    setpolypoints([])
    console.log(polygons)
  }

  // const drawpolygon=(e)=>{
  //   if(!drawpolystatus) return
  //   if(point===null) return 
  //   const { x, y } = getPointerPosition(e);
  //   setNextpoint(`${x},${y}`)
  // }

  const startdrawingpolygon = (e) => {
    console.log(isDragging)
    console.log(drawpolystatus)
    console.log(dragline)
    if (!drawpolystatus || isDragging || dragline || overanobject) return

    const { x, y } = getPointerPosition(e);
    if (point === null) {
      setPoint([x, y])
    }
    else {
      setPoint([x, y])
    }
    setpolypoints((prev) => [...prev, [x, y]]);
    console.log(polypoints)
  }

  const nexpointforpoly = (e) => {
    if (point === null) return;
    if (!drawdragcheck) {
      dispatch(setdrawingstarted(true))
    }

    const { x, y } = getPointerPosition(e);
    setNextpoint(`${x},${y}`)

  }




  const boardStyle = {
    width: viewportwidth + 'vw',
    height: 'auto',
    position: 'relative',
    // backgroundColor: 'green',
    aspectRatio: '1.62',
    zIndex: 20,

  };

  

  const [polygons, setPolygons] = useState([])

  return (
    <div>
      <div
        style={boardStyle}
        className="flex justify-center relative   items-center "
      >
        <svg
          onContextMenu={(e) => drawpolygonstatus2(e)}
          ref={svgRef}
          width="100%"
          height='100%'
          // height='auto'
          // viewBox="0 0 500 500"
          style={{ margin: '0', padding: '0', display: 'block', position: 'relative' }}

          onMouseDown={(e) => {

            draw(e);
          }}
          onMouseMove={(e) => {
            drag(e);
            drawlines(e);
            draglines(e);
            nexpointforpoly(e);
            // e.preventDefault()
            // drawpolygon(e);
          }}
          onMouseUp={(e) => {
            // e.preventDefault()
            if (dragline) {
              // dispatch(setdrawpolystatus(false))
            }
            // e.stopPropagation()
            stopDragging(e)
          }}
          onClick={(e) => {
  
              startdrawingpolygon(e);
            
          }}
          // onMouseLeave={stopDragging}
          onTouchStart={(e) => draw(e)}
          onTouchMove={(e) => {

            drag(e);
            drawlines(e);
            draglines(e);
          }}
          onTouchEnd={stopDragging}
          onTouchCancel={stopDragging}
        >

          {lines.map((line, index) => (
            <Line className='z-30' key={index} aline={line} index={index} lines={lines} startdragline={startdragline} startDragging={startDragging} setDragelement={setDragelement} />
          ))}
          {
            polygons.map((polygon, index) => (
              <Polygon key={index} polygon={polygon} startdragline={startdragline} setOveranobject={setOveranobject} setDragelement={setDragelement} index={index} startDragging={startDragging}
              />
            ))
          }

          {(line != null) && <line
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            style={{ cursor: 'pointer' }}
            stroke="black"
            strokeWidth="5"
            strokeLinecap="round"

          />}
          <polygon points={`${polygon} ${(nextpoint != null) ? nextpoint : ''}`}
            style={{ cursor: '' }}
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"

          />
          {polypoints.map((point, index) => (
            <circle
              key={index}
              cx={point[0]}
              cy={point[1]}
              r="5"
              fill="blue"
              cursor="pointer"
              onClick={(e) => {
                e.stopPropagation();
                drawpolygonstatus2(e)
              }}
              onMouseDown={(event) => {
                event.stopPropagation();
                startDragging(event, 'polygon');
                setDragelement({ type: 'polygon', index: index });
              }}

            />
          ))}
        </svg>
      </div>
    </div>

  );
};

export default Drawingboard;


// <g>
// <line
// x1={line.x1}
// y1={line.y1}
// x2={line.x2}
// y2={line.y2}
// style={{ cursor: 'pointer' }}
// stroke="black"
// strokeWidth="2"
// strokeLinecap="round"
// onMouseDown={(e) => {
// e.stopPropagation();
// startdragline(e);
// }}
// />
// <circle
// cx={line.x1}
// cy={line.y1}
// r="5"
// fill="red"
// cursor="pointer"
// onMouseDown={(event) => {
// event.stopPropagation();
// startDragging(event, 'start');
// }}
// onTouchStart={(event) => startDragging(event, 'start')}
// />
// <circle
// cx={line.x2}
// cy={line.y2}
// r="5"
// fill="blue"
// cursor="pointer"
// onMouseDown={(event) => {
// event.stopPropagation();
// startDragging(event, 'end');
// }}
// onTouchStart={(event) => startDragging(event, 'end')}
// />
// </g>