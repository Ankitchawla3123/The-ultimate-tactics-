import { useEffect, useState } from "react";
import useBreakpoint from "./useBreakpoint";

function useViewportResize() {
  const [viewport, setviewport] = useState(56);
  const breakpoint = useBreakpoint();
  useEffect(() => {
    if (breakpoint === "sm" || breakpoint === "xs") {
      setviewport(94.824);
    } else if (
      breakpoint === "md" &&
      (window.innerHeight > window.innerWidth ||
        window.innerHeight > window.innerWidth)
    ) {
      setviewport(94.824);
    } else if (breakpoint === "md") {
      setviewport(63.216);
    } else if (breakpoint === "lg") {
      setviewport(59);
    } else {
      setviewport(59);
    }
  }, [breakpoint, window.innerHeight]);
  return viewport;
}
export default useViewportResize;
