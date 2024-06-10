import PropTypes from "prop-types";

import "./GoogleIcons.css";

const Register = props => {
  const { fontSize, color, currentpage } = props;
  return (
    <span
      className={
        currentpage === "true"
          ? "material-symbols-outlined material-symbols-fill"
          : "material-symbols-outlined"
      }
      style={{ fontSize, color }}
    >
      how_to_reg
    </span>
  );
};

Register.propTypes = {
  fontSize: PropTypes.string,
  color: PropTypes.string,
  currentpage: PropTypes.string,
};

Register.defaultProps = {
  fontSize: "24px",
  color: "inherit",
  currentpage: "false",
};

export default Register;
