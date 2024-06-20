import { useEffect } from "react";

import useClassesEvaluaton from "../../services/classesEvaluation";

const useDeleteClassEvaluation = ({
  classId,
  loader,
  sidebar,
  snackbar,
  confirm,
  fetchList,
  sharedState,
  sharedFunction,
}) => {
  // API service
  const { del: deleteClassEvaluation } = useClassesEvaluaton(classId);
  const [
    { data: deleteClassEvaluationData, error: deleteClassEvaluationError },
    deleteClassEvaluationExecute,
  ] = deleteClassEvaluation;

  const onDelete = ({ id, name }) => {
    sharedFunction.setAction("Delete");
    sharedFunction.setId(id);
    confirm.open(
      "Delete Evaluation",
      `Are you sure you want delete "${name}?"`,
      {
        text: "Delete",
        onClick: async () => {
          confirm.close();
          loader.start();
          await deleteClassEvaluationExecute(id);
        },
      },
      {
        text: "Cancel",
      },
    );
  };

  // Side Effects
  useEffect(() => {
    if (deleteClassEvaluationData) {
      confirm.close();
      sharedFunction.setAction("deleteComplete");
      fetchList({
        params:
          Object.keys(sharedState.searchParams).length > 0
            ? sharedState.searchParams
            : { sort: "-status" },
        cb: () => {
          snackbar.open("Class Evaluation deleted successfully.", false);
          sharedFunction.setAction("View");
          sharedFunction.setId("");
        },
      });
      sidebar.close();
    }

    return () => {};
  }, [deleteClassEvaluationData]);

  // Side Effects
  useEffect(() => {
    if (deleteClassEvaluationError) {
      switch (deleteClassEvaluationError.response.data) {
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
  }, [deleteClassEvaluationError]);

  return {
    onDelete,
  };
};

useDeleteClassEvaluation.propTypes = {};

export default useDeleteClassEvaluation;
