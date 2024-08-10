// utils/HeightAndWidthofplayer.js

// Define default dimensions for different breakpoints
const dimensionsByBreakpoint = {
    90: { width: 3.68, height: 3.68 }, // Example values for breakpoint 90
    60: { width: 2.46, height: 2.46 }, // Example values for breakpoint 60
    default: { width: 2.30, height: 2.30 } // Default values
  };
  
  // Function to get dimensions based on breakpoint
  export const getPlayerDimensions = (breakpoint) => {
    return dimensionsByBreakpoint[breakpoint] || dimensionsByBreakpoint.default;
  };
  