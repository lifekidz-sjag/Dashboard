import { useState } from "react";
import { Controller } from "react-hook-form";
import { Box, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";

import ValidateError from "../GoogleIcons/ValidateError";
import ValidateSuccess from "../GoogleIcons/ValidateSuccess";

const FormTextField = ({
  key,
  name,
  control,
  label,
  type,
  required,
  sx,
  disabled,
  readOnly,
  customOnChange,
  customOnChangeParam,
  rule,
}) => {
  const theme = useTheme();
  // Alphabetic Characters: **Required** (at least one)
  // - Numeric Digits: **Required** (at least one)
  // - Special Characters: **Required** (at least one of $, @, !, %, *, #, ?, &)
  // - Minimum Length: **Defined by 'minLength' variable**

  // Password Validation Rules
  const [alphabeticError, setAlphabeticError] = useState(true);
  const [numericError, setNumericError] = useState(true);
  const [specialCharError, setSpecialCharError] = useState(true);
  const [minimumError, setMinimumError] = useState(true);

  const validatePassword = password => {
    // Alphabetic Characters: Required (at least one)
    const regexAlpha = /^(?=.*[A-Za-z])/;

    // Numeric Digits: Required (at least one)
    const regexDigits = /^(?=.*\d)/;

    // Special Characters: Required (at least one of $, @, !, %, *, #, ?, &)
    const regexSpecial = /^(?=.*[$@!%*#?&])/;

    // Minimum Length: Defined by 'minLength' variable
    const regexMinLength = new RegExp(`^.{${8},}$`);
    const isAlphaValid = regexAlpha.test(password);
    const isDigitsValid = regexDigits.test(password);
    const isSpecialValid = regexSpecial.test(password);
    const isLengthValid = regexMinLength.test(password);

    setAlphabeticError(!isAlphaValid);
    setNumericError(!isDigitsValid);
    setSpecialCharError(!isSpecialValid);
    setMinimumError(!isLengthValid);
  };

  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <TextField
            key={key}
            variant="standard"
            required={required || false}
            fullWidth
            label={label}
            error={!!error}
            helperText={error?.message}
            onChange={e => {
              onChange(e);
              if (rule === "password") {
                validatePassword(customOnChangeParam(name));
              }

              if (customOnChange) {
                customOnChange(e);
              }
            }}
            onBlur={onBlur}
            type={type}
            value={value}
            InputLabelProps={{ required: false }}
            sx={{
              ...sx,
              // "& .MuiInputLabel-root.Mui-disabled": {
              //   color: "rgba(43, 43, 43, 0.6)",
              // },
              // "& .MuiInput-input.Mui-disabled": {
              //   WebkitTextFillColor: "rgba(65, 66, 68, 1)",
              //   color: "rgba(65, 66, 68, 1)",
              // },
              // "& .MuiInputBase-root.Mui-disabled:before": {
              //   borderBottom: value ? "none" : "none",
              //   borderBottomStyle: value ? "none" : "none",
              // },
            }}
            disabled={disabled}
            InputProps={{
              readOnly,
            }}
          />
        )}
      />

      {rule === "password" && !disabled ? (
        <Box sx={{ marginTop: "16px" }}>
          <ListItem sx={{ padding: "0px" }}>
            <ListItemIcon sx={{ minWidth: "24px" }}>
              {alphabeticError ? (
                <ValidateError sx={{ width: "16px", height: "16px" }} />
              ) : (
                <ValidateSuccess sx={{ width: "16px", height: "16px" }} />
              )}
            </ListItemIcon>
            <ListItemText
              disableTypography
              sx={{
                color: alphabeticError
                  ? theme.palette.error.main
                  : theme.palette.success.main,
                fontSize: theme.typography.caption.fontSize,
                marginBottom: "0px",
              }}
            >
              At least one alphabetical character
            </ListItemText>
          </ListItem>
          <ListItem sx={{ padding: "0px" }}>
            <ListItemIcon sx={{ minWidth: "24px" }}>
              {numericError ? (
                <ValidateError sx={{ width: "16px", height: "16px" }} />
              ) : (
                <ValidateSuccess sx={{ width: "16px", height: "16px" }} />
              )}
            </ListItemIcon>
            <ListItemText
              disableTypography
              sx={{
                color: numericError
                  ? theme.palette.error.main
                  : theme.palette.success.main,
                fontSize: theme.typography.caption.fontSize,
                marginBottom: "0px",
              }}
            >
              At least one numeric character
            </ListItemText>
          </ListItem>
          <ListItem sx={{ padding: "0px" }}>
            <ListItemIcon sx={{ minWidth: "24px" }}>
              {specialCharError ? (
                <ValidateError sx={{ width: "16px", height: "16px" }} />
              ) : (
                <ValidateSuccess sx={{ width: "16px", height: "16px" }} />
              )}
            </ListItemIcon>
            <ListItemText
              disableTypography
              sx={{
                color: specialCharError
                  ? theme.palette.error.main
                  : theme.palette.success.main,
                fontSize: theme.typography.caption.fontSize,
                marginBottom: "0px",
              }}
            >
              At least one special character
            </ListItemText>
          </ListItem>
          <ListItem sx={{ padding: "0px" }}>
            <ListItemIcon sx={{ minWidth: "24px" }}>
              {minimumError ? (
                <ValidateError sx={{ width: "16px", height: "16px" }} />
              ) : (
                <ValidateSuccess sx={{ width: "16px", height: "16px" }} />
              )}
            </ListItemIcon>
            <ListItemText
              disableTypography
              sx={{
                color: minimumError
                  ? theme.palette.error.main
                  : theme.palette.success.main,
                fontSize: theme.typography.caption.fontSize,
                marginBottom: "0px",
              }}
            >
              At least 8 characters in total
            </ListItemText>
          </ListItem>
        </Box>
      ) : null}
    </>
  );
};
FormTextField.propTypes = {
  key: PropTypes.string,
  name: PropTypes.string.isRequired,
  control: PropTypes.shape().isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  required: PropTypes.bool,
  sx: PropTypes.shape(),
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  customOnChange: PropTypes.func,
  customOnChangeParam: PropTypes.func,
  rule: PropTypes.string,
};

FormTextField.defaultParameters = {
  type: null,
  sx: {},
  required: false,
  disabled: false,
  readOnly: false,
  customOnChangeParam: () => {},
  rule: "",
};

export default FormTextField;
