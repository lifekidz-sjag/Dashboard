import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useOutletContext, useParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Chip,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import quarterOfYear from "dayjs/plugin/quarterOfYear";
import utc from "dayjs/plugin/utc";
import * as yup from "yup";

import BlankImage from "../assets/sjag_blank.gif";
import { FormDateRangePicker, FormSelect } from "../components/FormInput";
import Visibility from "../components/GoogleIcons/Visibility";
import useAttendances from "../services/attendances";
import useClasses from "../services/classes";

const attendanceCountWidth = "1";
const dateWidth = "1";
const moreActionWidth = "0 0 40px";

const CustomizedListItemButton = styled(ListItemButton, {
  shouldForwardProp: prop => prop !== "open",
})(() => ({
  cursor: "default",
}));

const CustomizedListItemText = styled(
  ({ children, sx }) => {
    return (
      <ListItemText disableTypography sx={{ ...sx, marginX: "16px" }}>
        {children}
      </ListItemText>
    );
  },
  {
    shouldForwardProp: prop => prop !== "open",
  },
)(() => ({}));

const CustomizedDivider = styled(() => (
  <Divider orientation="vertical" variant="middle" flexItem />
))(() => ({}));

const ClassAttendances = () => {
  const theme = useTheme();

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  dayjs.extend(utc);
  dayjs.extend(quarterOfYear);
  const { user, loader, popup, setActionBar, actionBarDefault } =
    useOutletContext();
  const [list, setList] = useState([]);
  const [className, setClassName] = useState("");
  const [studentCount, setStudentCount] = useState(0);

  const { id } = useParams();

  const { getGroupedAttendance, getDetailedAttendance } = useAttendances();
  const [
    { data: getGroupedAttendanceData, error: getGroupedAttendanceError },
    getGroupedAttendanceExecute,
  ] = getGroupedAttendance;
  const [
    { data: getDetailedAttendanceData, error: getDetailedAttendanceError },
    getDetailedAttendanceExecute,
  ] = getDetailedAttendance;
  const { get: getClass } = useClasses();
  const [{ data: getClassData, error: getClassError }, getClassExecute] =
    getClass;

  // FORM FIELDS SET UP
  // YUP Schema
  // 1. Project Filter Schema

  const dataFilterSchema = yup.object({
    dataFilter: yup.string(),
    dataDate: yup.string(),
  });
  // Select Set Up
  const filterByOptions = [
    { label: "Today", value: "today" },
    { label: "This Week", value: "thisWeek" },
    { label: "Last Week", value: "lastWeek" },
    { label: "This Month", value: "thisMonth" },
    { label: "Last Month", value: "lastMonth" },
    { label: "This Quarter", value: "thisQuarter" },
    { label: "Last Quarter", value: "lastQuarter" },
    { label: "Custom", value: "custom" },
  ];
  // React Hook Form Set Up
  const { control, formState, getValues, setValue, watch, reset } = useForm({
    defaultValues: {
      dataFilter: "thisMonth",
      dataDate: [
        dayjs(new Date()).startOf("month"),
        dayjs(new Date()).startOf("day"),
      ],
    },
    resolver: yupResolver(dataFilterSchema),
  });
  const dateFilterOnChange = watch("dataFilter");
  watch("dataDate");

  // API Callback
  const getFilterParam = ({ data, classId }) => {
    const dataDate = (data && data.dataDate) || [
      dayjs(new Date()).startOf("month"),
      dayjs(new Date()).startOf("day"),
    ];
    dayjs.extend(utc);

    const startDate = `${
      dataDate[0].utc().format("YYYY-MM-DDTHH:mm:ssZ").split("+")[0]
    }Z`;
    const endDate = `${
      dataDate[1].utc().format("YYYY-MM-DDTHH:mm:ssZ").split("+")[0]
    }Z`;
    const params = {
      "filter[startDate]": startDate,
      "filter[endDate]": endDate,
      "filter[classId]": classId,
    };
    return params;
  };

  const onChange = async data => {
    loader.start();
    getGroupedAttendanceExecute({
      params: getFilterParam({ data, classId: id }),
    });
  };

  const onView = date => {
    getDetailedAttendanceExecute({
      params: {
        "filter[targetDate]": date,
        "filter[classId]": id,
      },
    });
  };

  const defaultDateFilter = () => {
    switch (getValues("dataFilter")) {
      case "today":
        setValue(
          "dataDate",
          [dayjs(new Date()).startOf("day"), dayjs(new Date()).startOf("day")],
          {
            shouldValidate: true,
          },
        );

        break;

      case "thisWeek":
        setValue(
          "dataDate",
          [dayjs(new Date()).startOf("week"), dayjs(new Date()).startOf("day")],
          {
            shouldValidate: true,
          },
        );
        break;
      case "lastWeek":
        setValue(
          "dataDate",
          [
            dayjs(new Date())
              .startOf("day")
              .subtract(1, "week")
              .startOf("week"),
            dayjs(new Date()).startOf("day").subtract(1, "week").endOf("week"),
          ],
          {
            shouldValidate: true,
          },
        );
        break;
      case "thisMonth":
        setValue(
          "dataDate",
          [
            dayjs(new Date()).startOf("month"),
            dayjs(new Date()).startOf("day"),
          ],
          {
            shouldValidate: true,
          },
        );
        break;
      case "lastMonth":
        setValue(
          "dataDate",
          [
            dayjs(new Date()).startOf("month").subtract(1, "month"),
            dayjs(new Date())
              .startOf("day")
              .subtract(1, "month")
              .endOf("month"),
          ],
          {
            shouldValidate: true,
          },
        );
        break;
      case "thisQuarter":
        setValue(
          "dataDate",
          [
            dayjs(new Date()).startOf("quarter"),
            dayjs(new Date()).startOf("day"),
          ],
          {
            shouldValidate: true,
          },
        );

        break;
      case "lastQuarter":
        setValue(
          "dataDate",
          [
            dayjs(new Date()).startOf("quarter").subtract(1, "quarter"),
            dayjs(new Date())
              .startOf("quarter")
              .subtract(1, "quarter")
              .endOf("quarter"),
          ],
          {
            shouldValidate: true,
          },
        );

        break;
      case "custom":
        break;

      default:
        break;
    }
    return null;
  };

  const [firstDatePicked, setFirstDatePicked] = useState(dayjs(null));
  const [secondDatePicked, setSecondDatePicked] = useState(dayjs(null));
  const renderStatusChip = status => {
    let statusText = "";
    let backgroundColor = "";
    let color = "";
    switch (status) {
      case "Clocked Out":
        statusText = "Clocked Out";
        backgroundColor = theme.palette.success.main;
        color = theme.palette.secondary.contrastText;
        break;
      case "Default Clocked Out":
        statusText = "System Clocked Out";
        backgroundColor = theme.palette.info.main;
        color = theme.palette.secondary.contrastText;
        break;
      case "Clocked In":
        statusText = "Clocked In";
        backgroundColor = theme.palette.warning.main;
        color = theme.palette.warning.contrastText;
        break;
      case "Absent":
        statusText = "Absent";
        backgroundColor = theme.palette.error.main;
        color = theme.palette.error.contrastText;
        break;
      default:
        statusText = "NONE";
        break;
    }
    return isSmallScreen ? (
      <Box
        sx={{
          width: "16px",
          height: "16px",
          borderRadius: "50%",
          background: backgroundColor,
        }}
      />
    ) : (
      <Chip
        label={statusText}
        sx={{
          backgroundColor,
          color,
          width: "auto",
          height: "24px",
          "& .MuiChip-label": {
            overflow: "unset !important",
            paddingX: "0px !important",
          },
          paddingX: "8px !important",
        }}
      />
    );
  };

  useEffect(() => {
    if (user && user.role.indexOf("admin") < 0) {
      setActionBar({
        ...actionBarDefault,
        title: {
          enabled: true,
          display: true,
          name: "Attendance List",
        },
      });
    } else {
      loader.start();

      getGroupedAttendanceExecute({
        params: getFilterParam({ classId: id }),
      });
      getClassExecute(id);

      reset({
        dataFilter: "thisMonth",
        dataDate: [
          dayjs(new Date()).startOf("month"),
          dayjs(new Date()).startOf("day"),
        ],
      });
    }
  }, []);

  useEffect(() => {
    if (className) {
      setActionBar({
        ...actionBarDefault,
        title: {
          enabled: true,
          display: true,
          name: `${className} - Attendance List`,
        },
      });
    }
  }, [className]);

  useEffect(() => {
    if (getGroupedAttendanceData && getGroupedAttendanceData.groupedDate) {
      setList(getGroupedAttendanceData.groupedDate);
      setStudentCount(getGroupedAttendanceData.totalCount);
      loader.end();
    }
  }, [getGroupedAttendanceData]);

  useEffect(() => {
    if (getGroupedAttendanceData && getGroupedAttendanceData.groupedDate) {
      setList(getGroupedAttendanceData.groupedDate);
      setStudentCount(getGroupedAttendanceData.totalCount);
      loader.end();
    }
  }, [getGroupedAttendanceData]);

  useEffect(() => {
    if (getClassData) {
      setClassName(getClassData.name);
    }
  }, [getClassData]);
  const defaultClockedOutTime = dayjs(new Date())
    .utc()
    .set("hour", 12)
    .set("minute", 0)
    .set("second", 0)
    .set("millisecond", 0)
    .format("YYYY-MM-DDTHH:mm:ss[Z]");

  const renderCondition = clockOutTime => {
    if (clockOutTime === defaultClockedOutTime) {
      return "Default Clocked Out";
    }
    return "Clocked Out";
  };
  useEffect(() => {
    if (getDetailedAttendanceData) {
      popup.open(
        "List of attendance",
        {},
        {
          onClick: () => {
            popup.close();
          },
        },
        "flex-start",
        <List>
          {getDetailedAttendanceData.map((el, index) => {
            return (
              <ListItem key={el.clockIn}>
                <CustomizedListItemText disableTypography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography
                      sx={{ display: "inline", marginRight: "16px" }}
                      component="span"
                      variant="body1"
                      color="text.primary"
                    >
                      {index + 1}. {el.studentName}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      textAlign: "left",
                      marginTop: "8px",
                      marginLeft: "16px",
                    }}
                  >
                    {el.clockIn === "0001-01-01T00:00:00" ? null : (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {renderStatusChip("Clocked In")}
                        <Typography
                          sx={{ marginLeft: "8px" }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {dayjs(el.clockIn).utc().format("DD-MM-YYYY hh:mm A")}
                        </Typography>
                      </Box>
                    )}
                    {el.clockOut === "0001-01-01T00:00:00" ? null : (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          marginTop: "8px",
                        }}
                      >
                        {renderStatusChip(renderCondition(el.clockOut))}
                        <Typography
                          sx={{ marginLeft: "8px" }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {dayjs(el.clockOut)
                            .utc()
                            .format("DD-MM-YYYY hh:mm A")}
                        </Typography>
                      </Box>
                    )}
                    {el.clockIn === "0001-01-01T00:00:00" &&
                      el.clockOut === "0001-01-01T00:00:00" &&
                      renderStatusChip(el.status)}
                  </Box>
                </CustomizedListItemText>
              </ListItem>
            );
          })}
        </List>,
      );
    }
  }, [getDetailedAttendanceData]);
  useEffect(() => {}, [getGroupedAttendanceError]);
  useEffect(() => {}, [getDetailedAttendanceError]);
  useEffect(() => {}, [getClassError]);

  const renderMobileList = () => {
    return list && list.length > 0 ? (
      list.map((item, index) => {
        return (
          <ListItem
            key={item.id}
            disablePadding
            sx={{
              borderBottom:
                index === list.length - 1
                  ? "unset"
                  : "1px solid rgba(0,0,0,0.1)",
            }}
          >
            <CustomizedListItemButton
              dense
              disableRipple
              disableTouchRipple
              sx={{
                width: "100%",
                height: "60px",
                paddingLeft: "16px",
                paddingRight: "0px",
                "&.Mui-selected": {
                  backgroundColor: "#E9F2FF",
                },
              }}
            >
              {/* Class Name */}
              <CustomizedListItemText
                disableTypography
                sx={{ flex: dateWidth }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography variant="body1">
                      {dayjs(item.date).format("MMM D, YYYY")}
                    </Typography>
                  </Box>
                </Box>
              </CustomizedListItemText>
              <CustomizedListItemText
                disableTypography
                sx={{
                  flex: attendanceCountWidth,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      cursor: "pointer",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      wordBreak: "break-word",
                      WebkitLineClamp: "1",
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    <Typography variant="body1">
                      {item.value} / {item.studentCount}
                    </Typography>
                  </Box>
                </Box>
              </CustomizedListItemText>
              <CustomizedListItemText
                disableTypography
                sx={{ flex: moreActionWidth }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box>
                    <IconButton
                      onClick={() => {
                        onView(item.date);
                      }}
                    >
                      <Visibility />
                    </IconButton>
                  </Box>
                </Box>
              </CustomizedListItemText>
            </CustomizedListItemButton>
          </ListItem>
        );
      })
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
    );
  };
  const renderDesktopList = () => {
    return list.length > 0 ? (
      <>
        {list.map((item, index) => {
          return (
            <ListItem
              key={item.id}
              disablePadding
              sx={{
                borderBottom:
                  index === list.length - 1
                    ? "unset"
                    : "1px solid rgba(0,0,0,0.1)",
              }}
            >
              <CustomizedListItemButton
                dense
                disableRipple
                disableTouchRipple
                sx={{
                  height: "60px",
                  "&.Mui-selected": {
                    backgroundColor: "#E9F2FF",
                  },
                  ":hover": {
                    backgroundColor: "transparent",
                  },
                }}
              >
                {/* Class Name */}
                <CustomizedListItemText
                  disableTypography
                  sx={{ flex: dateWidth }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      <Typography variant="body1">
                        {dayjs(item.date).format("MMM D, YYYY")}
                      </Typography>
                    </Box>
                  </Box>
                </CustomizedListItemText>
                {/* Class Description */}
                <CustomizedListItemText
                  disableTypography
                  sx={{
                    flex: attendanceCountWidth,
                    display: { xs: "none", lg: "flex" },
                    justifyContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      cursor: "pointer",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      wordBreak: "break-word",
                      WebkitLineClamp: "1",
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    <Typography variant="body1">
                      {item.value} / {item.studentCount}
                    </Typography>
                  </Box>
                </CustomizedListItemText>
                {/* Lock & More action */}
                <CustomizedListItemText
                  disableTypography
                  sx={{ flex: moreActionWidth }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box>
                      <IconButton
                        onClick={() => {
                          onView(item.date);
                        }}
                      >
                        <Visibility />
                      </IconButton>
                    </Box>
                  </Box>
                </CustomizedListItemText>
              </CustomizedListItemButton>
            </ListItem>
          );
        })}
      </>
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
    );
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "end",
          marginBottom: "32px",
        }}
      >
        {/* Sort Date */}
        <Box sx={{ width: "180px" }}>
          <FormSelect
            name="dataFilter"
            variant="outlined"
            control={control}
            label="Filter by"
            options={filterByOptions}
            customOnChange={() => {
              defaultDateFilter();
              onChange(getValues());
            }}
          />
        </Box>

        {/* Date Picker */}
        <Box sx={{ marginLeft: "16px", width: "300px" }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <FormDateRangePicker
              name="dataDate"
              control={control}
              formState={formState}
              getValues={getValues}
              customOnChange={(d1, d2) => {
                onChange({
                  dataDate: [d1, d2],
                });
              }}
              firstDatePicked={firstDatePicked}
              secondDatePicked={secondDatePicked}
              setFirstDatePicked={setFirstDatePicked}
              setSecondDatePicked={setSecondDatePicked}
              dateFilterOnChange={dateFilterOnChange}
            />
          </LocalizationProvider>
        </Box>
      </Box>
      {(() => {
        if (list) {
          if (list.length > 0) {
            if (isSmallScreen) {
              return (
                <List
                  sx={{
                    width: "100%",
                    borderRadius: { xs: "24px 24px 0px 0px", md: "8px" },
                    backgroundColor: "background.paper",
                  }}
                >
                  {/* Header */}
                  <ListItem disablePadding>
                    <CustomizedListItemButton
                      dense
                      disableRipple
                      disableTouchRipple
                      // disable Hover on header
                      sx={{
                        ":hover": {
                          backgroundColor: "transparent",
                        },
                        paddingLeft: "16px",
                        paddingRight: "0px",
                      }}
                    >
                      <CustomizedListItemText
                        disableTypography
                        sx={{
                          flex: dateWidth,
                        }}
                      >
                        <Box
                          role="button"
                          sx={{ display: "flex", alignItems: "center" }}
                        >
                          <Typography variant="body1">Date</Typography>
                        </Box>
                      </CustomizedListItemText>
                      <CustomizedListItemText
                        disableTypography
                        sx={{
                          flex: attendanceCountWidth,
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <Box
                          role="button"
                          sx={{ display: "flex", alignItems: "center" }}
                        >
                          <Typography variant="body1">Attend. Count</Typography>
                        </Box>
                      </CustomizedListItemText>
                      {/* Lock & More action */}
                      <CustomizedListItemText
                        disableTypography
                        sx={{ flex: moreActionWidth }}
                      />
                    </CustomizedListItemButton>
                  </ListItem>
                  {renderMobileList()}
                </List>
              );
            }
            return (
              <List
                sx={{
                  width: "100%",
                  borderRadius: "8px",
                  backgroundColor: "background.paper",
                }}
              >
                {/* Header */}
                <ListItem disablePadding>
                  <CustomizedListItemButton
                    dense
                    disableRipple
                    disableTouchRipple
                    // disable Hover on header
                    sx={{
                      ":hover": {
                        backgroundColor: "transparent",
                      },
                      minHeight: "50px",
                    }}
                  >
                    <CustomizedListItemText
                      disableTypography
                      sx={{
                        flex: dateWidth,
                      }}
                    >
                      <Box
                        role="button"
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <Typography variant="body1">Date</Typography>
                      </Box>
                    </CustomizedListItemText>
                    <CustomizedDivider />
                    {/* Class Description */}
                    <CustomizedListItemText
                      disableTypography
                      sx={{
                        flex: attendanceCountWidth,
                        display: { xs: "none", lg: "flex" },
                        justifyContent: "center",
                      }}
                    >
                      <Box
                        role="button"
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <Typography variant="body1">Attend. Count</Typography>
                      </Box>
                    </CustomizedListItemText>

                    {/* Lock & More action */}
                    <CustomizedListItemText
                      disableTypography
                      sx={{ flex: moreActionWidth }}
                    />
                  </CustomizedListItemButton>
                </ListItem>

                {renderDesktopList()}
              </List>
            );
          }
          return (
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
          );
        }
        return null;
      })()}
    </Box>
  );
};

ClassAttendances.propTypes = {};

export default ClassAttendances;
