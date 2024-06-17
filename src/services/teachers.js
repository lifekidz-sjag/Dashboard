import useApiService from "../hooks/useApiService";

const useTeachers = () => {
  const apiEndpoint = `Teachers`;
  return useApiService(apiEndpoint);
};

export default useTeachers;
