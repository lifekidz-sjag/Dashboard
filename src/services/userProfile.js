import useApiService from "../hooks/useApiService";

const apiEndpoint = "Users/Profile";

const useUserProfileService = () => {
  return useApiService(apiEndpoint);
};

export default useUserProfileService;
