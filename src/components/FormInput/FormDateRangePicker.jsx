import { useEffect, useRef, useState } from "react";
import { Controller } from "react-hook-form";
import { TextField } from "@mui/material";
import { DatePicker, PickersDay } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import PropTypes from "prop-types";

import ArrowDown from "../GoogleIcons/ArrowDown";

const getDatesArray = (startDayJs, endDayJs) => {
  const datesArray = [];
  let currentDate = endDayJs.isBefore(startDayJs)
    ? endDayJs.startOf("day")
    : startDayJs.startOf("day");
  dayjs.extend(isSameOrBefore);

  if (endDayJs.isBefore(startDayJs)) {
    while (currentDate.isSameOrBefore(startDayJs)) {
      datesArray.push(currentDate);
      currentDate = currentDate.add(1, "day");
    }
  } else {
    while (currentDate.isSameOrBefore(endDayJs)) {
      datesArray.push(currentDate);
      currentDate = currentDate.add(1, "day");
    }
  }

  return datesArray;
  // if (end === 0) {
  //   return [start];
  // }
  // return Array.from({ length: end - start + 1 }, (_, index) => start + index);
};

function isDateInArray(date, datesArray) {
  return datesArray.some(day => date.isSame(day));
}

const renderDayPicker = ({
  nativeProps,
  firstDatePicked,
  secondDatePicked,
  setSecondDatePicked,
  setSecondDatePickedDisplay,
  handleClose,
}) => {
  const { day, outsideCurrentMonth, today } = nativeProps;
  const testProps = { ...nativeProps };
  const dateRangeArray =
    firstDatePicked && secondDatePicked
      ? getDatesArray(firstDatePicked, secondDatePicked)
      : [];

  const isSelected =
    dateRangeArray.length > 0 ? isDateInArray(day, dateRangeArray) : false;

  let isStartDate;
  let isEndDate;
  if (firstDatePicked && secondDatePicked) {
    if (secondDatePicked.isBefore(firstDatePicked)) {
      isStartDate =
        day.$D === secondDatePicked.$D && day.$M === secondDatePicked.$M;
      isEndDate =
        day.$D === firstDatePicked.$D && day.$M === firstDatePicked.$M;
    } else {
      isStartDate =
        day.$D === firstDatePicked.$D && day.$M === firstDatePicked.$M;
      isEndDate =
        day.$D === secondDatePicked.$D && day.$M === secondDatePicked.$M;
    }
  }

  const renderBorderRadius = () => {
    if (firstDatePicked && secondDatePicked) {
      if (secondDatePicked.isSame(firstDatePicked)) {
        return "100%";
      }
    } else {
      if (isStartDate) {
        return "50% 0% 0% 50%";
      }
      if (isEndDate) {
        return "0% 50% 50% 0%";
      }
    }

    return "0%";
  };

  const renderBackgroundColor = () => {
    if (isStartDate || isEndDate) {
      return "#2A33FF";
    }
    return undefined;
  };

  const renderBackgroundColorV2 = () => {
    if (
      today &&
      day.$D === firstDatePicked.$D &&
      day.$M === firstDatePicked.$M
    ) {
      return "#2A33FF !important";
    }
    if (today && !isStartDate && !isEndDate) {
      return "transparent !important";
    }
    return "#2A33FF !important";
  };

  const renderColor = () => {
    if (
      today &&
      day.$D === firstDatePicked.$D &&
      day.$M === firstDatePicked.$M
    ) {
      return "white !important";
    }
    if (today && !isStartDate && !isEndDate) {
      return "black !important";
    }
    return "white !important";
  };

  if (today && !isStartDate && !isEndDate) {
    testProps.selected = false;
  }
  if (today && day.$D === firstDatePicked.$D && day.$M === firstDatePicked.$M) {
    testProps.selected = true;
  }

  return (
    <div
      style={{
        backgroundColor:
          isSelected && !outsideCurrentMonth ? "#B2C8FF" : undefined,
        borderRadius: renderBorderRadius(),
      }}
      key={day.toString()}
    >
      <PickersDay
        {...testProps}
        onDaySelect={dat => {
          testProps.onDaySelect(dat);
          if (dat.isSame(firstDatePicked)) {
            setSecondDatePicked(dat);
            setSecondDatePickedDisplay(dat);
            handleClose();
          }
        }}
        sx={{
          color: isStartDate || isEndDate ? "white" : "initial",
          backgroundColor: renderBackgroundColor(),
          ":hover": {
            backgroundColor: "#2A33FF !important",
            color: "white !important",
          },
          ":focus": {
            backgroundColor: renderBackgroundColorV2(),
            color: renderColor(),
          },
        }}
      />
    </div>
  );
};

