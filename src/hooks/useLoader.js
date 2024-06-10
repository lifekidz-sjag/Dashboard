import { useEffect, useRef, useState } from "react";

const useLoader = () => {
  const [loading, setLoading] = useState(-1);
  const [transition, setTransition] = useState(true);
  const timerRef = useRef(null);
  const loadedRef = useRef(null);
  const delay = 300;
  const minLoad = 1500;

  const end = () => {
    window.clearTimeout(timerRef.current);
    if (loadedRef.current) {
      setLoading(0);
      document
        .getElementsByClassName("xtopia-backdrop")[0]
        .classList.remove("active");
      document
        .getElementsByClassName("xtopia-preloader-wrapper")[0]
        .classList.remove("active");
      setTimeout(() => {
        setTransition(false);
        document
          .getElementsByClassName("xtopia-backdrop")[0]
          .classList.add("complete");
        document
          .getElementsByClassName("xtopia-preloader-wrapper")[0]
          .classList.add("complete");
      }, 800);
    }
    document.body.style.overflow = "";
    loadedRef.current = true;
  };

  const start = () => {
    loadedRef.current = true;

    // document.body.style.overflow = "hidden";

    setTransition(true);
    setLoading(1);
  };

  useEffect(() => {
    if (loading === 1) {
      timerRef.current = window.setTimeout(() => {
        loadedRef.current = false;

        setLoading(2);
        document
          .getElementsByClassName("xtopia-backdrop")[0]
          .classList.add("active");
        document
          .getElementsByClassName("xtopia-backdrop")[0]
          .classList.remove("complete");
        document
          .getElementsByClassName("xtopia-preloader-wrapper")[0]
          .classList.add("active");
        document
          .getElementsByClassName("xtopia-preloader-wrapper")[0]
          .classList.remove("complete");

        window.setTimeout(() => {
          end();
        }, minLoad);
      }, delay);
    }
  }, [loading]);

  return {
    loadedRef,
    loading,
    transition,
    start,
    end,
  };
};

export default useLoader;
