import PropTypes from "prop-types";

import "./GoogleIcons.css";

const Close = props => {
  const { fontSize = "24px", color = "white" } = props;
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

export default Close;
