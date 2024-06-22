import { useEffect } from "react";
import {
  useNavigate,
  useOutletContext,
  useParams,
  useSearchParams,
} from "react-router-dom";

import ListClasses from "../features/classes/ListClasses";
import useClassesFeatures from "../features/classes/useClassesFeatures";

const Classes = () => {
  const [searchParams] = useSearchParams();

  const { id } = useParams();
  const contextProps = useOutletContext();
  const { loader, setActionBar, user, actionBarDefault } = contextProps;

  const { features, state } = useClassesFeatures({
    contextProps,
  });
  const navigate = useNavigate();
  const {
    fetchClasses,
    sortClasses,
    searchClasses,
    addClass,
    updateClass,
    deleteClass,
    newItemAnimate,
  } = features;
  const { newItemAnimation, className, nodeRefFunc } = newItemAnimate;

  // Page load
  useEffect(() => {
    if (id) {
      navigate(`/classes/${id}/evaluation`);
    }
    loader.start();

    if (searchParams.get("add") === "true") {
      addClass.onAdd();
    }
    setActionBar({
      ...actionBarDefault,
      title: {
        enabled: true,
        display: true,
        name: "Classes",
      },
      fab: {
        enabled: true,
        display: true,
        action: () => {
          addClass.onAdd();
        },
      },
      search: {
        enabled: true,
        display: true,
        isOpen: false,
        renderContent: searchClasses.searchBarContent,
        searchFunc: searchClasses.searchFunc,
        submitFunc: searchClasses.submitFunc,
        backFunc: searchClasses.backFunc,
      },
    });

    // Load list
    fetchClasses.onFetch({ params: { sort: "-updatedAt" } });

    return () => {};
  }, []);

  return (
    <ListClasses
      user={user}
      newItemAnimation={newItemAnimation}
      className={className}
      nodeRefFunc={nodeRefFunc}
      list={fetchClasses.list}
      paginationComponent={fetchClasses.paginationComponent}
      onSort={sortClasses.onSort}
      sort={sortClasses.sort}
      lastClicked={sortClasses.lastClicked}
      onUpdate={updateClass.onUpdate}
      onDelete={deleteClass.onDelete}
      searchStatus={state.searchStatus}
    />
  );
};

Classes.propTypes = {};

export default Classes;
