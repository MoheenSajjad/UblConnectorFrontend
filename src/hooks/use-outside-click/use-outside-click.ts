import { useEffect, useRef } from "react";

/**
 * A custom hook that detects clicks outside of the specified element
 * @param callback Function to call when a click outside is detected
 * @returns Ref to attach to the element
 */
function useOutsideClick<T extends HTMLElement = HTMLElement>(
  callback: () => void
): React.RefObject<T> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    // Add event listener when the component mounts
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [callback]);

  return ref;
}

export default useOutsideClick;
