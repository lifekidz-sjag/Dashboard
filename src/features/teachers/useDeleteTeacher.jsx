import { useEffect } from "react";

import useTeachers from "../../services/teachers";

const useDeleteTeacher = ({
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
  const { del: deleteTeacher } = useTeachers();
  const [
    { data: deleteTeacherData, error: deleteTeacherError },
    deleteTeacherExecute,
  ] = deleteTeacher;

  const onDelete = ({ id, name }) => {
    if (user && user.role.indexOf("admin") >= 0) {
      sharedFunction.setAction("Delete");
      sharedFunction.setId(id);
      confirm.open(
        "Delete Teacher",
        `Are you sure you want to delete "${name}?"`,
        {
          text: "Delete",
          onClick: async () => {
            confirm.close();
            loader.start();
            await deleteTeacherExecute(id);
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
    if (deleteTeacherData) {
      confirm.close();
      sharedFunction.setAction("deleteComplete");
      fetchList({
        params:
          Object.keys(sharedState.searchParams).length > 0
            ? sharedState.searchParams
            : { sort: "-updatedAt" },
        cb: () => {
          snackbar.open("Teacher deleted successfully.", false);
          sharedFunction.setAction("View");
          sharedFunction.setId("");
        },
      });
      sidebar.close();
    }

    return () => {};
  }, [deleteTeacherData]);

  // Side Effects
  useEffect(() => {
    if (deleteTeacherError) {
      loader.end();
      switch (deleteTeacherError.response.data) {
        case "INVALID_ID":
          snackbar.open("Something went wrong. Plaese try again later", true);
          break;

        default:
          break;
      }
    }
    loader.end();
    return () => {};
  }, [deleteTeacherError]);

  useEffect(() => {
    if (deleteTeacherError) {
      switch (deleteTeacherError.response.data) {
        case "ADMIN_ACTIONS_NOT_ALLOWED":
          snackbar.open("Something went wrong. Plaese try again later", true);
          break;
        case "INVALID_ID":
          snackbar.open("Something went wrong. Plaese try again later", true);
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
  }, [deleteTeacherError]);

  return {
    onDelete,
  };
};

useDeleteTeacher.propTypes = {};

export default useDeleteTeacher;
