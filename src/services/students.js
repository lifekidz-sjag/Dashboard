import useAxios from "axios-hooks";

import useApiService from "../hooks/useApiService";

const useStudents = () => {
  const apiEndpoint = `Students`;
  const apiService = useApiService(apiEndpoint);

  const getStudentByNameEndpoint = "Students/{name}/name";
  const [
    {
      data: getStudentByNameData,
      loading: getStudentByNameLoading,
      error: getStudentByNameError,
    },
    getStudentByNameExecuteBase,
  ] = useAxios(
    {
      url: getStudentByNameEndpoint,
      method: "POST",
    },
    { manual: true },
  );
  const getStudentByNameExecute = name => {
    getStudentByNameExecuteBase({
      url: getStudentByNameEndpoint.replace("{name}", name),
    });
  };
  return {
    ...apiService,
    getStudentByName: [
      {
        data: getStudentByNameData,
        loading: getStudentByNameLoading,
        error: getStudentByNameError,
      },
      getStudentByNameExecute,
    ],
  };
};

export default useStudents;
