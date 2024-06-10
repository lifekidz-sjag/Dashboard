// import useApiService from "../../hooks/useApiService";
import useAxios from "../hooks/useAxios";

// const apiEndpoint = "Auth/Login";

const useAuthService = () => {
  // return useApiService(apiEndpoint);

  // Load default functions
  // const apiService = useApiService(apiEndpoint);

  // Add custom function
  // LOGIN
  const loginEndpoint = "Auth/Login";
  const [
    { data: loginData, loading: loginLoading, error: loginError },
    loginExecuteBase,
  ] = useAxios(
    {
      url: loginEndpoint,
      method: "POST",
    },
    { manual: true },
  );
  const loginExecute = body => {
    loginExecuteBase({
      url: loginEndpoint,
      data: body,
    });
  };

  // LOGOUT
  const logoutEndpoint = "Auth/Logout";
  const [
    { data: logoutData, loading: logoutLoading, error: logoutError },
    logoutExecuteBase,
  ] = useAxios(
    {
      url: logoutEndpoint,
      method: "POST",
    },
    { manual: true },
  );
  const logoutExecute = body => {
    logoutExecuteBase({
      url: logoutEndpoint,
      data: body,
    });
  };

  // GENERATE ACCESS TOKEN
  const tokenEndpoint = "Auth/Token";
  const [
    { data: tokenData, loading: tokenLoading, error: tokenError },
    tokenExecuteBase,
  ] = useAxios(
    {
      url: tokenEndpoint,
      method: "POST",
    },
    { manual: true },
  );
  const tokenExecute = body => {
    tokenExecuteBase({
      url: tokenEndpoint,
      data: body,
    });
  };

  // REFRESH TOKEN
  const refreshEndpoint = "Auth/Refresh";
  const [
    { data: refreshData, loading: refreshLoading, error: refreshError },
    refreshExecuteBase,
  ] = useAxios(
    {
      url: refreshEndpoint,
      method: "POST",
    },
    { manual: true },
  );
  const refreshExecute = body => {
    return refreshExecuteBase({
      url: refreshEndpoint,
      data: body,
    }).then(postBody => {
      return postBody.data;
    });
  };

  return {
    // ...apiService,
    login: [
      { data: loginData, loading: loginLoading, error: loginError },
      loginExecute,
    ],
    logout: [
      { data: logoutData, loading: logoutLoading, error: logoutError },
      logoutExecute,
    ],

    token: [
      { data: tokenData, loading: tokenLoading, error: tokenError },
      tokenExecute,
    ],
    refresh: [
      { data: refreshData, loading: refreshLoading, error: refreshError },
      refreshExecute,
    ],
  };
};

export default useAuthService;