const renderTextField = ({
  nativeProps,
  firstDatePickedDisplay,
  secondDatePickedDisplay,
  divRef,
  handleOpen,
  calendarDisabled,
}) => {
  return (
    <TextField
      {...nativeProps}
      disabled={calendarDisabled}
      value={`${firstDatePickedDisplay.format(
        "MMM D, YYYY",
      )} - ${secondDatePickedDisplay.format("MMM D, YYYY")}`}
      ref={divRef}
      onClick={handleOpen}
      fullWidth
      InputProps={{
        ...nativeProps.inputProps.ref,
        endAdornment: <ArrowDown sx={{ width: "12px", height: "12px" }} />,
      }}
    />
  );
};
const FormDateRangePicker = ({
  name,
  control,
  getValues,
  customOnChange,
  firstDatePicked,
  setFirstDatePicked,
  secondDatePicked,
  setSecondDatePicked,
  dateFilterOnChange,
}) => {
  const [firstDatePickedDisplay, setFirstDatePickedDisplay] = useState(
    dayjs(null),
  );
  const [secondDatePickedDisplay, setSecondDatePickedDisplay] = useState(
    dayjs(null),
  );

  const [datesPicked, setDatesPicked] = useState(1);
  const [calendarOpen, setCalenderOpen] = useState(false);
  const [position, setPosition] = useState({ top: "", left: "" });
  const [calendarDisabled, setCalendarDisabled] = useState(false);
  const [freshPicked, setFreshPicked] = useState(0);

  const divRef = useRef();

  const connections = {};
  const updatePopperLocations = targetDiv => {
    if (targetDiv) {
      const id = targetDiv.id.substr(targetDiv.id.indexOf("-") + 1);
      const pos = targetDiv.getBoundingClientRect();
      connections[id] = {
        ...connections[id],
        connectionPoint: [pos.left, pos.bottom],
      };
      setPosition({ top: pos.bottom, left: pos.left });
    }
  };
  const handleOpen = () => {
    if (calendarDisabled) {
      return;
    }
    updatePopperLocations(divRef.current);
    setCalenderOpen(true);
  };

  const handleClose = () => {
    setCalenderOpen(false);
    setFreshPicked(1);
  };
  useEffect(() => {
    setFirstDatePicked(getValues()[name][0]);
    setSecondDatePicked(getValues()[name][1]);

    setFirstDatePickedDisplay(getValues()[name][0]);
    setSecondDatePickedDisplay(getValues()[name][1]);
  }, [dateFilterOnChange]);
  useEffect(() => {
    setCalendarDisabled(getValues().dataFilter !== "custom");
  }, [getValues().dataFilter]);

  useEffect(() => {
    if (freshPicked !== 0 && secondDatePicked) {
      if (secondDatePicked.isBefore(firstDatePicked)) {
        customOnChange(secondDatePicked, firstDatePicked);
        setFirstDatePickedDisplay(secondDatePicked);
        setSecondDatePickedDisplay(firstDatePicked);
      } else {
        customOnChange(firstDatePicked, secondDatePicked);
      }
    }
  }, [secondDatePicked]);

  return (
    <Controller
      name={name}
      control={control}
      render={() => {
        return (
          <DatePicker
            value={null}
            disabled={calendarDisabled}
            disableHighlightToday
            disableFuture
            open={calendarOpen}
            onClose={handleClose}
            onChange={date => {
              if (freshPicked === 0 || freshPicked === 1) {
                setFirstDatePicked(date);
                setFirstDatePickedDisplay(date);

                setSecondDatePicked(null);
                setFreshPicked(-1);
              } else if (datesPicked === 1 && date) {
                setSecondDatePicked(date);
                setSecondDatePickedDisplay(date);

                handleClose();
              } else {
                setDatesPicked(datesPicked + 1);
                setFirstDatePicked(date);
                setFirstDatePickedDisplay(date);
              }
            }}
            closeOnSelect={false}
            slots={{
              day: day => {
                return (
                  day &&
                  renderDayPicker({
                    nativeProps: day,
                    firstDatePicked,
                    secondDatePicked,
                    setSecondDatePicked,
                    setSecondDatePickedDisplay,
                    handleClose,
                  })
                );
              },
              textField: textField => {
                return (
                  textField &&
                  renderTextField({
                    nativeProps: textField,
                    firstDatePickedDisplay,
                    secondDatePickedDisplay,
                    divRef,
                    handleOpen,
                    calendarDisabled,
                  })
                );
              },
            }}
            slotProps={{
              inputAdornment: {
                onClick: handleOpen,
              },
              popper: {
                sx: {
                  top: `${position.top}px !important`,
                  left: `${position.left}px !important`,
                },
              },
            }}
            sx={{
              ".MuiPickersPopper-root": {
                display: "none !important",
              },
            }}
          />
        );
      }}
    />
  );
};
FormDateRangePicker.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.shape().isRequired,
  getValues: PropTypes.func.isRequired,
  customOnChange: PropTypes.func.isRequired,
  firstDatePicked: PropTypes.shape(),
  secondDatePicked: PropTypes.shape(),
  setFirstDatePicked: PropTypes.func,
  setSecondDatePicked: PropTypes.func,
  dateFilterOnChange: PropTypes.bool.isRequired,
};

FormDateRangePicker.defaultProps = {
  firstDatePicked: {},
  secondDatePicked: {},
  setFirstDatePicked: () => {},
  setSecondDatePicked: () => {},
};

export default FormDateRangePicker;
