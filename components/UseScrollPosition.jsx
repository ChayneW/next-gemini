import { useEffect, useState } from "react";

export function useScrollPosition() {
  const [isAtBottom, setIsAtBottom] = useState(false);

  function handleScroll() {
    const scrolledFromTop = window.innerHeight + window.pageYOffset;
    const documentHeight = document.documentElement.scrollHeight;

    // Check if the user has scrolled to the bottom of the page
    const isBottom = scrolledFromTop === documentHeight;

    setIsAtBottom(isBottom);
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return isAtBottom;
}