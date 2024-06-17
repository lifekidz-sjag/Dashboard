import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";

import ListStudents from "../features/students/ListStudents";
import useStudentsFeatures from "../features/students/useStudentsFeatures";

const Students = () => {
  const contextProps = useOutletContext();
  const { loader, setActionBar, user } = contextProps;

  const { features, state } = useStudentsFeatures({
    contextProps,
  });

  const {
    fetchStudents,
    sortStudents,
    searchStudents,
    addStudent,
    updateStudent,
    deleteStudent,
    newItemAnimate,
  } = features;
  const { newItemAnimation, className, nodeRefFunc } = newItemAnimate;

  // Page load
  useEffect(() => {
    loader.start();
    setActionBar({
      title: {
        enabled: true,
        display: true,
        name: "Students",
      },
      fab: {
        enabled: true,
        display: true,
        action: () => {
          addStudent.onAdd();
        },
      },
      search: {
        enabled: true,
        display: true,
        isOpen: false,
        renderContent: searchStudents.searchBarContent,
        searchFunc: searchStudents.searchFunc,
        submitFunc: searchStudents.submitFunc,
        backFunc: searchStudents.backFunc,
      },
    });

    // Load list
    fetchStudents.onFetch({ params: { sort: "-updatedAt" } });

    return () => {};
  }, []);

  return (
    <ListStudents
      user={user}
      newItemAnimation={newItemAnimation}
      className={className}
      nodeRefFunc={nodeRefFunc}
      list={fetchStudents.list}
      classes={fetchStudents.classes}
      paginationComponent={fetchStudents.paginationComponent}
      onSort={sortStudents.onSort}
      sort={sortStudents.sort}
      lastClicked={sortStudents.lastClicked}
      onUpdate={updateStudent.onUpdate}
      onDelete={deleteStudent.onDelete}
      searchStatus={state.searchStatus}
    />
  );
};

Students.propTypes = {};

export default Students;
