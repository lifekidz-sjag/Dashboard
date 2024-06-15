import { Controller } from "react-hook-form";
import { FormControlLabel, Switch } from "@mui/material";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";

const IOSSwitch = styled(props => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: "40px",
  height: "24px",
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    transform: "translate(3px, 1px)",
    "&.Mui-checked": {
      transform: "translate(18px, 1px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#C3FFD1",
        opacity: 1,
        border: 0,
      },
      "& > .MuiSwitch-thumb": {
        backgroundColor: `${theme.palette.success.main} !important`,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 16,
    height: 16,
    backgroundColor: "grey",
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));
const FormSwitch = ({ name, control, label, disabled = false }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => {
        return (
          <FormControlLabel
            control={
              <IOSSwitch
                checked={value}
                onChange={e => onChange(e.target.checked)}
                name={name}
                disabled={disabled}
              />
            }
            label={label}
            sx={{
              margin: "0px",
              width: "40px",
              ".MuiFormControlLabel-label": { marginLeft: "8px" },
            }}
          />
        );
      }}
    />
  );
};
FormSwitch.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.shape().isRequired,
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};

export default FormSwitch;
