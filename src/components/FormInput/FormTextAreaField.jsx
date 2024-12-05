import { Controller } from "react-hook-form";
import { TextField } from "@mui/material";
import PropTypes from "prop-types";

const FormTextAreaField = ({
  name,
  control,
  label,
  required = false,
  sx = {},
  disabled = false,
  readOnly = false,
  rows = 0,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <TextField
          variant="standard"
          required={required || false}
          label={label}
          fullWidth
          multiline
          rows={rows}
          // minRows={3}
          // maxRows={10}
          placeholder={value || ""}
          aria-label={label}
          error={!!error}
          helperText={error?.message}
          onChange={onChange}
          onBlur={onBlur}
          value={value}
          disabled={disabled}
          sx={sx}
          InputProps={{
            readOnly,
          }}
        />
      )}
    />
  );
};

FormTextAreaField.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.shape().isRequired,
  label: PropTypes.string.isRequired,
  required: PropTypes.bool,
  sx: PropTypes.shape(),
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  rows: PropTypes.number,
};

export default FormTextAreaField;
