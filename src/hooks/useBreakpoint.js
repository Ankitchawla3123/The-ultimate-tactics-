import { useEffect, useState  } from "react";
import { useDispatch } from "react-redux";
import { updatexy } from "../features/players/firstboardPlayersSlice";


function useBreakpoint(){
    const dispatch=useDispatch()
    const [Breakpoint, setBreakpoint] = useState('');
    const [windowsize, setWindowsize] = useState({
        width: undefined,
        height: undefined,
    })

    const handleresize=()=>{
        setWindowsize({
            width:window.innerWidth,
            height:window.innerHeight,
        })
       

        // console.log(Breakpoint);
    }

    useEffect(()=>{
        window.addEventListener('resize',handleresize);
        handleresize();

        if(0<windowsize.width && windowsize.width<600){
            setBreakpoint('xs');
        }
        if(600<=windowsize['width'] && windowsize['width']<960){
            setBreakpoint('sm');
        }
        if(960<=windowsize.width && windowsize.width<1280){
            setBreakpoint('md');
        }
        if (1280 <=windowsize.width && windowsize.width < 1920) {
            setBreakpoint('lg');
          }
        if (windowsize.width >= 1920) {
            setBreakpoint('xl');
          }
          return () => window.removeEventListener('resize', handleresize);
        },[windowsize.width]);
        return Breakpoint;
}

export default useBreakpoint;