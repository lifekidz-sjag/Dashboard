import useApiService from "../hooks/useApiService";

const useAdmins = () => {
  const apiEndpoint = `Admins`;
  return useApiService(apiEndpoint);
};

export default useAdmins;
