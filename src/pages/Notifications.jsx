import { useEffect } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";

import ListNotifications from "../features/notifications/ListNotifications";
import useNotificationsFeatures from "../features/notifications/useNotificationsFeatures";

const Notifications = () => {
  const [searchParams] = useSearchParams();

  const contextProps = useOutletContext();
  const { loader, setActionBar, user, actionBarDefault } = contextProps;

  const { features, state } = useNotificationsFeatures({
    contextProps,
  });
  const {
    fetchNotifications,
    sortNotifications,
    searchNotifications,
    addNotification,
    updateNotification,
    deleteNotification,
    newItemAnimate,
  } = features;
  const { newItemAnimation, className, nodeRefFunc } = newItemAnimate;

  // Page load
  useEffect(() => {
    loader.start();
    if (searchParams.get("add") === "true") {
      addNotification.onAdd();
    }
    setActionBar({
      ...actionBarDefault,
      title: {
        enabled: true,
        display: true,
        name: "Announcements",
      },
      fab: {
        enabled: true,
        display: true,
        action: () => {
          addNotification.onAdd();
        },
      },
      search: {
        enabled: true,
        display: true,
        isOpen: false,
        renderContent: searchNotifications.searchBarContent,
        searchFunc: searchNotifications.searchFunc,
        submitFunc: searchNotifications.submitFunc,
        backFunc: searchNotifications.backFunc,
      },
    });

    // Load list
    fetchNotifications.onFetch({ params: { sort: "-updatedAt" } });

    return () => {};
  }, []);

  return (
    <ListNotifications
      user={user}
      newItemAnimation={newItemAnimation}
      className={className}
      nodeRefFunc={nodeRefFunc}
      list={fetchNotifications.list}
      paginationComponent={fetchNotifications.paginationComponent}
      onSort={sortNotifications.onSort}
      sort={sortNotifications.sort}
      lastClicked={sortNotifications.lastClicked}
      onUpdate={updateNotification.onUpdate}
      onDelete={deleteNotification.onDelete}
      searchStatus={state.searchStatus}
    />
  );
};

Notifications.propTypes = {};

export default Notifications;
