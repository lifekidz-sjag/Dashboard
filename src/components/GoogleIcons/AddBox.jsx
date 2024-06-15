import PropTypes from "prop-types";

import "./GoogleIcons.css";

const AddBox = props => {
  const { fontSize = "24px", color = "white" } = props;
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

export default AddBox;
