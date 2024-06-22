import { useEffect, useState } from "react";

import useNotifications from "../../services/notifications";

const useFetchNotifications = ({
  loader,
  paging,
  sharedState,
  sharedFunction,
}) => {
  // Native states
  const [list, setList] = useState({});

  const [callbackFunc, setCallbackFunc] = useState(() => () => null);
  // API service
  const { fetch: fetchNotifications } = useNotifications();
  const [
    { data: fetchNotificationsData, error: fetchNotificationsError },
    fetchNotificationsExecute,
  ] = fetchNotifications;

  const handleFetch = params => {
    const modifiedParams = params;
    // params can include all type of filter and sort
    // default key

    if (modifiedParams && Object.keys(modifiedParams).length) {
      modifiedParams["page[size]"] = 10;
      fetchNotificationsExecute({
        params: modifiedParams,
      });
    } else {
      // Default

      fetchNotificationsExecute({
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
    fetchNotificationsExecute &&
    paging(list, fetchNotificationsExecute, sharedState.searchStatus);

  // Side Effects
  useEffect(() => {
    if (fetchNotificationsData && fetchNotificationsData.data) {
      setList(fetchNotificationsData);
    }

    return () => {};
  }, [fetchNotificationsData]);
  useEffect(() => {
    if (fetchNotificationsError) {
      //
    }

    return () => {};
  }, [fetchNotificationsError]);
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

useFetchNotifications.propTypes = {};

export default useFetchNotifications;
