import useApiService from "../hooks/useApiService";

const useReportsClasses = () => {
  const apiEndpoint = `Reports/Attendances`;
  return useApiService(apiEndpoint);
};

export default useReportsClasses;
