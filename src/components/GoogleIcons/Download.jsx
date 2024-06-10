import PropTypes from "prop-types";

import "./GoogleIcons.css";

const Download = props => {
  const { fontSize, color } = props;
  return (
    <span className="material-symbols-outlined" style={{ fontSize, color }}>
      download
    </span>
  );
};

Download.propTypes = {
  fontSize: PropTypes.string,
  color: PropTypes.string,
};

Download.defaultProps = {
  fontSize: "20px",
  color: "white",
};

export default Download;
