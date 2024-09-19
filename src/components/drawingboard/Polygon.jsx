import React, { useState } from 'react'

function Polygon({polygon, startdragline,setDragelement,index: polygonIndex, startDragging, setOveranobject}) {
    
    
    return (
        <g className=''>
            <polygon points={`${polygon}`}
                style={{ cursor: '' , zIndex:'20'}}
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                onMouseDown={(e) => {
                    e.stopPropagation();
                    startdragline(e);
                    setDragelement({ type: 'polygon', index:polygonIndex });
                    // setOveranobject(true)
                  }}
                // onMouseEnter={setOveranobject(true)}
              
                // onMouseMove={setOveranobject(true)}
                onMouseLeave={()=>{
                  const timeoutId = setTimeout(() => {
                    setOveranobject(false )
                  } ); // 0.1 seconds = 100 milliseconds
                
                  return () => clearTimeout(timeoutId); 
                }
                }

              

            />
        {polygon.map((point, index) => (
            <circle
              key={index}
              cx={point[0]}
              cy={point[1]}
              r="5"
              fill="blue"
              cursor="pointer"
              onMouseDown={(event) => {
                event.stopPropagation();
                setDragelement({ type: 'polygon', index: index ,index2:polygonIndex  });
                startDragging(event, 'polygon');
                
              }}

            />
          ))}
        </g>
    )
}

export default Polygon