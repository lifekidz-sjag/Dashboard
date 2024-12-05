import { useCallback, useState } from "react";

import Confirm from "../components/Confirm";
import NoPermissionConfirm from "../components/NoPermissionConfirm";
import Popup from "../components/Popup";
import Sidebar from "../components/Sidebar";
import Snackbar from "../components/Snackbar";

import useConfirm from "./useConfirm";
import useLoader from "./useLoader";
import useNoPermissionConfirm from "./useNoPermissionConfirm";
import usePaging from "./usePaging";
import usePopup from "./usePopup";
import useSidebar from "./useSidebar";
import useSnackbar from "./useSnackbar";

const useSJAG = () => {
  const actionBarDefault = {
    title: { enabled: false, name: "", display: false },
    description: { enabled: false, name: "", display: false },
    fab: {
      enabled: false,
      display: false,
      action: () => {},
    },
    fabClock: {
      enabled: false,
      display: false,
      action: () => {},
    },
    search: {
      enabled: false,
      display: false,
      isOpen: false,
      searchResult: "none",
      renderContent: () => {},
      searchFunc: () => {},
      submitFunc: () => {},
      backFunc: () => {},
    },
  };
  const [actionBar, setActionBarDefault] = useState(actionBarDefault);

  const setActionBar = useCallback(
    params => {
      setActionBarDefault(prevState => {
        return {
          ...prevState,
          ...params,
        };
      });
    },
    [setActionBarDefault],
  );

  const confirm = useConfirm();
  const noPermissionConfirm = useNoPermissionConfirm();

  const sidebar = useSidebar();
  const snackbar = useSnackbar();
  const popup = usePopup();

  const loader = useLoader();
  const useSetPaging = (inp, func, reset) => {
    return usePaging(inp || { pageSize: 0, listDetails: {} }, func, reset);
  };

  const render = () => {
    return (
      <>
        <NoPermissionConfirm {...noPermissionConfirm} />
        <Confirm {...confirm} />
        <Snackbar {...snackbar} />
        <Sidebar {...sidebar} />
        <Popup {...popup}>{popup.popupContent}</Popup>
      </>
    );
  };

  return {
    sharedComponents: render(),
    sharedState: {
      loader,
      confirm,
      noPermissionConfirm,
      sidebar,
      snackbar,
      popup,
      paging: useSetPaging,
      actionBarDefault,
      actionBar,
      setActionBar,
    },
  };
};

export default useSJAG;
