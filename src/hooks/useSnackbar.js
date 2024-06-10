import { useCallback, useState } from "react";

const useSnackbar = () => {
  // Setup the isOpen boilerplate
  const [snackbar, setSnackbar] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  const onClose = useCallback(() => {
    setSnackbar(prevState => {
      return {
        ...prevState,
        isOpen: false,
      };
    });
  }, [setSnackbar]);

  const open = useCallback(
    (message, isError) => {
      setSnackbar(prevState => {
        return {
          ...prevState,
          isOpen: true,
          message,
          type: isError ? "error" : "success",
        };
      });
    },
    [setSnackbar],
  );

  return {
    isOpen: snackbar.isOpen,
    open,
    onClose,
    message: snackbar.message,
    type: snackbar.type,
  };
};

export default useSnackbar;
