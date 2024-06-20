import { useEffect, useState } from "react";

import useClasses from "../../services/classes";
import useClassesEvaluaton from "../../services/classesEvaluation";

const useFetchClassesEvaluation = ({
  classId,
  loader,
  paging,
  snackbar,
  sharedState,
  sharedFunction,
}) => {
  // Native states
  const [list, setList] = useState({});

  const [callbackFunc, setCallbackFunc] = useState(() => () => null);
  // API service
  const { fetch: fetchClassesEvaluation } = useClassesEvaluaton(classId);
  const [
    { data: fetchClassesEvaluationData, error: fetchClassesEvaluationError },
    fetchClassesEvaluationExecute,
  ] = fetchClassesEvaluation;

  const { get: getClass } = useClasses();
  const [{ data: getClassData, error: getClassError }, getClassExecute] =
    getClass;

  const handleFetch = params => {
    const modifiedParams = params;
    // params can include all type of filter and sort
    // default key

    if (modifiedParams && Object.keys(modifiedParams).length) {
      modifiedParams["page[size]"] = 10;
      fetchClassesEvaluationExecute({
        params: modifiedParams,
      });
    } else {
      // Default

      fetchClassesEvaluationExecute({
        params: {
          sort: "-status",
          "page[size]": 10,
        },
      });
    }
    getClassExecute(classId);
  };

  const onFetch = param => {
    if (param) {
      const { params, cb } = param;
      if (cb) {
        setCallbackFunc(cb);
      } else {
        setCallbackFunc(null);
      }
      handleFetch(params);
    } else {
      handleFetch({});
    }
  };

  const { paginationComponent } =
    list &&
    fetchClassesEvaluationExecute &&
    paging(list, fetchClassesEvaluationExecute, sharedState.searchStatus);

  // Side Effects
  useEffect(() => {
    if (fetchClassesEvaluationData && fetchClassesEvaluationData.data) {
      setList(fetchClassesEvaluationData);
    }

    return () => {};
  }, [fetchClassesEvaluationData]);
  useEffect(() => {
    if (fetchClassesEvaluationError) {
      //
    }

    return () => {};
  }, [fetchClassesEvaluationError]);
  useEffect(() => {
    if (list) {
      if (sharedState.searchStatus === "searching") {
        sharedFunction.setSearchStatus("found");
      }
      loader.end();
    }

    return () => {};
  }, [list]);
  useEffect(() => {
    if (callbackFunc && loader.loading === 0) {
      callbackFunc();
    }

    return () => {};
  }, [callbackFunc, loader.loading]);

  useEffect(() => {
    if (getClassData) {
      sharedFunction.setClassName(getClassData.name);
    }
  }, [getClassData]);
  useEffect(() => {
    if (getClassError) {
      loader.end();
      switch (getClassError.response.data) {
        case "INVALID_ID":
          snackbar.open("Something went wrong. Plaese try again later", true);
          break;

        default:
          break;
      }
    }
    loader.end();
    return () => {};
  }, [getClassError]);
  return {
    list,
    paginationComponent,
    onFetch,
  };
};

useFetchClassesEvaluation.propTypes = {};

export default useFetchClassesEvaluation;
