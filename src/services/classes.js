import useApiService from "../hooks/useApiService";

const useClasses = () => {
  const apiEndpoint = `Classes`;
  return useApiService(apiEndpoint);
};

export default useClasses;
