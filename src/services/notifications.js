import useApiService from "../hooks/useApiService";

const useNotifications = () => {
  const apiEndpoint = `Notifications`;
  return useApiService(apiEndpoint);
};

export default useNotifications;
