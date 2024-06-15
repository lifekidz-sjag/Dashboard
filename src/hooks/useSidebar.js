import { useCallback, useState } from "react";

const useSidebar = () => {
  const [sidebar, setSidebar] = useState({
    isOpen: false,
    sidebar: null,
    dependencies: {},
  });

  const toggleSidebar = open => {
    setSidebar(prevState => {
      if (open) {
        document.querySelector("html").style.overflow = "hidden";
        document.querySelector("body").style.overflow = "hidden";

        return {
          ...prevState,
          isOpen: open,
        };
      }
      document.querySelector("html").style.overflow = "auto";
      document.querySelector("body").style.overflow = "auto";

      return {
        ...prevState,
        isOpen: open,
        sidebar: null,
      };
    });
  };

  const open = useCallback(() => {
    toggleSidebar(true);
  }, [setSidebar]);

  const close = useCallback(
    func => {
      if (func && typeof func === "function") {
        func();
      }
      toggleSidebar(false);
    },
    [setSidebar],
  );

  // const ids = [{ id: "1", content: <>test</> }];
  // Set Content Function
  // Set ID
  //

  // Get Content Function
  // Get ID
  // const getID = useCallback(id => {
  //   return ids.find(obj => {
  //     return obj.id === id;
  //   });
  // }, []);

  return {
    isOpen: sidebar.isOpen,
    dependencies: sidebar.dependencies,
    sidebar: sidebar.sidebar,
    setSidebar,
    open,
    close,
  };
};

export default useSidebar;
