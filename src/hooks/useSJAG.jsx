import { useCallback, useState } from "react";

import Confirm from "../components/Confirm";
import Popup from "../components/Popup";
import Sidebar from "../components/Sidebar";
import Snackbar from "../components/Snackbar";

import useConfirm from "./useConfirm";
import useLoader from "./useLoader";
import usePaging from "./usePaging";
import usePopup from "./usePopup";
import useSidebar from "./useSidebar";
import useSnackbar from "./useSnackbar";

const useXTOPIA = () => {
  const [actionBar, setActionBarDefault] = useState({
    title: { enabled: false, name: "", display: false },
    description: { enabled: false, name: "", display: false },
    fab: {
      type: "",
      enabled: false,
      display: false,
      action: () => {},
    },
    breadcrumb: {
      enabled: false,
      display: false,
      homeClick: () => {},
      nextLevelClick: () => {},
      items: [],
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
    multiSelect: {
      enabled: false,
      display: false,
      isOpen: false,
      selected: 0,
    },
    viewButton: {
      enabled: false,
      display: false,
      selected: "list",
    },
  });

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
      sideBar: sidebar,
      snackbar,
      popup,
      paging: useSetPaging,
      actionBar,
      setActionBar,
    },
  };
};

export default useXTOPIA;
