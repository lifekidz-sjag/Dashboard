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

  const getGroupedAttendanceEndpoint = "Attendances/Grouped";

  const [
    {
      data: getGroupedAttendanceData,
      loading: getGroupedAttendanceLoading,
      error: getGroupedAttendanceError,
    },
    getGroupedAttendanceExecuteBase,
  ] = useAxios(
    {
      url: getGroupedAttendanceEndpoint,
      method: "GET",
    },
    { manual: true },
  );
  const getGroupedAttendanceExecute = params => {
    getGroupedAttendanceExecuteBase({
      url: getGroupedAttendanceEndpoint,
      params: params.params,
    });
  };

  const getDetailedAttendanceEndpoint = "Attendances/Detailed";

  const [
    {
      data: getDetailedAttendanceData,
      loading: getDetailedAttendanceLoading,
      error: getDetailedAttendanceError,
    },
    getDetailedAttendanceExecuteBase,
  ] = useAxios(
    {
      url: getDetailedAttendanceEndpoint,
      method: "GET",
    },
    { manual: true },
  );
  const getDetailedAttendanceExecute = params => {
    getDetailedAttendanceExecuteBase({
      url: getDetailedAttendanceEndpoint,
      params: params.params,
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
    getGroupedAttendance: [
      {
        data: getGroupedAttendanceData,
        loading: getGroupedAttendanceLoading,
        error: getGroupedAttendanceError,
      },
      getGroupedAttendanceExecute,
    ],
    getDetailedAttendance: [
      {
        data: getDetailedAttendanceData,
        loading: getDetailedAttendanceLoading,
        error: getDetailedAttendanceError,
      },
      getDetailedAttendanceExecute,
    ],
  };
};

export default useAttendances;
