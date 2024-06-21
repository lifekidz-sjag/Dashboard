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
import { FormTextField } from "../../components/FormInput";
import ArrowBack from "../../components/GoogleIcons/ArrowBack";
import useClasses from "../../services/classes";

const useUpdateClass = ({
  loader,
  sidebar,
  snackbar,
  noPermissionConfirm,
  user,
  fetchList,
  sharedState,
  sharedFunction,
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  // API service
  const { get: getClass, put: putClass } = useClasses();
  const [{ data: getClassData, error: getClassError }, getClassExecute] =
    getClass;

  const [{ data: putClassData, error: putClassError }, putClassExecute] =
    putClass;

  // React Hook Form Set Up
  const updateClassSchema = yup.object({
    name: yup.string().required("Please enter name of the class"),
    description: yup.string().required("Please enter description of the class"),
  });

  const {
    control: controlUpdate,
    handleSubmit: handleSubmitUpdate,
    reset: resetUpdate,
  } = useForm({
    defaultValues: {
      id: "",
      name: "",
      description: "",
    },
    resolver: yupResolver(updateClassSchema),
  });

  const handleUpdate = async data => {
    const modifiedData = data;
    delete modifiedData.id;

    loader.start();
    putClassExecute(sharedState.id, modifiedData);
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
            </Box>

            {/* Form Fields */}
            <Box sx={{ padding: "8px" }}>
              <Grid container alignItems="center">
                <Grid item xs={12} sx={{ marginTop: "30px" }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <FormTextField
                        required
                        name="name"
                        label="Name"
                        control={controlUpdate}
                        sx={{ marginBottom: "24px" }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormTextField
                        required
                        name="description"
                        label="Description"
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

    if (user && user.role.indexOf("admin") >= 0) {
      sharedFunction.setAction("Update");
      sharedFunction.setId(id);
      getClassExecute(id);
    } else {
      noPermissionConfirm.open();
      loader.end();
    }
  };

  // Side Effects
  useEffect(() => {
    if (getClassData) {
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
        name: getClassData.name,
        description: getClassData.description,
      });
      sidebar.open();
      loader.end();
    }
  }, [getClassData]);

  useEffect(() => {
    if (putClassData) {
      sidebar.close();
      sharedFunction.setAction("updateComplete");
      fetchList({
        params:
          Object.keys(sharedState.searchParams).length > 0
            ? sharedState.searchParams
            : { sort: "-updatedAt" },
        cb: () => {
          snackbar.open("Class updated successfully.", false);
          resetUpdate();
          sharedFunction.setAction("View");
          sharedFunction.setId("");
        },
      });
      sidebar.close();
    }

    return () => {};
  }, [putClassData]);

  // Side Effects
  useEffect(() => {
    if (getClassError) {
      loader.end();
      switch (getClassError.response.data) {
        case "INVALID_ID":
          snackbar.open("Something went wrong. Plaese try again later", true);
          break;

        default:
          break;
      }
    }
    loader.end();
    return () => {};
  }, [getClassError]);

  useEffect(() => {
    if (putClassError) {
      switch (putClassError.response.data) {
        case "ADMIN_ACTIONS_NOT_ALLOWED":
          snackbar.open("Something went wrong. Plaese try again later", true);
          break;
        case "EMPTY_REQUEST":
          snackbar.open("Something went wrong. Plaese try again later", true);
          break;
        case "DUPLICATED_CLASS":
          snackbar.open(
            "Unique class name is required. Please rephrase your class name",
            true,
          );
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
    }
    loader.end();
    return () => {};
  }, [putClassError]);

  return {
    onUpdate,
  };
};

useUpdateClass.propTypes = {};

export default useUpdateClass;
