import { useEffect, useState } from "react";

import useNewItemAnimation from "../../hooks/useNewItemAnimation";

import useAddClassEvaluation from "./useAddClassEvaluation";
import useDeleteClassEvaluation from "./useDeleteClassEvaluation";
import useFetchClassesEvaluation from "./useFetchClassesEvaluation";
import useSearchClassesEvaluation from "./useSearchClassesEvaluation";
import useUpdateClassEvaluation from "./useUpdateClassEvaluation";

const useClassesEvaluationFeatures = ({ classId, contextProps }) => {
  // DONE
  // List
  // Add
  // Manage / Edit
  // Delete
  // Search

  const { loader, paging, snackbar, sidebar, confirm, setActionBar } =
    contextProps;
  // Shared state
  const [action, setAction] = useState("View");
  const [id, setId] = useState("");
  const [searchStatus, setSearchStatus] = useState("none");
  const [searchParams, setSearchParams] = useState({});
  const [className, setClassName] = useState("");

  const sharedState = { action, id, searchStatus, searchParams, className };

  const sharedFunction = {
    setAction,
    setId,
    setSearchStatus,
    setSearchParams,
    setClassName,
  };

  const newItemAnimate = useNewItemAnimation({ snackbar });
  const { setNewItemAnimation } = newItemAnimate;

  const fetchClassesEvaluation = useFetchClassesEvaluation({
    classId,
    loader,
    paging,
    snackbar,
    sharedState,
    sharedFunction,
  });

  const searchClassesEvaluation = useSearchClassesEvaluation({
    loader,
    fetchList: fetchClassesEvaluation.onFetch,
    sharedFunction,
  });
  const addClassEvaluation = useAddClassEvaluation({
    classId,
    loader,
    sidebar,
    snackbar,
    setNewItemAnimation,
    fetchList: fetchClassesEvaluation.onFetch,
    sharedFunction,
  });

  const updateClassEvaluation = useUpdateClassEvaluation({
    classId,
    loader,
    sidebar,
    snackbar,
    fetchList: fetchClassesEvaluation.onFetch,
    sharedState,
    sharedFunction,
  });

  const deleteClassEvaluation = useDeleteClassEvaluation({
    classId,
    loader,
    sidebar,
    snackbar,
    confirm,
    fetchList: fetchClassesEvaluation.onFetch,
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
      fetchClassesEvaluation,
      searchClassesEvaluation,
      addClassEvaluation,
      updateClassEvaluation,
      deleteClassEvaluation,
      newItemAnimate,
    },
    state: {
      searchStatus,
      className,
    },
  };
};

useClassesEvaluationFeatures.propTypes = {};

export default useClassesEvaluationFeatures;
