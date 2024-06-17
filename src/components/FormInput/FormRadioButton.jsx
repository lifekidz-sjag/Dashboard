import { Controller } from "react-hook-form";
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import PropTypes from "prop-types";

const FormRadioButton = ({ name, control, label, list, display }) => {
  const generateOptions = () => {
    return list.map(l => (
      <FormControlLabel
        key={l.id}
        value={l.value}
        control={<Radio />}
        label={l.label}
      />
    ));
  };
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <FormControl variant="standard" fullWidth error={!!error}>
          <FormLabel>{label}</FormLabel>
          <RadioGroup row={display === "row"} value={value} onChange={onChange}>
            {generateOptions()}
          </RadioGroup>
          {error && <FormHelperText>{error?.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );
};

FormRadioButton.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.shape().isRequired,
  label: PropTypes.string.isRequired,
  list: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
    }),
  ).isRequired,
  display: PropTypes.string.isRequired,
};

export default FormRadioButton;
