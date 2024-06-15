import { useEffect, useState } from "react";

import useClasses from "../../services/classes";

const useFetchClasses = ({ loader, paging, sharedState, sharedFunction }) => {
  // Native states
  const [list, setList] = useState({});

  const [callbackFunc, setCallbackFunc] = useState(() => () => null);
  // API service
  const { fetch: fetchClasses } = useClasses();
  const [
    { data: fetchClassesData, error: fetchClassesError },
    fetchClassesExecute,
  ] = fetchClasses;

  const handleFetch = params => {
    const modifiedParams = params;
    // params can include all type of filter and sort
    // default key

    if (modifiedParams && Object.keys(modifiedParams).length) {
      modifiedParams["page[size]"] = 10;
      fetchClassesExecute({
        params: modifiedParams,
      });
    } else {
      // Default

      fetchClassesExecute({
        params: {
          sort: "-updatedAt",
          "page[size]": 10,
        },
      });
    }
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
    fetchClassesExecute &&
    paging(list, fetchClassesExecute, sharedState.searchStatus);

  // Side Effects
  useEffect(() => {
    if (fetchClassesData && fetchClassesData.data) {
      setList(fetchClassesData);
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

  return {
    list,
    paginationComponent,
    onFetch,
  };
};

useFetchClasses.propTypes = {};

export default useFetchClasses;
