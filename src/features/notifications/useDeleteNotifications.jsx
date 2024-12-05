import { useEffect } from "react";

import useNotifications from "../../services/notifications";

const useDeleteNotifications = ({
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
  const { del: deleteNotifications } = useNotifications();
  const [
    { data: deleteNotificationsData, error: deleteNotificationsError },
    deleteNotificationsExecute,
  ] = deleteNotifications;

  const onDelete = ({ id, name }) => {
    if (user && user.role.indexOf("admin") >= 0) {
      sharedFunction.setAction("Delete");
      sharedFunction.setId(id);
      confirm.open(
        "Delete Notifications",
        `Are you sure you want delete "${name}?"`,
        {
          text: "Delete",
          onClick: async () => {
            confirm.close();
            loader.start();
            await deleteNotificationsExecute(id);
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
    if (deleteNotificationsData) {
      confirm.close();
      sharedFunction.setAction("deleteComplete");
      fetchList({
        params:
          Object.keys(sharedState.searchParams).length > 0
            ? sharedState.searchParams
            : { sort: "-updatedAt" },
        cb: () => {
          snackbar.open("Notification deleted successfully.", false);
          sharedFunction.setAction("View");
          sharedFunction.setId("");
        },
      });
      sidebar.close();
    }

    return () => {};
  }, [deleteNotificationsData]);

  // Side Effects
  useEffect(() => {
    if (deleteNotificationsError) {
      switch (deleteNotificationsError.response.data) {
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
  }, [deleteNotificationsError]);

  return {
    onDelete,
  };
};

useDeleteNotifications.propTypes = {};

export default useDeleteNotifications;
