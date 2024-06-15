import PropTypes from "prop-types";

import "./GoogleIcons.css";

const Download = props => {
  const { fontSize = "24px", color = "white" } = props;
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

export default Download;
