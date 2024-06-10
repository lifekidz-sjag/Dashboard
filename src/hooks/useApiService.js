import useAxios, { transformUrl } from "./useAxios";

const useApiService = apiEndpoint => {
  const [
    { data: fetchData, loading: fetchLoading, error: fetchError },
    fetchExecuteBase,
  ] = useAxios(
    {
      url: apiEndpoint,
    },
    { manual: true },
  );

  const [
    { data: getData, loading: getLoading, error: getError },
    getExecuteBase,
  ] = useAxios(
    {
      url: apiEndpoint,
    },
    { manual: true },
  );

  const [
    { data: postData, loading: postLoading, error: postError },
    postExecuteBase,
  ] = useAxios(
    {
      url: apiEndpoint,
      method: "POST",
    },
    { manual: true },
  );

  const [
    { data: putData, loading: putLoading, error: putError },
    putExecuteBase,
  ] = useAxios(
    {
      url: apiEndpoint,
      method: "PUT",
    },
    { manual: true },
  );
  const [
    { data: deleteData, loading: deleteLoading, error: deleteError },
    deleteExecuteBase,
  ] = useAxios(
    {
      url: apiEndpoint,
      method: "DELETE",
    },
    { manual: true },
  );

  const fetchExecute = fetchExecuteBase;

  const getExecute = id => {
    getExecuteBase({
      url: transformUrl(apiEndpoint, id),
    });
  };

  const postExecute = body => {
    postExecuteBase({
      url: apiEndpoint,
      data: body,
    });
  };
  const putExecute = (id, body) => {
    putExecuteBase({
      url: transformUrl(apiEndpoint, id),
      data: body,
    });
  };
  const deleteExecute = id => {
    deleteExecuteBase({
      url: transformUrl(apiEndpoint, id),
    });
  };

  return {
    fetch: [
      { data: fetchData, loading: fetchLoading, error: fetchError },
      fetchExecute,
    ],
    get: [{ data: getData, loading: getLoading, error: getError }, getExecute],
    post: [
      { data: postData, loading: postLoading, error: postError },
      postExecute,
    ],
    put: [{ data: putData, loading: putLoading, error: putError }, putExecute],
    del: [
      { data: deleteData, loading: deleteLoading, error: deleteError },
      deleteExecute,
    ],
  };
};

export default useApiService;
