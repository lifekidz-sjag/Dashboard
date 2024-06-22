import { useEffect, useState } from "react";

import useNewItemAnimation from "../../hooks/useNewItemAnimation";

import useAddNotification from "./useAddNotification";
import useDeleteNotifications from "./useDeleteNotifications";
import useFetchNotifications from "./useFetchNotifications";
import useSearchNotifications from "./useSearchNotifications";
import useSortNotifications from "./useSortNotifications";
import useUpdateNotification from "./useUpdateNotification";

const useNotificationsFeatures = ({ contextProps }) => {
  // DONE
  // List
  // Add
  // Manage / Edit
  // Delete
  // Search

  const {
    user,
    loader,
    snackbar,
    sidebar,
    confirm,
    noPermissionConfirm,
    paging,
    setActionBar,
  } = contextProps;
  // Shared state
  const [action, setAction] = useState("View");
  const [id, setId] = useState("");
  const [searchStatus, setSearchStatus] = useState("none");
  const [searchParams, setSearchParams] = useState({});

  const sharedState = { action, id, searchStatus, searchParams };

  const sharedFunction = {
    setAction,
    setId,
    setSearchStatus,
    setSearchParams,
  };

  const newItemAnimate = useNewItemAnimation({ snackbar });
  const { setNewItemAnimation } = newItemAnimate;

  const fetchNotifications = useFetchNotifications({
    loader,
    paging,
    sharedState,
    sharedFunction,
  });

  const sortNotifications = useSortNotifications({
    loader,
    fetchList: fetchNotifications.onFetch,
  });

  const searchNotifications = useSearchNotifications({
    loader,
    fetchList: fetchNotifications.onFetch,
    sharedFunction,
  });

  const addNotification = useAddNotification({
    loader,
    sidebar,
    snackbar,
    noPermissionConfirm,
    user,
    setNewItemAnimation,
    fetchList: fetchNotifications.onFetch,
    sharedFunction,
  });

  const updateNotification = useUpdateNotification({
    loader,
    sidebar,
    snackbar,
    noPermissionConfirm,
    user,
    fetchList: fetchNotifications.onFetch,
    sharedState,
    sharedFunction,
  });

  const deleteNotification = useDeleteNotifications({
    loader,
    sidebar,
    snackbar,
    confirm,
    noPermissionConfirm,
    user,
    fetchList: fetchNotifications.onFetch,
    sharedState,
    sharedFunction,
  });

  // dependencies
  useEffect(() => {
    setActionBar({
      // search: {
      //   ...actionBar.search,
      //   renderContent: searchWebpages.searchBarContent,
      //   searchFunc: searchWebpages.searchFunc,
      //   submitFunc: searchWebpages.submitFunc,
      //   backFunc: searchWebpages.backFunc,
      // },
    });
  }, [searchStatus]);

  return {
    features: {
      fetchNotifications,
      sortNotifications,
      searchNotifications,
      addNotification,
      updateNotification,
      deleteNotification,
      newItemAnimate,
    },
    state: {
      searchStatus,
    },
  };
};

useNotificationsFeatures.propTypes = {};

export default useNotificationsFeatures;
