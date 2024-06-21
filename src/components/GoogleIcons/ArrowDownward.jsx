import { Box } from "@mui/material";
import PropTypes from "prop-types";

import "./GoogleIcons.css";

const ArrowDownward = props => {
  const { fontSize = "24px", color = "white", className, sx = {} } = props;
  return (
    <Box
      component="span"
      className={`material-symbols-outlined ${className}`}
      sx={{ fontSize, color, ...sx }}
    >
      arrow_downward
    </Box>
  );
};

ArrowDownward.propTypes = {
  fontSize: PropTypes.string,
  color: PropTypes.string,
  className: PropTypes.string,
  sx: PropTypes.shape(),
};

export default ArrowDownward;
