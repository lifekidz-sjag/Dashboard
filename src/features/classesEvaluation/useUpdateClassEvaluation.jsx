import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import * as yup from "yup";

import formBg from "../../assets/form-bg.png";
import { FormSwitch, FormTextField } from "../../components/FormInput";
import ArrowBack from "../../components/GoogleIcons/ArrowBack";
import useClassesEvaluaton from "../../services/classesEvaluation";

const useUpdateClassEvaluation = ({
  classId,
  loader,
  sidebar,
  snackbar,
  fetchList,
  sharedState,
  sharedFunction,
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  // API service
  const { get: getClassEvaluation, put: putClassEvaluation } =
    useClassesEvaluaton(classId);
  const [
    { data: getClassEvaluationData, error: getClassEvaluationError },
    getClassEvaluationExecute,
  ] = getClassEvaluation;

  const [
    { data: putClassEvaluationData, error: putClassEvaluationError },
    putClassEvaluationExecute,
  ] = putClassEvaluation;

  // React Hook Form Set Up
  const updateClassSchema = yup.object({
    criteriaName: yup.string().required("Please enter name of the criteria"),
    criteriaDescription: yup
      .string()
      .required("Please enter description of the criteria"),
    status: yup.boolean().required("Please select one"),
  });

  const {
    control: controlUpdate,
    handleSubmit: handleSubmitUpdate,
    reset: resetUpdate,
  } = useForm({
    defaultValues: {
      id: "",
      criteriaName: "",
      criteriaDescription: "",
      status: true,
    },
    resolver: yupResolver(updateClassSchema),
  });

  const handleUpdate = async data => {
    const modifiedData = data;
    modifiedData.status =
      modifiedData.status.toString() === "false" ? "inactive" : "active";
    delete modifiedData.id;

    loader.start();
    putClassEvaluationExecute(sharedState.id, modifiedData);
  };

  const sideUpdate = () => {
    return (
      <Box
        role="presentation"
        style={{
          backgroundColor: "white",
        }}
      >
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmitUpdate(data => {
            handleUpdate(data);
          })}
        >
          <Box
            sx={{
              flex: "1 1 auto",
              minHeight: "100%",
              padding: "24px",
            }}
          >
            {/* Top Bar */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "24px",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box>
                  <IconButton onClick={sidebar.close}>
                    <ArrowBack color="inherit" />
                  </IconButton>
                </Box>
                <Box sx={{ marginLeft: "8px" }}>
                  <Typography variant="subtitle1">Update Class</Typography>
                </Box>
              </Box>
              <Box>
                <FormSwitch name="status" control={controlUpdate} />
              </Box>
            </Box>

            {/* Form Fields */}
            <Box sx={{ padding: "8px" }}>
              <Grid container alignItems="center">
                <Grid item xs={12} sx={{ marginTop: "30px" }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <FormTextField
                        required
                        name="criteriaName"
                        label="Name of Evaluation"
                        control={controlUpdate}
                        sx={{ marginBottom: "24px" }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormTextField
                        required
                        name="criteriaDescription"
                        label="Description of Evaluation"
                        control={controlUpdate}
                        sx={{ marginBottom: "24px" }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Box>

          <Box
            sx={{
              position: "absolute",
              width: "100%",
              bottom: { xs: "75px", md: "0px" },
              right: "0px",
              background: "white",
              zIndex: 1,
              borderTop: "1px solid rgba(0,0,0,0.1)",
            }}
          >
            {!isSmallScreen && (
              <Box component="img" src={formBg} sx={{ width: "100%" }} />
            )}

            <Box
              sx={{
                padding: "16px 24px 24px 24px",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Stack spacing={5} direction="row">
                <Button
                  className="XyanButton"
                  variant="text"
                  size="large"
                  style={{
                    borderRadius: "100px",
                  }}
                  onClick={sidebar.close}
                >
                  Cancel
                </Button>
                <Button
                  className="XyanButton"
                  variant="contained"
                  size="large"
                  type="submit"
                  style={{
                    borderRadius: "100px",
                  }}
                >
                  Update
                </Button>
              </Stack>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  };

  const onUpdate = id => {
    loader.start();

    sharedFunction.setAction("Update");
    sharedFunction.setId(id);
    getClassEvaluationExecute(id);
  };

  // Side Effects
  useEffect(() => {
    if (getClassEvaluationData) {
      // open form
      sidebar.setSidebar(prevState => {
        return {
          ...prevState,
          dependencies: {
            ...prevState.dependencies,
          },
          sidebar: sideUpdate,
        };
      });
      resetUpdate({
        criteriaName: getClassEvaluationData.criteriaName,
        criteriaDescription: getClassEvaluationData.criteriaDescription,
        status: getClassEvaluationData.status === "active",
      });
      sidebar.open();
      loader.end();
    }
  }, [getClassEvaluationData]);

  useEffect(() => {
    if (putClassEvaluationData) {
      sidebar.close();
      sharedFunction.setAction("updateComplete");
      fetchList({
        params:
          Object.keys(sharedState.searchParams).length > 0
            ? sharedState.searchParams
            : { sort: "status" },
        cb: () => {
          snackbar.open("Class Evaluation updated successfully.", false);
          resetUpdate();
          sharedFunction.setAction("View");
          sharedFunction.setId("");
        },
      });
      sidebar.close();
    }

    return () => {};
  }, [putClassEvaluationData]);

  // Side Effects
  useEffect(() => {
    if (getClassEvaluationError) {
      loader.end();
      switch (getClassEvaluationError.response.data) {
        case "INVALID_ID":
          snackbar.open("Something went wrong. Please try again later", true);
          break;
        default:
          break;
      }
    }
    loader.end();
    return () => {};
  }, [getClassEvaluationError]);

  useEffect(() => {
    if (putClassEvaluationError) {
      switch (putClassEvaluationError.response.data) {
        case "EMPTY_REQUEST":
          snackbar.open("Something went wrong. Please try again later", true);
          break;
        case "INVALID_ID":
          snackbar.open("Something went wrong. Please try again later", true);
          break;
        case "EXCEED_MAXIMUM_EVALUATION":
          snackbar.open(
            "Only a total of 3 active evaluation is allowed for each class",
            true,
          );
          break;
        case "DUPLICATED_CLASS_EVALUATION":
          snackbar.open(
            "Unique class evaluation is required. Please rephrase your topic",
            true,
          );
          break;
        case "UNAUTHORIZED_ACTION":
          snackbar.open("Please login again to proceed", true);
          break;
        default:
          break;
      }
    }
    loader.end();
    return () => {};
  }, [putClassEvaluationError]);

  return {
    onUpdate,
  };
};

useUpdateClassEvaluation.propTypes = {};

export default useUpdateClassEvaluation;
