import { useEffect, useRef } from "react";

const useDisablePageScroll = () => {
  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, []);
};

const useOuterClick = (callback: () => void) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [callback]);

  return ref;
};

export { useDisablePageScroll, useOuterClick };
