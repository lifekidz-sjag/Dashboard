import { useEffect } from "react";

import useClasses from "../../services/classes";

const useDeleteClass = ({
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
  const { del: deleteClass } = useClasses();
  const [
    { data: deleteClassData, error: deleteClassError },
    deleteClassExecute,
  ] = deleteClass;

  const onDelete = ({ id, name }) => {
    if (user && user.role === "superadmin") {
      sharedFunction.setAction("Delete");
      sharedFunction.setId(id);
      confirm.open(
        "Delete Class",
        `Are you sure you want delete "${name}?"`,
        {
          text: "Delete",
          onClick: async () => {
            confirm.close();
            loader.start();
            await deleteClassExecute(id);
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
    if (deleteClassData) {
      confirm.close();
      sharedFunction.setAction("deleteComplete");
      fetchList({
        params:
          Object.keys(sharedState.searchParams).length > 0
            ? sharedState.searchParams
            : { sort: "-updatedAt" },
        cb: () => {
          snackbar.open("Class deleted successfully.", false);
          sharedFunction.setAction("View");
          sharedFunction.setId("");
        },
      });
      sidebar.close();
    }

    return () => {};
  }, [deleteClassData]);

  // Side Effects
  useEffect(() => {
    if (deleteClassError) {
      loader.end();
      switch (deleteClassError.response.data) {
        case "INVALID_ID":
          snackbar.open("Something went wrong. Plaese try again later", true);
          break;

        default:
          break;
      }
    }
    loader.end();
    return () => {};
  }, [deleteClassError]);

  useEffect(() => {
    if (deleteClassError) {
      switch (deleteClassError.response.data) {
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
  }, [deleteClassError]);

  return {
    onDelete,
  };
};

useDeleteClass.propTypes = {};

export default useDeleteClass;
