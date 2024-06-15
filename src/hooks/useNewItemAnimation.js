import { useCallback, useEffect, useState } from "react";

const useNewItemAnimation = ({ snackbar }) => {
  // Scroll
  // Initial hide
  // Add row slide down
  // Fade in

  const [newItemAnimation, setNewItemAnimation] = useState({
    newItem: null,
    callbackFunc: null,
  });

  const [newItemNode, setNewItemNode] = useState(null);

  const measuredRef = useCallback(node => {
    if (node !== null) {
      setNewItemNode(node);
    }
  }, []);

  useEffect(() => {
    if (newItemNode) {
      newItemNode.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });

      setTimeout(() => {
        if (newItemAnimation.callbackFunc) {
          newItemAnimation.callbackFunc();
        }
        setTimeout(() => {
          newItemNode.classList.add("expand");
          setTimeout(() => {
            newItemNode.classList.add("show", "animate-start");
          }, 300);
        }, 100);
      }, [300]);
    }
  }, [newItemNode]);

  useEffect(() => {
    if (
      !snackbar.isOpen &&
      newItemNode &&
      newItemNode.classList.contains("animate-start")
    ) {
      newItemNode.classList.remove("animate-start");
    }
  }, [snackbar.isOpen]);

  const nodeRefFunc = useCallback((condition, node) => {
    if (condition) {
      measuredRef(node);
    }
  }, []);

  const className = useCallback(condition => {
    if (condition) {
      return "list-new-item";
    }
    return null;
  }, []);

  return {
    newItemAnimation,
    setNewItemAnimation,
    className,
    nodeRefFunc,
  };
};

export default useNewItemAnimation;
