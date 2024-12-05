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
      method: "GET",
    },
    { manual: true },
  );
  const getStudentByNameExecute = name => {
    getStudentByNameExecuteBase({
      url: getStudentByNameEndpoint.replace("{name}", name),
    });
  };

  const getStudentByClassEndpoint = "Students/ByClass";
  const [
    {
      data: getStudentByClassData,
      loading: getStudentByClassLoading,
      error: getStudentByClassError,
    },
    getStudentByClassExecuteBase,
  ] = useAxios(
    {
      url: getStudentByClassEndpoint,
      method: "GET",
    },
    { manual: true },
  );
  const getStudentByClassExecute = params => {
    getStudentByClassExecuteBase({
      url: getStudentByClassEndpoint,
      params: params.params,
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

    getStudentByClass: [
      {
        data: getStudentByClassData,
        loading: getStudentByClassLoading,
        error: getStudentByClassError,
      },
      getStudentByClassExecute,
    ],
  };
};

export default useStudents;
