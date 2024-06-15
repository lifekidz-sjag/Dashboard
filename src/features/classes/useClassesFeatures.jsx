import { useEffect, useState } from "react";

import useNewItemAnimation from "../../hooks/useNewItemAnimation";

import useAddClass from "./useAddClass";
import useDeleteClass from "./useDeleteClass";
import useFetchClasses from "./useFetchClasses";
import useSearchClasses from "./useSearchClasses";
import useSortClasses from "./useSortClasses";
import useUpdateClass from "./useUpdateClass";

const useClassesFeatures = ({ contextProps }) => {
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

  const fetchClasses = useFetchClasses({
    loader,
    paging,
    sharedState,
    sharedFunction,
  });

  const sortClasses = useSortClasses({
    loader,
    fetchList: fetchClasses.onFetch,
  });

  const searchClasses = useSearchClasses({
    loader,
    fetchList: fetchClasses.onFetch,
    sharedFunction,
  });

  const addClass = useAddClass({
    loader,
    sidebar,
    snackbar,
    noPermissionConfirm,
    user,
    setNewItemAnimation,
    fetchList: fetchClasses.onFetch,
    sharedFunction,
  });

  const updateClass = useUpdateClass({
    loader,
    sidebar,
    snackbar,
    noPermissionConfirm,
    user,
    fetchList: fetchClasses.onFetch,
    sharedState,
    sharedFunction,
  });

  const deleteClass = useDeleteClass({
    loader,
    sidebar,
    snackbar,
    confirm,
    noPermissionConfirm,
    user,
    fetchList: fetchClasses.onFetch,
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
      fetchClasses,
      sortClasses,
      searchClasses,
      addClass,
      updateClass,
      deleteClass,
      newItemAnimate,
    },
    state: {
      searchStatus,
    },
  };
};

useClassesFeatures.propTypes = {};

export default useClassesFeatures;
