'use client';

import * as React from "react";

const DEFAULT_MOBILE_BREAKPOINT = 768;

/**
 * Returns `true` when the viewport is below the given breakpoint.
 *
 * @param breakpoint - Width in pixels. Defaults to 768.
 */
export function useIsMobile(breakpoint: number = DEFAULT_MOBILE_BREAKPOINT) {
  const [isMobile, setIsMobile] = React.useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < breakpoint;
  });

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };
    mql.addEventListener("change", onChange);
    // Sync in case breakpoint prop changed
    setIsMobile(window.innerWidth < breakpoint);
    return () => mql.removeEventListener("change", onChange);
  }, [breakpoint]);

  return isMobile;
}
