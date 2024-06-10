import { useCallback, useState } from "react";

const usePopup = () => {
  const [popup, setPopup] = useState({
    popupContent: null,
    isOpen: false,
    title: "",
    popup: {},
    cancel: {},
    type: "",
  });
  const [popupButton, setPopupButton] = useState(true);
  const [customAttr, setCustomAttr] = useState("");

  const close = useCallback(() => {
    setPopup(prevState => {
      return {
        ...prevState,
        isOpen: false,
      };
    });
  }, [setPopup]);

  const cancel = {
    onClick: () => {
      close();
    },
  };

  const open = useCallback(
    (title, targetPopup, targetCancel, type, popupContent) => {
      setPopup(prevState => {
        return {
          ...prevState,
          isOpen: true,
          title,
          customAttr,
          popupContent,
          popup: targetPopup,
          cancel: {
            ...cancel,
            ...targetCancel,
          },
          type,
        };
      });
    },
    [setPopup],
  );
  return {
    popupContent: popup.popupContent,
    isOpen: popup.isOpen,
    open,
    close,
    title: popup.title,
    popup: popup.popup,
    cancel: popup.cancel,
    popupButton,
    setPopupButton,
    customAttr,
    setCustomAttr,
    type: popup.type,
  };
};

export default usePopup;
