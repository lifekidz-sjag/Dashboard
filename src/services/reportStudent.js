import useApiService from "../hooks/useApiService";

const useReportStudent = () => {
  const apiEndpoint = `ReportsStudent/Evaluation`;
  return useApiService(apiEndpoint);
};

export default useReportStudent;
