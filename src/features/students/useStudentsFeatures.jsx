import { useEffect, useState } from "react";

import useNewItemAnimation from "../../hooks/useNewItemAnimation";

import useAddStudent from "./useAddStudent";
import useClockInStudent from "./useClockInStudent";
import useClockOutStudent from "./useClockOutStudent";
import useDeleteStudent from "./useDeleteStudent";
import useFetchStudents from "./useFetchStudents";
import useQRCodeStudent from "./useQRCodeStudent";
import useSearchStudents from "./useSearchStudents";
import useSortStudents from "./useSortStudents";
import useUpdateStudent from "./useUpdateStudent";

const useStudentsFeatures = ({ contextProps, popupClockIn, popupClockOut }) => {
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
    popup,
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

  const fetchStudents = useFetchStudents({
    loader,
    paging,
    sharedState,
    sharedFunction,
  });

  const sortStudents = useSortStudents({
    loader,
    fetchList: fetchStudents.onFetch,
  });

  const searchStudents = useSearchStudents({
    loader,
    fetchList: fetchStudents.onFetch,
    sharedFunction,
  });

  const addStudent = useAddStudent({
    loader,
    sidebar,
    snackbar,
    noPermissionConfirm,
    user,
    setNewItemAnimation,
    fetchList: fetchStudents.onFetch,
    sharedState,
    sharedFunction,
  });

  const updateStudent = useUpdateStudent({
    loader,
    sidebar,
    snackbar,
    noPermissionConfirm,
    user,
    fetchList: fetchStudents.onFetch,
    sharedState,
    sharedFunction,
  });

  const deleteStudent = useDeleteStudent({
    loader,
    sidebar,
    snackbar,
    confirm,
    noPermissionConfirm,
    user,
    fetchList: fetchStudents.onFetch,
    sharedState,
    sharedFunction,
  });

  const clockInStudent = useClockInStudent({
    popupClockIn,
    loader,
    snackbar,
    sharedFunction,
  });

  const clockOutStudent = useClockOutStudent({
    popupClockOut,
    sidebar,
    loader,
    popup,
    snackbar,
    sharedFunction,
  });

  const qrCodeStudent = useQRCodeStudent({
    loader,
    snackbar,
    confirm,
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
      fetchStudents,
      sortStudents,
      searchStudents,
      addStudent,
      updateStudent,
      deleteStudent,
      newItemAnimate,
      clockInStudent,
      clockOutStudent,
      qrCodeStudent,
    },
    state: {
      searchStatus,
    },
  };
};

useStudentsFeatures.propTypes = {};

export default useStudentsFeatures;
