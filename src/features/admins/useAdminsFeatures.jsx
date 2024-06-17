import { useEffect, useState } from "react";

import useNewItemAnimation from "../../hooks/useNewItemAnimation";

import useAddAdmin from "./useAddAdmin";
import useDeleteAdmin from "./useDeleteAdmin";
import useFetchAdmins from "./useFetchAdmins";
import useSearchAdmins from "./useSearchAdmins";
import useSortAdmins from "./useSortAdmins";
import useUpdateAdmin from "./useUpdateAdmin";

const useAdminsFeatures = ({ contextProps }) => {
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

  const fetchAdmins = useFetchAdmins({
    loader,
    paging,
    sharedState,
    sharedFunction,
  });

  const sortAdmins = useSortAdmins({
    loader,
    fetchList: fetchAdmins.onFetch,
  });

  const searchAdmins = useSearchAdmins({
    loader,
    fetchList: fetchAdmins.onFetch,
    sharedFunction,
  });

  const addAdmin = useAddAdmin({
    loader,
    sidebar,
    snackbar,
    noPermissionConfirm,
    user,
    setNewItemAnimation,
    fetchList: fetchAdmins.onFetch,
    sharedFunction,
  });

  const updateAdmin = useUpdateAdmin({
    loader,
    sidebar,
    snackbar,
    noPermissionConfirm,
    user,
    fetchList: fetchAdmins.onFetch,
    sharedState,
    sharedFunction,
  });

  const deleteAdmin = useDeleteAdmin({
    loader,
    sidebar,
    snackbar,
    confirm,
    noPermissionConfirm,
    user,
    fetchList: fetchAdmins.onFetch,
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
      fetchAdmins,
      sortAdmins,
      searchAdmins,
      addAdmin,
      updateAdmin,
      deleteAdmin,
      newItemAnimate,
    },
    state: {
      searchStatus,
    },
  };
};

useAdminsFeatures.propTypes = {};

export default useAdminsFeatures;
