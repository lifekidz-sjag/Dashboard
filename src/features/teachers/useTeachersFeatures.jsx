import { useEffect, useState } from "react";

import useNewItemAnimation from "../../hooks/useNewItemAnimation";

import useAddTeacher from "./useAddTeacher";
import useDeleteTeacher from "./useDeleteTeacher";
import useFetchTeachers from "./useFetchTeachers";
import useSearchTeachers from "./useSearchTeachers";
import useSortTeachers from "./useSortTeachers";
import useUpdateTeacher from "./useUpdateTeacher";

const useTeachersFeatures = ({ contextProps }) => {
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

  const fetchTeachers = useFetchTeachers({
    loader,
    paging,
    sharedState,
    sharedFunction,
  });

  const sortTeachers = useSortTeachers({
    loader,
    fetchList: fetchTeachers.onFetch,
  });

  const searchTeachers = useSearchTeachers({
    loader,
    fetchList: fetchTeachers.onFetch,
    sharedFunction,
  });

  const addTeacher = useAddTeacher({
    loader,
    sidebar,
    snackbar,
    noPermissionConfirm,
    user,
    setNewItemAnimation,
    fetchList: fetchTeachers.onFetch,
    sharedState,
    sharedFunction,
  });

  const updateTeacher = useUpdateTeacher({
    loader,
    sidebar,
    snackbar,
    noPermissionConfirm,
    user,
    fetchList: fetchTeachers.onFetch,
    sharedState,
    sharedFunction,
  });

  const deleteTeacher = useDeleteTeacher({
    loader,
    sidebar,
    snackbar,
    confirm,
    noPermissionConfirm,
    user,
    fetchList: fetchTeachers.onFetch,
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
      fetchTeachers,
      sortTeachers,
      searchTeachers,
      addTeacher,
      updateTeacher,
      deleteTeacher,
      newItemAnimate,
    },
    state: {
      searchStatus,
    },
  };
};

useTeachersFeatures.propTypes = {};

export default useTeachersFeatures;
