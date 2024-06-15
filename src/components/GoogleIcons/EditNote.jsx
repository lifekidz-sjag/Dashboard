import PropTypes from "prop-types";

import "./GoogleIcons.css";

const EditNote = props => {
  const { fontSize = "24px", color = "rgba(19, 39, 46, 0.8)" } = props;
  return (
    <span
      className="material-symbols-outlined material-symbols-bold"
      style={{ fontSize, color }}
    >
      edit_note
    </span>
  );
};

EditNote.propTypes = {
  fontSize: PropTypes.string,
  color: PropTypes.string,
};

export default EditNote;
