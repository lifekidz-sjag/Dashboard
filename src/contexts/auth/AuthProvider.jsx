import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";

import useAuthService from "../../services/auth";
import useUserProfileService from "../../services/userProfile";

import AuthContext from "./AuthContext";

const AuthProvider = ({ children, sharedState }) => {
  const { snackbar, loader } = sharedState;
  const navigate = useNavigate();

  // user info
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOTP, setIsOTP] = useState(false);
  const authStorageKey = import.meta.env.VITE_AUTH_STORAGE_KEY;

  const retrieveAuthKeyValue = key => {
    const authData = JSON.parse(localStorage.getItem(authStorageKey));
    return authData ? authData[key] : null;
  };
  const setAuthKeyValue = (key, value) => {
    const authData = JSON.parse(localStorage.getItem(authStorageKey)) || {};
    authData[key] = value;
    localStorage.setItem(authStorageKey, JSON.stringify(authData));
  };

  const deleteAuthKeyValue = keyArray => {
    const authData = JSON.parse(localStorage.getItem(authStorageKey));
    if (authData) {
      keyArray.forEach(key => {
        delete authData[key];
      });

      if (Object.keys(authData).length === 0) {
        localStorage.removeItem(authStorageKey);
      } else {
        localStorage.setItem(authStorageKey, JSON.stringify(authData));
      }
    }
  };

  const [mfaToken, setMfaToken] = useState(null);

  const reset = array => {
    deleteAuthKeyValue(array);
    setUser(null);
    setMfaToken("");
    setIsOTP(false);
  };

  const checkAuthenticated = () => {
    let authenticated = false;
    if (
      retrieveAuthKeyValue("accessToken") &&
      retrieveAuthKeyValue("refreshToken")
    ) {
      authenticated = true;
    }
    setIsAuthenticated(authenticated);

    if (!authenticated) {
      reset(["accessToken", "refreshToken", "expiration"]);
    }
    return authenticated;
  };

  useEffect(() => {
    checkAuthenticated();
  }, []);

  const { login, logout, token, refresh } = useAuthService();

  const { fetch: getUser } = useUserProfileService();
  const [{ data: getUserData, error: getUserError }, getUserExecute] = getUser;

  const [{ data: loginData, error: loginError }, loginExecute] = login;
  const [, logoutExecute] = logout;
  const [{ data: tokenData, error: tokenError }, tokenExecute] = token;
  const [{ error: refreshError }, refreshExecute] = refresh;

  const SJAGLogin = data => {
    if (data) {
      loginExecute({
        name: data.name,
        password: data.password,
        role: data.role,
      });
    }
  };

  const SJAGGenerateAccessToken = data => {
    if (data) {
      tokenExecute({
        authorizationCode: data,
      });
    }
  };

  const SJAGRefreshAccessToken = async () => {
    if (retrieveAuthKeyValue("refreshToken")) {
      try {
        const resp = await refreshExecute({
          refreshToken: retrieveAuthKeyValue("refreshToken"),
        });

        setAuthKeyValue("accessToken", resp.accessToken);
        setAuthKeyValue("refreshToken", resp.refreshToken);
        setAuthKeyValue("expiration", resp.expiration);

        return resp.accessToken;
      } catch (error) {
        // Error handling
      }
    }
    return null;
  };

  const SJAGLogout = async () => {
    logoutExecute({
      refreshToken: retrieveAuthKeyValue("refreshToken"),
    });
    reset(["accessToken", "refreshToken", "expiration"]);
    navigate("/user/logout");
  };

  const stringToHslColor = (str, s, l) => {
    let hash = 0;
    [...str].forEach((e, i) => {
      hash = str.charCodeAt(i) + ((hash << 5) - hash); // eslint-disable-line no-bitwise
    });

    const h = hash % 360;

    return `hsl(${h}, ${s}%, ${l}%)`;
  };

  useEffect(() => {
    if (getUserData) {
      setUser({
        ...getUserData,
        colorProfile: stringToHslColor(getUserData.name, 40, 60),
      });
    }
  }, [getUserData]);

  useEffect(() => {
    if (getUserError) {
      navigate("/user/login");
    }
  }, [getUserError]);

  useEffect(() => {
    if (loginData) {
      const { authorizationCode } = loginData;

      if (authorizationCode) {
        SJAGGenerateAccessToken(authorizationCode);
      }
    }
  }, [loginData]);

  useEffect(() => {
    if (loginError) {
      switch (loginError.response.data) {
        case "INVALID_EMAIL_OR_PASSWORD":
          snackbar.open(
            "The email or password is incorrect. Please contact admin.",
            true,
          );
          break;

        default:
          break;
      }
    }
  }, [loginError]);

  useEffect(() => {
    if (tokenData) {
      setAuthKeyValue("accessToken", tokenData.accessToken);
      setAuthKeyValue("refreshToken", tokenData.refreshToken);
      setAuthKeyValue("expiration", tokenData.expiration);

      setIsAuthenticated(true);
      loader.start();
      const queryParameters = new URLSearchParams(window.location.search);
      const redirect = queryParameters.get("redirectUrl");

      if (redirect) {
        navigate(redirect);
      } else {
        navigate("/");
      }
    }
  }, [tokenData]);

  useEffect(() => {}, [tokenError]);

  useEffect(() => {}, [refreshError]);

  axios.interceptors.request.use(
    async config => {
      const updatedConfig = config;
      if (retrieveAuthKeyValue("accessToken")) {
        updatedConfig.headers = {
          authorization: `Bearer ${retrieveAuthKeyValue("accessToken")}`,
        };
      }
      return updatedConfig;
    },
    error => Promise.reject(error),
  );

  let isRefreshing = false;
  let refreshSubscribers = [];

  function onRefreshed(t) {
    setTimeout(() => {
      refreshSubscribers.forEach(obj => {
        obj.callback(t);
      });
      refreshSubscribers = [];
    }, 500);
  }

  function addRefreshSubscriber(callback, config) {
    refreshSubscribers.push({ callback, config });
  }

  // response interceptor intercepting 401 responses, refreshing token and retrying the request
  axios.interceptors.response.use(
    response => response,
    async error => {
      const { config } = error;
      // eslint-disable-next-line no-underscore-dangle
      if (error.response?.status === 401 && !config._retry) {
        // we use this flag to avoid retrying indefinitely if
        // getting a refresh token fails for any reason

        if (!isRefreshing) {
          isRefreshing = true;
          // eslint-disable-next-line no-underscore-dangle
          config._retry = true;

          try {
            const newAccessToken = await SJAGRefreshAccessToken();
            if (!newAccessToken) {
              logoutExecute({
                refreshToken: retrieveAuthKeyValue("refreshToken"),
              });

              reset(["accessToken", "refreshToken", "expiration"]);

              window.location.href = `/Dashboard/user/login?redirectUrl=${window.location.pathname.replace(
                "Dashboard",
                "",
              )}`;
              return Promise.reject(error);
            }

            isRefreshing = false;
            onRefreshed(newAccessToken);
          } catch (re) {
            isRefreshing = false;
            return Promise.reject(re);
          }
        }

        return new Promise(resolve => {
          addRefreshSubscriber(t => {
            config.headers.Authorization = `Bearer ${t}`;
            resolve(axios(config));
          }, config);
        });
      }

      return Promise.reject(error);
    },
  );

  const retVal = useMemo(
    () => ({
      user,
      getUserExecute,
      mfaToken,
      SJAGLogin,
      SJAGLogout,
      SJAGRefreshAccessToken,
      isAuthenticated,
      setIsAuthenticated,
      checkAuthenticated,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mfaToken, user, isAuthenticated, isOTP],
  );

  return <AuthContext.Provider value={retVal}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.arrayOf(PropTypes.shape().isRequired).isRequired,
  sharedState: PropTypes.shape().isRequired,
};

export default AuthProvider;
