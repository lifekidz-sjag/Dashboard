import { useState } from "react";

const useSortAdmins = ({ loader, fetchList }) => {
  // Native states
  const defaultSortState = {
    name: -1,
    updatedAt: -1,
  };
  const [sort, setSort] = useState(defaultSortState);

  const defaultLastClickedState = {
    name: false,
    updatedAt: false,
  };
  const [lastClicked, setLastClicked] = useState({
    name: false,
    updatedAt: true,
  });

  const onSort = param => {
    let newState;
    let newStatus;

    if (lastClicked[param]) {
      if (sort[param] === 1) {
        newState = -1;
        newStatus = `-${param}`;
      } else {
        newState = 1;
        newStatus = param;
      }
    } else {
      newState = sort[param];
      newStatus = newState === -1 ? `-${param}` : param;
    }

    setLastClicked(() => {
      return {
        ...defaultLastClickedState,
        [param]: true,
      };
    });
    setSort(() => {
      return {
        ...defaultSortState,
        [param]: newState,
      };
    });
    loader.start();

    fetchList({
      params: {
        sort: newStatus,
      },
    });
  };
  // Side Effects

  return {
    onSort,
    sort,
    lastClicked,
  };
};

useSortAdmins.propTypes = {};

export default useSortAdmins;
