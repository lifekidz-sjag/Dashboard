import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useOutletContext } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Avatar,
  Box,
  Chip,
  Divider,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
// Import charts, all with Chart suffix
import { LineChart, PieChart } from "echarts/charts";
// import components, all suffixed with Component
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
} from "echarts/components";
// Import the echarts core module, which provides the necessary interfaces for using echarts.
import * as echarts from "echarts/core";
// Import renderer, note that introducing the CanvasRenderer or SVGRenderer is a required step
import { CanvasRenderer } from "echarts/renderers";
import ReactEChartsCore from "echarts-for-react/lib/core";
import moment from "moment";
import PropTypes from "prop-types";
import * as yup from "yup";

import { FormDateRangePicker, FormSelect } from "../components/FormInput";
import ArrowDownward from "../components/GoogleIcons/ArrowDownward";
import ArrowUpward from "../components/GoogleIcons/ArrowUpward";
import useClasses from "../services/classes";
import useReportsClasses from "../services/reportClasses";

const TabPanel = ({ children, value, index }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`simple-tabpanel-${index}`}
    aria-labelledby={`simple-tab-${index}`}
  >
    <Box>{children}</Box>
  </div>
);

TabPanel.propTypes = {
  children: PropTypes.node.isRequired,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const ReportsClasses = () => {
  const { loader, setActionBar, actionBarDefault } = useOutletContext();
  const [list, setList] = useState([]);
  const [classOptions, setClassOptions] = useState([]);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  // API Definition
  const { fetch: fetchClasses } = useClasses();
  const [
    { data: fetchClassesData, error: fetchClassesError },
    fetchClassesExecute,
  ] = fetchClasses;
  const { fetch: fetchReportsClasses } = useReportsClasses();
  const [
    { data: fetchReportsClassesData, error: fetchReportsClassesError },
    fetchReportsClassesExecute,
  ] = fetchReportsClasses;

  const [tabValue, setTabValue] = useState(0);
  echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
    LineChart,
    PieChart,
    CanvasRenderer,
    VisualMapComponent,
  ]);

  const renderFigures = (
    figure,
    unit,
    increment,
    desc1,
    desc2,
    showChanges,
  ) => {
    let formatted = figure;
    let unitDisplay = unit;

    if (figure >= 1000 && unit === "K") {
      const val = figure / 1000;
      formatted = (Math.floor(val * 10) / 10).toFixed(1) + unitDisplay;
    }
    if (figure < 1000 && unit === "K") {
      unitDisplay = "";
      formatted = figure + unitDisplay;
    }
    if (figure >= 60 && unit === "m") {
      const val = figure / 60;
      formatted = `${Math.floor(val)}m ${figure % 60}s`;
      // if (val >= 60) {
      //   const second = figure % 60;
      //   const minute = val % 60;
      //   val /= 60;
      //   formatted = `${Math.floor(val)}h ${Math.floor(minute)}m ${second}s`;
      // } else {
      //   formatted = `${Math.floor(val)}m ${figure % 60}s`;
      // }
    }

    let showHideChanges = showChanges;
    if (increment === 0) {
      showHideChanges = "none";
    }

    return (
      <Box
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
          <Typography variant={isSmallScreen ? "h5" : "h4"}>
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
                display: showHideChanges,
                justifyContent: "space-around",
                height: "24px",
                width: "64px",
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
          <Typography variant={isSmallScreen ? "body2" : "body1"}>
            {desc1}
          </Typography>
          <Typography
            variant={isSmallScreen ? "body2" : "body1"}
            sx={{ color: theme.palette.text.disabled, marginTop: "4px" }}
          >
            {desc2}
          </Typography>
        </Box>
      </Box>
    );
  };

  const chart = (() => {
    const fontFamily = "Inter";
    const formatNum = num => {
      const abbrev = "KMB";
      let base = Math.floor(Math.log(Math.abs(num)) / Math.log(1000));
      const suffix = abbrev[Math.min(2, base - 1)];

      const round = (n, precision) => {
        const prec = 10 ** precision;

        return Math.round(n * prec) / prec;
      };

      base = abbrev.indexOf(suffix) + 1;

      return suffix ? round(num / 1000 ** base, 2) + suffix : num;
    };

    const options = {
      grid: {
        borderColor: "rgba(179, 179, 179, 0.5)",
        left: 30,
        top: 30,
        right: 30,
        bottom: 30,
      },
      title: {
        textStyle: {
          fontFamily,
          color: "rgba(33, 33, 33, .8);",
          fontSize: 14,
          fontWeight: "bold",
        },
        left: "center",
      },
      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderColor: "rgba(179, 179, 179, 0.5)",
        borderWidth: 1,
        padding: [8, 16],
        textStyle: {
          fontFamily,
          color: "rgb(103, 103, 103)",
          fontSize: 14,
        },
      },
      xAxis: {
        type: "category",
        nameGap: 40,
        nameLocation: "middle",
        nameTextStyle: {
          fontFamily,
          color: "rgb(103, 103, 103)",
          fontSize: 14,
        },
        axisLine: {
          lineStyle: {
            color: "rgb(103, 103, 103)",
            width: 1,
          },
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          fontFamily,
          color: "rgb(103, 103, 103)",
        },
      },
      yAxis: {
        type: "value",
        max: value => {
          return value.max + 2;
        },
        minInterval: 1,
        // name: "Amount (RM)",
        nameGap: 50,
        nameLocation: "middle",
        nameTextStyle: {
          fontFamily,
          color: "rgb(103, 103, 103)",
          fontSize: 12,
          fontWeight: "bold",
        },
        axisLine: {
          lineStyle: {
            color: "rgb(103, 103, 103)",
            width: 1,
          },
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          fontFamily,
          color: "rgb(103, 103, 103)",
          formatter(val) {
            return formatNum(val);
          },
        },
      },
      series: [],
    };

    const reducer = (data, key) =>
      data.reduce((arr, el) => {
        const date = moment(el.date).startOf(key);
        let elem = arr.find(x => moment(x.date).isSame(date));

        if (elem === undefined) {
          elem = {
            date: date.toISOString(),
            value: 0,
          };

          arr.push(elem);
        }

        elem.value += el.value;

        return arr;
      }, []);

    const setup = (data, key) => {
      const opts = { ...options };
      const processed = key === "day" ? data : reducer(data, key);

      opts.xAxis.data = processed.map(el =>
        moment(el.date).format("MMM D, YYYY"),
      );
      opts.series.push({
        type: "line",
        smooth: true,
        data: processed.map(el => el.value),
        itemStyle: {
          color: "rgb(152, 178, 242)",
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: "rgb(152, 178, 242)",
            },
            {
              offset: 1,
              color: "rgb(177, 130, 238)",
            },
          ]),
        },
      });

      opts.xAxis.axisLabel.formatter = val => {
        if (key === "month") {
          return moment(val).format("MMMM YYYY");
        }

        return val;
      };

      return opts;
    };

    return {
      setup,
    };
  })();

  const pieChart = (() => {
    const options = {
      title: {
        text: "Age Distribution of Class",
        left: "center",
      },
      tooltip: {
        trigger: "item",
      },
      legend: {},

      series: [],
    };

    const setup = data => {
      const opts = { ...options };
      const processed = data;

      opts.series.push({
        type: "pie",
        radius: "50%",
        data:
          processed &&
          processed.map(el => {
            return {
              value: el.studentCount,
              name: `${el.age} years old (${el.studentCount})`,
            };
          }),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      });

      opts.legend = {
        orient: "vertical",
        left: 0,
        bottom: 0,
        data:
          processed &&
          processed.map(el => {
            return `${el.age} years old (${el.studentCount})`;
          }),
      };

      return opts;
    };

    return {
      setup,
    };
  })();

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
    { label: "Yesterday", value: "yesterday" },
    { label: "This Week", value: "thisWeek" },
    { label: "Last Week", value: "lastWeek" },
    { label: "Last 7 days", value: "last7Days" },
    { label: "Last 30 days", value: "last30Days" },
    { label: "Last 90 days", value: "last90Days" },
    { label: "Custom", value: "custom" },
  ];

  // React Hook Form Set Up
  const { control, formState, getValues, setValue, watch, reset } = useForm({
    defaultValues: {
      classFilter: "",
      dataFilter: "last30Days",
      dataDate: [
        dayjs(new Date()).startOf("day").subtract(30, "day"),
        dayjs(new Date()).startOf("day").subtract(1, "day"),
      ],
    },
    resolver: yupResolver(dataFilterSchema),
  });
  const dateFilterOnChange = watch("dataFilter");
  watch("dataDate");

  // API Callback
  const getFilterParam = ({ data, classId }) => {
    const dataDate = (data && data.dataDate) || [
      dayjs(new Date()).startOf("day").subtract(30, "day"),
      dayjs(new Date()).startOf("day").subtract(1, "day"),
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
    fetchReportsClassesExecute({
      params: getFilterParam({ data, classId: data.classFilter }),
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
      case "yesterday":
        setValue(
          "dataDate",
          [
            dayjs(new Date()).startOf("day").subtract(1, "day"),
            dayjs(new Date()).startOf("day").subtract(1, "day"),
          ],
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
      case "last7Days":
        setValue(
          "dataDate",
          [
            dayjs(new Date()).startOf("day").subtract(7, "day"),
            dayjs(new Date()).startOf("day").subtract(1, "day"),
          ],
          {
            shouldValidate: true,
          },
        );
        break;
      case "last30Days":
        setValue(
          "dataDate",
          [
            dayjs(new Date()).startOf("day").subtract(30, "day"),
            dayjs(new Date()).startOf("day").subtract(1, "day"),
          ],
          {
            shouldValidate: true,
          },
        );
        break;
      case "last90Days":
        setValue(
          "dataDate",
          [
            dayjs(new Date()).startOf("day").subtract(90, "day"),
            dayjs(new Date()).startOf("day").subtract(1, "day"),
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

  const classFilter = () => {
    setValue("classFilter", getValues("classFilter"), {
      shouldValidate: true,
    });
    return null;
  };
  const [firstDatePicked, setFirstDatePicked] = useState(dayjs(null));
  const [secondDatePicked, setSecondDatePicked] = useState(dayjs(null));

  useEffect(() => {
    loader.start();

    fetchClassesExecute({ params: { sort: "name" } });
    setActionBar({
      ...actionBarDefault,
      title: {
        enabled: true,
        display: true,
        name: "Report - Classes",
      },
    });
  }, []);
  useEffect(() => {
    if (fetchReportsClassesData) {
      setList(fetchReportsClassesData);

      setActionBar(prev => {
        return {
          ...prev,
        };
      });
      loader.end();
    }
  }, [fetchReportsClassesData]);

  useEffect(() => {
    if (fetchClassesData && fetchClassesData.data) {
      setClassOptions(
        fetchClassesData.data.map(data => ({
          label: data.name,
          value: data.id,
        })),
      );
    }
  }, [fetchClassesData]);
  useEffect(() => {
    if (classOptions.length > 0) {
      fetchReportsClassesExecute({
        params: getFilterParam({ classId: classOptions[0].value }),
      });
      reset({
        classFilter: classOptions[0].value,
        dataFilter: "last30Days",
        dataDate: [
          dayjs(new Date()).startOf("day").subtract(30, "day"),
          dayjs(new Date()).startOf("day").subtract(1, "day"),
        ],
      });
    }
  }, [classOptions]);

  useEffect(() => {}, [fetchReportsClassesError]);
  useEffect(() => {}, [fetchClassesError]);

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Box sx={{ width: "180px" }}>
          <FormSelect
            name="classFilter"
            variant="outlined"
            control={control}
            label="Filter by"
            options={classOptions}
            customOnChange={() => {
              classFilter();
              onChange(getValues());
            }}
          />
        </Box>
      </Box>
      {list.data && list.summary && classOptions ? (
        <>
          <Box
            sx={{
              boxSizing: "border-box",
              padding: "24px 36px",
              background: "rgba(255, 255, 255,1)",
              borderRadius: "8px",
              paddingBottom: { xs: "24px", md: "24px" },
            }}
          >
            <Box
              sx={{
                display: { xs: "block", md: "flex" },
                justifyContent: "space-between",
              }}
            >
              <Tabs
                value={tabValue}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                TabIndicatorProps={{
                  style: { display: "none" },
                }}
                onChange={(event, newValue) => {
                  setTabValue(newValue);
                }}
                sx={{ minHeight: "36px", height: "36px" }}
              >
                <Tab
                  label="Day"
                  {...a11yProps(0)}
                  sx={{
                    minHeight: "36px",
                    height: "36px",
                    border: "1px solid rgba(63, 81, 181, 0.5)",
                    borderRadius: "100px 0px 0px 100px",
                    "&.Mui-selected": {
                      color: theme.palette.primary.main,
                      backgroundColor: theme.palette.primary.light,
                    },
                  }}
                />
                <Tab
                  label="Week"
                  {...a11yProps(1)}
                  sx={{
                    minHeight: "36px",
                    height: "36px",
                    border: "1px solid rgba(63, 81, 181, 0.5)",
                    borderLeft: "0px",
                    borderRight: "0px",
                    "&.Mui-selected": {
                      color: theme.palette.primary.main,
                      backgroundColor: theme.palette.primary.light,
                    },
                  }}
                />
                <Tab
                  label="Month"
                  {...a11yProps(2)}
                  sx={{
                    minHeight: "36px",
                    height: "36px",
                    border: "1px solid rgba(63, 81, 181, 0.5)",
                    borderRadius: "0px 100px 100px 0px",
                    "&.Mui-selected": {
                      color: theme.palette.primary.main,
                      backgroundColor: theme.palette.primary.light,
                    },
                  }}
                />
              </Tabs>

              <Box
                sx={{
                  display: "flex",
                  marginTop: { xs: "32px", md: "0px" },
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
                        classFilter();
                        onChange({
                          dataDate: [d1, d2],
                          classFilter: getValues("classFilter"),
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
            </Box>
            <TabPanel value={tabValue} index={tabValue}>
              {(() => {
                let key;

                switch (tabValue) {
                  case 0:
                    key = "day";
                    break;
                  case 1:
                    key = "week";
                    break;
                  case 2:
                    key = "month";
                    break;
                  default:
                }

                return (
                  <Box sx={{ marginTop: "16px" }}>
                    <ReactEChartsCore
                      echarts={echarts}
                      option={chart.setup(list.data, key)}
                      notMerge
                      lazyUpdate
                      theme="theme_name"
                      // onChartReady={this.onChartReadyCallback}
                      // onEvents={EventsDict}
                      // opts={}
                      style={{
                        height: isSmallScreen ? "280px" : "400px",
                        width: "100%",
                      }}
                    />
                  </Box>
                );
              })()}
            </TabPanel>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box
                sx={{
                  display: "flex",
                  // flexWrap: "wrap",
                  justifyContent: "space-between",
                  marginTop: "16px",
                  width: { xs: "100%", md: "50%" },
                }}
              >
                {renderFigures(
                  list.summary.averageAttendance,
                  "K",
                  list.summary.diffAverageAttendance,
                  "Average Attendance",
                  `vs Previous ${list.summary.dayCount} Day${
                    list.summary.dayCount > 1 ? "s" : ""
                  }`,
                  "flex",
                )}
                <Divider
                  orientation="vertical"
                  variant="middle"
                  flexItem
                  sx={{ display: { xs: "none", md: "block" } }}
                />

                {renderFigures(
                  list.summary.newStudentCount,
                  "K",
                  list.summary.diffNewStudentCount,
                  "New Student",
                  `vs Previous ${list.summary.dayCount} Day${
                    list.summary.dayCount > 1 ? "s" : ""
                  }`,
                  "flex",
                )}
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              boxSizing: "border-box",
              marginTop: "24px",
              padding: "24px 36px",
              background: "rgba(255, 255, 255,1)",
              borderRadius: "8px",
              paddingBottom: { xs: "24px", md: "24px" },
            }}
          >
            <ReactEChartsCore
              echarts={echarts}
              option={pieChart.setup(list.summary.ageDistribution)}
              notMerge
              lazyUpdate
              theme="theme_name"
              style={{
                height: isSmallScreen ? "280px" : "400px",
                width: "100%",
              }}
            />
          </Box>
        </>
      ) : null}
    </>
  );
};

export default ReportsClasses;
