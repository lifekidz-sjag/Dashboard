import PropTypes from "prop-types";

import "./GoogleIcons.css";

const Search = props => {
  const { fontSize = "24px", color = "white" } = props;
  return (
    <span className="material-symbols-outlined" style={{ fontSize, color }}>
      search
    </span>
  );
};

Search.propTypes = {
  fontSize: PropTypes.string,
  color: PropTypes.string,
};

export default Search;
