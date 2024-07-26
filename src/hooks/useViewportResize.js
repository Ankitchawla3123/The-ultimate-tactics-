import { useEffect, useState } from "react";
import useBreakpoint from "./useBreakpoint";

function useViewportResize(){
    const [viewport, setviewport] = useState(56)
    const breakpoint=useBreakpoint();
    useEffect(()=>{
        if (breakpoint==='sm' || breakpoint==='xs' ) {
            setviewport(90)
        }

        else if (breakpoint==='md' && window.innerHeight>window.innerWidth) {
            setviewport(90)
        }
        else if(breakpoint==='md'){
            setviewport(60)
        }
        else if(breakpoint==='lg'){
            setviewport(56);
        }
        else{
            setviewport(56);
        }
    },[breakpoint, window.innerHeight])
    return viewport;
}
export default useViewportResize;
