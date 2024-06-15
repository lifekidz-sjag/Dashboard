import PropTypes from "prop-types";

import "./GoogleIcons.css";

const ValidateSuccess = props => {
  const { fontSize = "24px", color = "white" } = props;
  return (
    <span className="material-symbols-outlined" style={{ fontSize, color }}>
      check_circle
    </span>
  );
};

ValidateSuccess.propTypes = {
  fontSize: PropTypes.string,
  color: PropTypes.string,
};

export default ValidateSuccess;
