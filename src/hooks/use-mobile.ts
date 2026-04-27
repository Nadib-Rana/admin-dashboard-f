import { useEffect, useState } from "react";

/**
 * Hook to detect if the viewport is mobile-sized (< 768px)
 * Used for responsive behavior in components
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  useEffect(() => {
    // Set hydration flag to prevent hydration mismatch
    setIsHydrated(true);

    // Initial check
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();

    // Listen for resize events
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Return false during SSR to avoid hydration mismatch
  if (!isHydrated) {
    return false;
  }

  return isMobile;
}
