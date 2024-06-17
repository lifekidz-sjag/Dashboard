import { useEffect } from "react";

import useAdmins from "../../services/admins";

const useDeleteAdmin = ({
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
  const { del: deleteAdmin } = useAdmins();
  const [
    { data: deleteAdminData, error: deleteAdminError },
    deleteAdminExecute,
  ] = deleteAdmin;

  const onDelete = ({ id, name }) => {
    if (user && user.role.indexOf("superadmin") >= 0) {
      sharedFunction.setAction("Delete");
      sharedFunction.setId(id);
      confirm.open(
        "Delete Admin",
        `Are you sure you want delete "${name}?"`,
        {
          text: "Delete",
          onClick: async () => {
            confirm.close();
            loader.start();
            await deleteAdminExecute(id);
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
    if (deleteAdminData) {
      confirm.close();
      sharedFunction.setAction("deleteComplete");
      fetchList({
        params:
          Object.keys(sharedState.searchParams).length > 0
            ? sharedState.searchParams
            : { sort: "-updatedAt" },
        cb: () => {
          snackbar.open("Admin deleted successfully.", false);
          sharedFunction.setAction("View");
          sharedFunction.setId("");
        },
      });
      sidebar.close();
    }

    return () => {};
  }, [deleteAdminData]);

  // Side Effects
  useEffect(() => {
    if (deleteAdminError) {
      loader.end();
      switch (deleteAdminError.response.data) {
        case "INVALID_ID":
          snackbar.open("Something went wrong. Plaese try again later", true);
          break;

        default:
          break;
      }
    }
    loader.end();
    return () => {};
  }, [deleteAdminError]);

  useEffect(() => {
    if (deleteAdminError) {
      switch (deleteAdminError.response.data) {
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
  }, [deleteAdminError]);

  return {
    onDelete,
  };
};

useDeleteAdmin.propTypes = {};

export default useDeleteAdmin;
