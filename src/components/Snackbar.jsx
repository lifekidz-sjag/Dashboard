import { forwardRef } from "react";
import { Typography } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import MuiSnackbar from "@mui/material/Snackbar";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";

const CustomizedSnackbar = styled(props => <MuiSnackbar {...props} />)(
  props => ({
    "& .MuiPaper-root": {
      border: "none",
      borderRadius: "50px",
      color: props.type === "success" ? "#2C965D" : "#E24747",
      background: props.type === "success" ? "#CDF7E0" : "#FFD4D3",
    },
    "& .MuiAlert-icon": {
      color: props.type === "success" ? "#2C965D" : "#E24747",
    },
  }),
);

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Snackbar = ({ message, isOpen, type, onClose }) => {
  return (
    <CustomizedSnackbar
      open={isOpen}
      autoHideDuration={2500}
      transitionDuration={{ enter: 1000, exit: 500 }}
      onClose={onClose}
      sx={{ width: { md: "100%" }, zIndex: "1600" }}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      type={type}
    >
      <Alert severity={type} icon={false}>
        <Typography variant="body2">{message}</Typography>
      </Alert>
    </CustomizedSnackbar>
  );
};

Snackbar.propTypes = {
  message: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};

export default Snackbar;
