import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useOutletContext } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Avatar,
  Box,
  Chip,
  Rating,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import * as yup from "yup";

import BlankImage from "../assets/sjag_blank.gif";
import { FormSelect } from "../components/FormInput";
import ArrowBack from "../components/GoogleIcons/ArrowBack";
import ArrowDownward from "../components/GoogleIcons/ArrowDownward";
import ArrowForward from "../components/GoogleIcons/ArrowForward";
import ArrowUpward from "../components/GoogleIcons/ArrowUpward";
import useClasses from "../services/classes";
import useReportStudent from "../services/reportStudent";
import useStudents from "../services/students";

const ReportsStudents = () => {
  dayjs.extend(utc);
  const contextProps = useOutletContext();
  const [studentData, setStudentData] = useState(null);
  const { user, actionBarDefault, setActionBar, loader } = contextProps;
  const theme = useTheme();

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  // FORM FIELDS SET UP
  // YUP Schema
  const [classOptions, setClassOptions] = useState([]);
  const [studentOptions, setStudentOptions] = useState([]);
  const { fetch: fetchClasses } = useClasses();
  const { getStudentByClass: fetchStudents } = useStudents();

  const [{ data: fetchClassesData }, fetchClassesExecute] = fetchClasses;

  const [{ data: fetchStudentsData }, fetchStudentsExecute] = fetchStudents;

  const { fetch: fetchReportStudent } = useReportStudent();
  const [{ data: fetchReportStudentData }, fetchReportStudentExecute] =
    fetchReportStudent;
  const filterSchema = yup.object({
    class: yup.string(),
    student: yup.string(),
  });

  const { control, getValues, setValue } = useForm({
    defaultValues: {
      class: "",
      student: "",
    },
    resolver: yupResolver(filterSchema),
  });

  const classFilter = () => {
    setValue("class", getValues("class"), {
      shouldValidate: true,
    });
    return null;
  };

  const studentFilter = () => {
    setValue("student", getValues("student"), {
      shouldValidate: true,
    });
    return null;
  };
  const onChangeClass = async data => {
    fetchStudentsExecute({
      params: {
        "filter[classId]": data.class,
      },
    });
    setValue("student", "");
    setStudentData(null);
  };

  const onChangeStudent = async data => {
    fetchReportStudentExecute({
      params: {
        "filter[class]": data.class,
        "filter[student]": data.student,
        "filter[startDate]": `${
          dayjs(new Date())
            .subtract(3, "month")
            .startOf("day")
            .utc()
            .format("YYYY-MM-DDTHH:mm:ssZ")
            .split("+")[0]
        }Z`,
        "filter[endDate]": `${
          dayjs(new Date())
            .endOf("day")
            .utc()
            .format("YYYY-MM-DDTHH:mm:ssZ")
            .split("+")[0]
        }Z`,
      },
    });
  };

  useEffect(() => {
    if (user && user.role.indexOf("admin") < 0) {
      setActionBar({
        ...actionBarDefault,
        title: {
          enabled: true,
          display: true,
          name: "Reports - Students",
        },
      });
    } else {
      loader.end();
      setActionBar({
        ...actionBarDefault,
        title: {
          enabled: true,
          display: true,
          name: "Reports - Students",
        },
      });

      fetchClassesExecute({ params: { sort: "name" } });
    }
  }, []);

  useEffect(() => {
    if (fetchStudentsData && fetchStudentsData) {
      setStudentOptions(
        fetchStudentsData.map(data => ({
          label: data.name,
          value: data.id,
        })),
      );
    }

    return () => {};
  }, [fetchStudentsData]);

  useEffect(() => {
    if (fetchClassesData && fetchClassesData.data) {
      setClassOptions(
        fetchClassesData.data.map(data => ({
          label: data.name,
          value: data.id,
        })),
      );
    }

    return () => {};
  }, [fetchClassesData]);

  useEffect(() => {
    if (fetchReportStudentData) {
      setStudentData(fetchReportStudentData);
    }
  }, [fetchReportStudentData]);

  const renderFigures = (figure, increment, desc1, desc2, showChanges) => {
    const formatted = figure;

    let showHideChanges = showChanges;
    if (increment === 0) {
      showHideChanges = "none";
    }

    return (
      <Box
        className="card"
        sx={{
          flex: { xs: "1 1 100%", md: "unset" },
          marginTop: { xs: "16px", md: "0px" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <Typography variant={isSmallScreen ? "h5" : "h5"}>
            {formatted}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginLeft: "8px",
            }}
          >
            <Chip
              avatar={
                <Avatar
                  sx={{
                    width: "16px !important",
                    height: "16px !important",
                    backgroundColor:
                      increment > 0
                        ? theme.palette.success.dark
                        : theme.palette.error.dark,
                  }}
                >
                  {increment > 0 ? (
                    <ArrowUpward fontSize="12px" />
                  ) : (
                    <ArrowDownward fontSize="12px" />
                  )}
                </Avatar>
              }
              label={`${Math.abs(increment)}%`}
              variant="filled"
              sx={{
                ".MuiChip-label": {
                  paddingX: "4px",
                },
                display: showHideChanges,
                justifyContent: "space-around",
                height: "24px",
                width: "70px",
                backgroundColor:
                  increment > 0
                    ? theme.palette.success.light
                    : theme.palette.error.light,
                color:
                  increment > 0
                    ? theme.palette.success.dark
                    : theme.palette.error.secondary,
              }}
            />
          </Box>
        </Box>
        <Box sx={{ textAlign: "left", marginTop: "4px" }}>
          <Typography variant={isSmallScreen ? "body2" : "body2"}>
            {desc1}
          </Typography>
          <Typography
            variant={isSmallScreen ? "body2" : "body2"}
            sx={{ color: "white", marginTop: "4px" }}
          >
            {desc2}
          </Typography>
        </Box>
      </Box>
    );
  };
  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Box sx={{ width: "180px", marginBottom: "16px" }}>
          <FormSelect
            name="class"
            variant="outlined"
            control={control}
            label="Filter by"
            options={classOptions}
            customOnChange={() => {
              classFilter();
              onChangeClass(getValues());
            }}
          />
        </Box>
        <Box sx={{ width: "300px", marginBottom: "16px", marginLeft: "16px" }}>
          <FormSelect
            name="student"
            variant="outlined"
            control={control}
            label="Filter by"
            disabled={studentOptions.length === 0}
            options={studentOptions}
            customOnChange={() => {
              studentFilter();
              onChangeStudent(getValues());
            }}
          />
        </Box>
      </Box>

      {studentData ? (
        <Box
          sx={{
            margin: "50px auto 0px auto",
            width: { xs: "100%", md: "80%" },
          }}
        >
          <Box
            className="gradient-background"
            sx={{
              height: "100%",
              borderRadius: "20px",
            }}
          >
            <ul className="circles">
              <li />
              <li />
              <li />
              <li />
              <li />
              <li />
              <li />
              <li />
              <li />
              <li />
            </ul>

            <Box
              sx={{
                padding: "24px",
                height: "100%",
                color: "white",
                position: "relative",
              }}
            >
              <Box>
                <Box>
                  <Typography
                    variant={isSmallScreen ? "h5" : "h4"}
                    fontWeight="800"
                  >
                    Summary (3 months)
                  </Typography>
                  <Box sx={{ display: "flex", columnGap: "8px" }}>
                    <Typography
                      variant={isSmallScreen ? "body1" : "h6"}
                      fontWeight="800"
                      sx={{ marginTop: "12px" }}
                    >
                      {dayjs(new Date())
                        .subtract(3, "month")
                        .startOf("day")
                        .utc()
                        .format("YYYY-MM-DD")}{" "}
                    </Typography>
                    <Typography
                      variant={isSmallScreen ? "body1" : "h6"}
                      fontWeight="300"
                      sx={{ marginTop: "12px" }}
                    >
                      to
                    </Typography>
                    <Typography
                      variant={isSmallScreen ? "body1" : "h6"}
                      fontWeight="800"
                      sx={{ marginTop: "12px" }}
                    >
                      {dayjs(new Date())
                        .endOf("day")
                        .utc()
                        .format("YYYY-MM-DD")}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    columnGap: "8px",
                    rowGap: "8px",
                    justifyContent: "space-between",
                    marginTop: "8px",
                  }}
                >
                  <Box sx={{ flex: { xs: 1, lg: "1 0 40%", xl: "1" } }}>
                    {renderFigures(
                      `${
                        studentData.attendanceSummary.averageAttendance * 100
                      }%, ${studentData.attendanceSummary.attendanceCount}`,
                      studentData.attendanceSummary.diffAverageAttendance,
                      "Attendance Rate",
                      `out of ${studentData.attendanceSummary.dayCount} Weeks`,
                      "flex",
                    )}
                  </Box>
                  {studentData.evaluationSummary.criteriaAverages.map(item => {
                    return (
                      <Box
                        key={`${item.averageRating} -${item.criteriaName}`}
                        sx={{ flex: { xs: 1, lg: "1 0 40%", xl: "1" } }}
                      >
                        {renderFigures(
                          item.averageRating.toFixed(1),
                          item.diffAverageRating,
                          `${item.criteriaName}`,
                          `out of ${studentData.attendanceSummary.dayCount} Weeks`,
                          "flex",
                        )}
                      </Box>
                    );
                  })}
                </Box>
              </Box>
              <Box
                sx={{
                  marginTop: "16px",
                }}
              >
                <Box>
                  {/* Header */}
                  <Box
                    sx={{
                      display: "flex",
                      paddingY: "16px",
                      fontSize: { xs: "16px", md: "20px" },
                    }}
                  >
                    <Box sx={{ flex: { xs: "1", md: "0.5" } }}>Date</Box>
                    {!isSmallScreen && <Box sx={{ flex: "0.5" }}>In / Out</Box>}
                    <Box sx={{ flex: { xs: "0.8", md: "1.3" } }}>
                      Evaluation
                    </Box>
                    {!isSmallScreen && <Box sx={{ flex: "0.5" }}>Rating</Box>}
                  </Box>
                  {studentData.attendance.map((item, i) => {
                    return (
                      <Box key={item.date} sx={{ display: "flex" }}>
                        {!isSmallScreen && (
                          <Typography
                            sx={{
                              flex: "0.5",
                              fontSize: { xs: "16px", md: "16px" },
                              fontWeight: "800",
                              marginBottom: "16px",
                            }}
                          >
                            {dayjs(item.date).utc().format("DD-MM-YYYY")}
                          </Typography>
                        )}

                        <Box sx={{ flex: { xs: "1", md: "0.5" } }}>
                          {isSmallScreen && (
                            <Typography
                              sx={{
                                flex: "0.5",
                                fontSize: { xs: "16px", md: "16px" },
                                fontWeight: "800",
                                marginBottom: "16px",
                              }}
                            >
                              {dayjs(item.date).utc().format("DD-MM-YYYY")}
                            </Typography>
                          )}
                          <Typography
                            sx={{
                              flex: "0.5",
                              alignItems: "center",
                              display: "flex",
                              fontSize: { xs: "16px", md: "16px" },
                              marginBottom: "16px",
                            }}
                          >
                            <ArrowForward />
                            {dayjs(item.clockIn).utc().format("hh:mm A")}
                          </Typography>
                          <Typography
                            sx={{
                              flex: "0.5",
                              alignItems: "center",
                              display: "flex",

                              fontSize: { xs: "16px", md: "16px" },
                              marginBottom: "16px",
                            }}
                          >
                            <ArrowBack />
                            {dayjs(item.clockOut).utc().format("hh:mm A")}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            flex: { xs: "0.8", md: "1.8" },
                            fontSize: "16px",
                            marginBottom: "16px",
                          }}
                        >
                          {studentData.evaluation[i].evaluations.map(e => {
                            return (
                              <Box
                                key={`${e.criteriaName}-${item.date}`}
                                sx={{ display: { xs: "block", md: "flex" } }}
                              >
                                <Typography
                                  sx={{
                                    display: "block",
                                    marginBottom: "8px",
                                    flex: "0.8",
                                  }}
                                >
                                  {e.criteriaName}
                                </Typography>

                                <Rating
                                  readOnly
                                  defaultValue={parseInt(e.rating, 10)}
                                />
                              </Box>
                            );
                          })}
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            width: "100%",
            textAlign: "center",
            marginY: "60px",
          }}
        >
          <Box component="img" src={BlankImage} />
          <Typography variant="h4" sx={{ marginTop: "8px" }}>
            It’s empty here.
          </Typography>
          <Typography variant="body1" sx={{ marginTop: "8px" }}>
            There isn’t any data available for that yet. Check back later.
          </Typography>
        </Box>
      )}
    </>
  );
};

export default ReportsStudents;
