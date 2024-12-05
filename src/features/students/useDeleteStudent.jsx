import { useEffect } from "react";

import useStudents from "../../services/students";

const useDeleteStudent = ({
  loader,
  sidebar,
  snackbar,
  confirm,
  noPermissionConfirm,
  user,
  fetchList,
  sharedState,
  sharedFunction,
}) => {
  // API service
  const { del: deleteStudent } = useStudents();
  const [
    { data: deleteStudentData, error: deleteStudentError },
    deleteStudentExecute,
  ] = deleteStudent;

  const onDelete = ({ id, name }) => {
    if (user && user.role.indexOf("admin") >= 0) {
      sharedFunction.setAction("Delete");
      sharedFunction.setId(id);
      confirm.open(
        "Delete Student",
        `Are you sure you want to delete "${name}?"`,
        {
          text: "Delete",
          onClick: async () => {
            confirm.close();
            loader.start();
            await deleteStudentExecute(id);
          },
        },
        {
          text: "Cancel",
        },
      );
    } else {
      noPermissionConfirm.open();
      loader.end();
    }
  };

  // Side Effects
  useEffect(() => {
    if (deleteStudentData) {
      confirm.close();
      sharedFunction.setAction("deleteComplete");
      fetchList({
        params:
          Object.keys(sharedState.searchParams).length > 0
            ? sharedState.searchParams
            : { sort: "-updatedAt" },
        cb: () => {
          snackbar.open("Student deleted successfully.", false);
          sharedFunction.setAction("View");
          sharedFunction.setId("");
        },
      });
      sidebar.close();
    }

    return () => {};
  }, [deleteStudentData]);

  // Side Effects
  useEffect(() => {
    if (deleteStudentError) {
      loader.end();
      switch (deleteStudentError.response.data) {
        case "INVALID_ID":
          snackbar.open("Something went wrong. Please try again later", true);
          break;

        default:
          break;
      }
    }
    loader.end();
    return () => {};
  }, [deleteStudentError]);

  useEffect(() => {
    if (deleteStudentError) {
      switch (deleteStudentError.response.data) {
        case "ADMIN_ACTIONS_NOT_ALLOWED":
          snackbar.open("Something went wrong. Please try again later", true);
          break;
        case "INVALID_ID":
          snackbar.open("Something went wrong. Please try again later", true);
          break;
        case "UNAUTHORIZED_ACTION":
          snackbar.open("Please login again to proceed", true);
          break;
        default:
          break;
      }
      loader.end();
    }
    return () => {};
  }, [deleteStudentError]);

  return {
    onDelete,
  };
};

useDeleteStudent.propTypes = {};

export default useDeleteStudent;
