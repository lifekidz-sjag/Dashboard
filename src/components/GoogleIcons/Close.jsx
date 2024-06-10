import PropTypes from "prop-types";

import "./GoogleIcons.css";

const Close = props => {
  const { fontSize, color } = props;
  return (
    <span className="material-symbols-outlined" style={{ fontSize, color }}>
      close
    </span>
  );
};

Close.propTypes = {
  fontSize: PropTypes.string,
  color: PropTypes.string,
};

Close.defaultProps = {
  fontSize: "20px",
  color: "white",
};

export default Close;
