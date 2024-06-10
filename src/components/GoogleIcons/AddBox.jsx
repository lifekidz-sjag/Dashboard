import PropTypes from "prop-types";

import "./GoogleIcons.css";

const AddBox = props => {
  const { fontSize, color } = props;
  return (
    <span className="material-symbols-outlined" style={{ fontSize, color }}>
      add_box
    </span>
  );
};

AddBox.propTypes = {
  fontSize: PropTypes.string,
  color: PropTypes.string,
};

AddBox.defaultProps = {
  fontSize: "20px",
  color: "white",
};

export default AddBox;
