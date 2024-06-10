import { useCallback, useState } from "react";

const useConfirm = () => {
  const [confirm, setConfirm] = useState({
    isOpen: false,
    title: "",
    content: "",
    confirm: {},
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

  const open = useCallback(
    (title, content, targetConfirm, targetCancel) => {
      setConfirm(prevState => {
        return {
          ...prevState,
          isOpen: true,
          title,
          content,
          confirm: targetConfirm,
          cancel: {
            ...cancel,
            ...targetCancel,
          },
        };
      });
    },
    [setConfirm],
  );

  return {
    isOpen: confirm.isOpen,
    open,
    close,
    title: confirm.title,
    content: confirm.content,
    confirm: confirm.confirm,
    cancel: confirm.cancel,
  };
};

export default useConfirm;
