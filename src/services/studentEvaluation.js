import useApiService from "../hooks/useApiService";

const useStudentEvaluation = () => {
  const apiEndpoint = `StudentEvaluation`;
  return useApiService(apiEndpoint);
};

export default useStudentEvaluation;
