import { Controller } from "react-hook-form";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import PropTypes from "prop-types";

const FormSelect = ({
  name,
  variant,
  control,
  label,
  options,
  disabled,
  customOnChange,
}) => {
  const generateOptions = () => {
    return (
      options &&
      options.map(option => (
        <MenuItem key={option.value} value={option.value}>
          {option.label || "\u00a0"}
        </MenuItem>
      ))
    );
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <FormControl variant={variant} fullWidth error={!!error}>
          <InputLabel>{label}</InputLabel>
          <Select
            labelId={name}
            value={value}
            label={label}
            onChange={data => {
              onChange(data);
              if (customOnChange) {
                customOnChange();
              }
            }}
            disabled={disabled}
            MenuProps={{
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "left",
              },
              transformOrigin: {
                vertical: "top",
                horizontal: "left",
              },
              PaperProps: { sx: { maxHeight: "30%" } },
            }}
          >
            {generateOptions()}
          </Select>
          {error && <FormHelperText>{error?.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );
};

FormSelect.propTypes = {
  name: PropTypes.string.isRequired,
  variant: PropTypes.string,
  control: PropTypes.shape().isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  ),
  disabled: PropTypes.bool,

  customOnChange: PropTypes.func,
};

FormSelect.defaultProps = {
  variant: "standard",
  disabled: false,
  options: [],
  customOnChange: () => {},
};
export default FormSelect;
