import { useEffect } from "react";
import { useOutletContext, useParams } from "react-router-dom";

import NoPermission from "../components/NoPermission";
import ListClassesEvaluation from "../features/classesEvaluation/ListClassesEvaluation";
import useClassesEvaluationFeatures from "../features/classesEvaluation/useClassesEvaluationFeature";

const ClassEvaluation = () => {
  const { id } = useParams();
  const contextProps = useOutletContext();
  const { loader, setActionBar, user, actionBarDefault } = contextProps;

  const { features, state } = useClassesEvaluationFeatures({
    classId: id,
    contextProps,
  });

  const {
    fetchClassesEvaluation,
    searchClassesEvaluation,
    addClassEvaluation,
    updateClassEvaluation,
    deleteClassEvaluation,
    newItemAnimate,
  } = features;
  const { newItemAnimation, className, nodeRefFunc } = newItemAnimate;

  // Page load
  useEffect(() => {
    if (user && user.role.indexOf("admin") < 0) {
      setActionBar({
        ...actionBarDefault,
        title: {
          enabled: true,
          display: true,
          name: "Evaluations",
        },
      });
    } else {
      loader.start();
      setActionBar({
        ...actionBarDefault,
        title: {
          enabled: true,
          display: true,
          name: `${state.className} -  Evaluations`,
        },
        fab: {
          enabled: true,
          display: true,
          action: () => {
            addClassEvaluation.onAdd();
          },
        },
        search: {
          enabled: true,
          display: true,
          isOpen: false,
          renderContent: searchClassesEvaluation.searchBarContent,
          searchFunc: searchClassesEvaluation.searchFunc,
          submitFunc: searchClassesEvaluation.submitFunc,
          backFunc: searchClassesEvaluation.backFunc,
        },
      });

      // Load list
      fetchClassesEvaluation.onFetch({ params: { sort: "status" } });
    }

    return () => {};
  }, [state.className]);

  return user && user.role.indexOf("admin") >= 0 ? (
    <ListClassesEvaluation
      user={user}
      newItemAnimation={newItemAnimation}
      className={className}
      nodeRefFunc={nodeRefFunc}
      list={fetchClassesEvaluation.list}
      paginationComponent={fetchClassesEvaluation.paginationComponent}
      onUpdate={updateClassEvaluation.onUpdate}
      onDelete={deleteClassEvaluation.onDelete}
    />
  ) : (
    <NoPermission />
  );
};

ClassEvaluation.propTypes = {};

export default ClassEvaluation;
