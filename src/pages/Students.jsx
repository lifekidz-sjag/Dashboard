import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";

import Popup from "../components/Popup";
import ListStudents from "../features/students/ListStudents";
import useStudentsFeatures from "../features/students/useStudentsFeatures";
import usePopup from "../hooks/usePopup";

const Students = () => {
  const contextProps = useOutletContext();
  const popupClockIn = usePopup();
  const popupClockOut = usePopup();

  const { loader, setActionBar, user } = contextProps;

  const { features, state } = useStudentsFeatures({
    contextProps,
    popupClockIn,
    popupClockOut,
  });

  const {
    fetchStudents,
    sortStudents,
    searchStudents,
    addStudent,
    updateStudent,
    deleteStudent,
    newItemAnimate,
    clockInStudent,
    clockOutStudent,
    qrCodeStudent,
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
      fabClock: {
        enabled: true,
        display: true,
        actionClockIn: () => {
          clockInStudent.onScan();
        },
        actionClockOut: () => {
          clockOutStudent.onScan();
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
    <>
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
        onView={qrCodeStudent.onView}
      />
      <Popup {...popupClockIn}>{popupClockIn.popupContent}</Popup>
      <Popup {...popupClockOut}>{popupClockOut.popupContent}</Popup>
    </>
  );
};

Students.propTypes = {};

export default Students;
