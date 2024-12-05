import useApiService from "../hooks/useApiService";

const useBible = () => {
  const apiEndpoint = `Bible`;
  return useApiService(apiEndpoint);
};

export default useBible;
