import PropTypes from "prop-types";

import "./GoogleIcons.css";

const ValidateSuccess = props => {
  const { fontSize, color } = props;
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

ValidateSuccess.defaultProps = {
  fontSize: "20px",
  color: "white",
};

export default ValidateSuccess;
