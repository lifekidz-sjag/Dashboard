import { useEffect, useState } from "react";

import useClasses from "../../services/classes";
import useTeachers from "../../services/teachers";

const useFetchTeachers = ({ loader, paging, sharedState, sharedFunction }) => {
  // Native states
  const [list, setList] = useState({});
  const [classes, setClasses] = useState({});

  const [callbackFunc, setCallbackFunc] = useState(() => () => null);
  // API service
  const { fetch: fetchClasses } = useClasses();
  const { fetch: fetchTeachers } = useTeachers();
  const [
    { data: fetchClassesData, error: fetchClassesError },
    fetchClassesExecute,
  ] = fetchClasses;
  const [
    { data: fetchTeachersData, error: fetchTeachersError },
    fetchTeachersExecute,
  ] = fetchTeachers;

  const handleFetch = params => {
    const modifiedParams = params;
    // params can include all type of filter and sort
    // default key

    if (modifiedParams && Object.keys(modifiedParams).length) {
      modifiedParams["page[size]"] = 10;
      fetchTeachersExecute({
        params: modifiedParams,
      });
    } else {
      // Default

      fetchTeachersExecute({
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
    fetchTeachersExecute &&
    paging(list, fetchTeachersExecute, sharedState.searchStatus);

  // Side Effects
  useEffect(() => {
    if (fetchTeachersData && fetchTeachersData.data) {
      setList(fetchTeachersData);
    }

    return () => {};
  }, [fetchTeachersData]);

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
    if (fetchTeachersError) {
      //
    }

    return () => {};
  }, [fetchTeachersError]);
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

useFetchTeachers.propTypes = {};

export default useFetchTeachers;
