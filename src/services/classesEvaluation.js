import useApiService from "../hooks/useApiService";

const useClassesEvaluaton = classId => {
  const apiEndpoint = `Classes/${classId}/Evaluation`;
  return useApiService(apiEndpoint);
};

export default useClassesEvaluaton;
