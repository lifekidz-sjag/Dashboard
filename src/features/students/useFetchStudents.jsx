import { useEffect, useState } from "react";

import useClasses from "../../services/classes";
import useStudents from "../../services/students";

const useFetchStudents = ({ loader, paging, sharedState, sharedFunction }) => {
  // Native states
  const [list, setList] = useState({});
  const [classes, setClasses] = useState({});

  const [callbackFunc, setCallbackFunc] = useState(() => () => null);
  // API service
  const { fetch: fetchClasses } = useClasses();
  const { fetch: fetchStudents } = useStudents();
  const [
    { data: fetchClassesData, error: fetchClassesError },
    fetchClassesExecute,
  ] = fetchClasses;
  const [
    { data: fetchStudentsData, error: fetchStudentsError },
    fetchStudentsExecute,
  ] = fetchStudents;

  const handleFetch = params => {
    const modifiedParams = params;
    // params can include all type of filter and sort
    // default key

    if (modifiedParams && Object.keys(modifiedParams).length) {
      modifiedParams["page[size]"] = 10;
      fetchStudentsExecute({
        params: modifiedParams,
      });
    } else {
      // Default

      fetchStudentsExecute({
        params: {
          sort: "-updatedAt",
          "page[size]": 10,
        },
      });
    }
  };

  const onFetch = param => {
    fetchClassesExecute();
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
    fetchStudentsExecute &&
    paging(list, fetchStudentsExecute, sharedState.searchStatus);

  // Side Effects
  useEffect(() => {
    if (fetchStudentsData && fetchStudentsData.data) {
      setList(fetchStudentsData);
    }

    return () => {};
  }, [fetchStudentsData]);

  useEffect(() => {
    if (fetchClassesData && fetchClassesData.data) {
      setClasses(fetchClassesData);
    }

    return () => {};
  }, [fetchClassesData]);

  useEffect(() => {
    if (fetchClassesError) {
      //
    }

    return () => {};
  }, [fetchClassesError]);
  useEffect(() => {
    if (fetchStudentsError) {
      //
    }

    return () => {};
  }, [fetchStudentsError]);
  useEffect(() => {
    if (list && classes) {
      if (sharedState.searchStatus === "searching") {
        sharedFunction.setSearchStatus("found");
      }
      loader.end();
    }

    return () => {};
  }, [list, classes]);
  useEffect(() => {
    if (callbackFunc && loader.loading === 0) {
      callbackFunc();
    }

    return () => {};
  }, [callbackFunc, loader.loading]);

  return {
    list,
    classes,
    paginationComponent,
    onFetch,
  };
};

useFetchStudents.propTypes = {};

export default useFetchStudents;
