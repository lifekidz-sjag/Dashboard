import useAxios from "axios-hooks";

import useApiService from "../hooks/useApiService";

const useAttendances = () => {
  const apiEndpoint = `Attendances`;
  const apiService = useApiService(apiEndpoint);

  const clockInEndPoint = "Attendances";
  const [
    { data: clockInData, loading: clockInLoading, error: clockInError },
    clockInExecuteBase,
  ] = useAxios(
    {
      url: clockInEndPoint,
      method: "POST",
    },
    { manual: true },
  );
  const clockInExecute = body => {
    clockInExecuteBase({
      url: clockInEndPoint,
      data: body,
    });
  };

  const clockOutEndPoint = "Attendances";
  const [
    { data: clockOutData, loading: clockOutLoading, error: clockOutError },
    clockOutExecuteBase,
  ] = useAxios(
    {
      url: clockOutEndPoint,
      method: "PUT",
    },
    { manual: true },
  );
  const clockOutExecute = body => {
    clockOutExecuteBase({
      url: clockOutEndPoint,
      data: body,
    });
  };
  return {
    ...apiService,
    clockIn: [
      {
        data: clockInData,
        loading: clockInLoading,
        error: clockInError,
      },
      clockInExecute,
    ],
    clockOut: [
      {
        data: clockOutData,
        loading: clockOutLoading,
        error: clockOutError,
      },
      clockOutExecute,
    ],
  };
};

export default useAttendances;
