import useApiService from "../hooks/useApiService";

const useReportsClasses = () => {
  const apiEndpoint = `ReportsClass/Attendances`;
  return useApiService(apiEndpoint);
};

export default useReportsClasses;
