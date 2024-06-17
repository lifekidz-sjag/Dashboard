import PropTypes from "prop-types";

import "./GoogleIcons.css";

const Schedule = props => {
  const { fontSize = "24px", color = "inherit", currentpage = "false" } = props;
  return (
    <span
      className={
        currentpage === "true"
          ? "material-symbols-outlined material-symbols-fill"
          : "material-symbols-outlined"
      }
      style={{ fontSize, color }}
    >
      schedule
    </span>
  );
};

Schedule.propTypes = {
  fontSize: PropTypes.string,
  color: PropTypes.string,
  currentpage: PropTypes.string,
};

export default Schedule;
