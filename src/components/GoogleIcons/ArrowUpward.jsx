import { Box } from "@mui/material";
import PropTypes from "prop-types";

import "./GoogleIcons.css";

const ArrowUpward = props => {
  const { fontSize = "24px", color = "white", className, sx = {} } = props;
  return (
    <Box
      component="span"
      className={`material-symbols-outlined ${className}`}
      sx={{ fontSize, color, ...sx }}
    >
      arrow_upward
    </Box>
  );
};

ArrowUpward.propTypes = {
  fontSize: PropTypes.string,
  color: PropTypes.string,
  className: PropTypes.string,
  sx: PropTypes.shape(),
};

export default ArrowUpward;
