import { useEffect } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";

import ListTeachers from "../features/teachers/ListTeachers";
import useTeachersFeatures from "../features/teachers/useTeachersFeatures";

const Teachers = () => {
  const [searchParams] = useSearchParams();

  const contextProps = useOutletContext();
  const { loader, setActionBar, user, actionBarDefault } = contextProps;

  const { features, state } = useTeachersFeatures({
    contextProps,
  });

  const {
    fetchTeachers,
    sortTeachers,
    searchTeachers,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    newItemAnimate,
  } = features;
  const { newItemAnimation, className, nodeRefFunc } = newItemAnimate;

  // Page load
  useEffect(() => {
    loader.start();

    if (searchParams.get("add") === "true") {
      addTeacher.onAdd();
    }
    setActionBar({
      ...actionBarDefault,
      title: {
        enabled: true,
        display: true,
        name: "Teachers",
      },
      fab: {
        enabled: true,
        display: true,
        action: () => {
          addTeacher.onAdd();
        },
      },
      search: {
        enabled: true,
        display: true,
        isOpen: false,
        renderContent: searchTeachers.searchBarContent,
        searchFunc: searchTeachers.searchFunc,
        submitFunc: searchTeachers.submitFunc,
        backFunc: searchTeachers.backFunc,
      },
    });

    // Load list
    fetchTeachers.onFetch({ params: { sort: "-updatedAt" } });

    return () => {};
  }, []);

  return (
    <ListTeachers
      user={user}
      newItemAnimation={newItemAnimation}
      className={className}
      nodeRefFunc={nodeRefFunc}
      list={fetchTeachers.list}
      classes={fetchTeachers.classes}
      paginationComponent={fetchTeachers.paginationComponent}
      onSort={sortTeachers.onSort}
      sort={sortTeachers.sort}
      lastClicked={sortTeachers.lastClicked}
      onUpdate={updateTeacher.onUpdate}
      onDelete={deleteTeacher.onDelete}
      searchStatus={state.searchStatus}
    />
  );
};

Teachers.propTypes = {};

export default Teachers;
