import { Controller } from "react-hook-form";
import { FormControl } from "@mui/material/index";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import PropTypes from "prop-types";

dayjs.extend(utc);
const FormDateTimePicker = ({ name, control, label, disableTime }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        return (
          <FormControl fullWidth error={!!error}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                shouldDisableTime={disableTime}
                value={dayjs.utc(value)}
                label={label}
                onChange={onChange}
                slotProps={{
                  textField: { variant: "standard", fullWidth: true },
                }}
                format="DD MMM YYYY"
                sx={{ marginBottom: "24px" }}
                minutesStep={1}
              />
            </LocalizationProvider>
          </FormControl>
        );
      }}
    />
  );
};
FormDateTimePicker.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.shape().isRequired,
  label: PropTypes.string.isRequired,
  disableTime: PropTypes.bool.isRequired,
};

FormDateTimePicker.defaultProps = {};

export default FormDateTimePicker;
