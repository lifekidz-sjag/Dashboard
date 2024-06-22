import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";

import ListAdmins from "../features/admins/ListAdmins";
import useAdminsFeatures from "../features/admins/useAdminsFeatures";

const Admins = () => {
  const contextProps = useOutletContext();
  const { loader, setActionBar, user, actionBarDefault } = contextProps;

  const { features, state } = useAdminsFeatures({
    contextProps,
  });

  const {
    fetchAdmins,
    sortAdmins,
    searchAdmins,
    addAdmin,
    updateAdmin,
    deleteAdmin,
    newItemAnimate,
  } = features;
  const { newItemAnimation, className, nodeRefFunc } = newItemAnimate;

  // Page load
  useEffect(() => {
    loader.start();
    setActionBar({
      ...actionBarDefault,
      title: {
        enabled: true,
        display: true,
        name: "Admins",
      },
      fab: {
        enabled: true,
        display: true,
        action: () => {
          addAdmin.onAdd();
        },
      },
      search: {
        enabled: true,
        display: true,
        isOpen: false,
        renderContent: searchAdmins.searchBarContent,
        searchFunc: searchAdmins.searchFunc,
        submitFunc: searchAdmins.submitFunc,
        backFunc: searchAdmins.backFunc,
      },
    });

    // Load list
    fetchAdmins.onFetch({ params: { sort: "-updatedAt" } });

    return () => {};
  }, []);

  return (
    <ListAdmins
      user={user}
      newItemAnimation={newItemAnimation}
      className={className}
      nodeRefFunc={nodeRefFunc}
      list={fetchAdmins.list}
      paginationComponent={fetchAdmins.paginationComponent}
      onSort={sortAdmins.onSort}
      sort={sortAdmins.sort}
      lastClicked={sortAdmins.lastClicked}
      onUpdate={updateAdmin.onUpdate}
      onDelete={deleteAdmin.onDelete}
      searchStatus={state.searchStatus}
    />
  );
};

Admins.propTypes = {};

export default Admins;
