import { useEffect, useState } from "react";

import useAdmins from "../../services/admins";

const useFetchAdmins = ({ loader, paging, sharedState, sharedFunction }) => {
  // Native states
  const [list, setList] = useState({});

  const [callbackFunc, setCallbackFunc] = useState(() => () => null);
  // API service
  const { fetch: fetchAdmins } = useAdmins();
  const [
    { data: fetchAdminsData, error: fetchAdminsError },
    fetchAdminsExecute,
  ] = fetchAdmins;

  const handleFetch = params => {
    const modifiedParams = params;
    // params can include all type of filter and sort
    // default key

    if (modifiedParams && Object.keys(modifiedParams).length) {
      modifiedParams["page[size]"] = 10;
      fetchAdminsExecute({
        params: modifiedParams,
      });
    } else {
      // Default

      fetchAdminsExecute({
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
    fetchAdminsExecute &&
    paging(list, fetchAdminsExecute, sharedState.searchStatus);

  // Side Effects
  useEffect(() => {
    if (fetchAdminsData && fetchAdminsData.data) {
      setList(fetchAdminsData);
    }

    return () => {};
  }, [fetchAdminsData]);
  useEffect(() => {
    if (fetchAdminsError) {
      //
    }

    return () => {};
  }, [fetchAdminsError]);
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

useFetchAdmins.propTypes = {};

export default useFetchAdmins;
