import { useCallback, useState } from "react";

const useNoPermissionConfirm = () => {
  const [confirm, setConfirm] = useState({
    isOpen: false,
    cancel: {},
  });

  const close = useCallback(() => {
    setConfirm(prevState => {
      return {
        ...prevState,
        isOpen: false,
      };
    });
  }, [setConfirm]);

  const cancel = {
    onClick: () => {
      close();
    },
  };

  const open = useCallback(() => {
    setConfirm(prevState => {
      return {
        ...prevState,
        isOpen: true,
        cancel,
      };
    });
  }, [setConfirm]);

  return {
    isOpen: confirm.isOpen,
    open,
    close,
    cancel: confirm.cancel,
  };
};

export default useNoPermissionConfirm;
