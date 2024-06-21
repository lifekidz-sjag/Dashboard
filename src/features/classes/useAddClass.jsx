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

const useAddClass = ({
  loader,
  sidebar,
  snackbar,
  noPermissionConfirm,
  user,
  setNewItemAnimation,
  fetchList,
  sharedFunction,
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  // API service
  const { post: postClass } = useClasses();
  const [{ data: postClassData, error: postClassError }, postClassExecute] =
    postClass;

  // React Hook Form Set Up

  const createClassSchema = yup.object({
    name: yup.string().required("Please enter name of the class"),
    description: yup.string().required("Please enter description of the class"),
  });

  const {
    control: controlCreate,
    handleSubmit: handleSubmitCreate,
    reset: resetAdd,
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
    },
    resolver: yupResolver(createClassSchema),
  });

  const handleAdd = async data => {
    loader.start();
    postClassExecute(data);
  };

  const sideCreate = () => {
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
          onSubmit={handleSubmitCreate(handleAdd)}
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
                  <Typography variant="subtitle1">Create New Class</Typography>
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
                        control={controlCreate}
                        sx={{ marginBottom: "24px" }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormTextField
                        required
                        name="description"
                        label="Description"
                        control={controlCreate}
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
                  variant="contained"
                  size="large"
                  type="submit"
                  style={{
                    borderRadius: "100px",
                  }}
                >
                  Create
                </Button>
              </Stack>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  };

  const onAdd = () => {
    if (user && user.role.indexOf("admin") >= 0) {
      sharedFunction.setAction("Add");
      resetAdd();
      sidebar.setSidebar(prevState => {
        return {
          ...prevState,
          dependencies: {
            ...prevState.dependencies,
          },
          sidebar: sideCreate,
        };
      });
      sidebar.open();
    } else {
      noPermissionConfirm.open();
      loader.end();
    }
  };

  // Side Effects
  useEffect(() => {
    if (postClassData) {
      setNewItemAnimation(prevState => {
        return {
          ...prevState,
          newItem: postClassData.id,
          callbackFunc: () => {
            snackbar.open("Class created successfully.", false);
            resetAdd();
            sharedFunction.setAction("View");
          },
        };
      });
      fetchList({ params: { sort: "-updatedAt" } });

      sidebar.close();
    }

    return () => {};
  }, [postClassData]);

  // Side Effects
  useEffect(() => {
    if (postClassError) {
      loader.end();

      switch (postClassError.response.data) {
        case "ADMIN_ACTIONS_NOT_ALLOWED":
          snackbar.open("Something went wrong. Plaese try again later", true);
          break;
        case "EMPTY_REQUEST":
          snackbar.open("Something went wrong. Plaese try again later", true);
          break;
        case "DUPLICATED_CLASS":
          snackbar.open(
            "Unique class name is required. Please rephrase your topic",
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
  }, [postClassError]);

  return {
    onAdd,
  };
};

useAddClass.propTypes = {};

export default useAddClass;
