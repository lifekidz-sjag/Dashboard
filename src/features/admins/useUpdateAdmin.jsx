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
import useAdmins from "../../services/admins";

const useUpdateAdmin = ({
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
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // API service
  const { get: getAdmin, put: putAdmin } = useAdmins();
  const [{ data: getAdminData, error: getAdminError }, getAdminExecute] =
    getAdmin;

  const [{ data: putAdminData, error: putAdminError }, putAdminExecute] =
    putAdmin;

  // React Hook Form Set Up
  const updateAdminSchema = yup.object({
    name: yup.string().required("Please enter name of the admin"),
    phone: yup.string().required("Please enter phone of the admin"),
  });

  const {
    control: controlUpdate,
    handleSubmit: handleSubmitUpdate,
    reset: resetUpdate,
  } = useForm({
    defaultValues: {
      id: "",
      name: "",
      phone: "",
    },
    resolver: yupResolver(updateAdminSchema),
  });

  const handleUpdate = async data => {
    const modifiedData = data;
    delete modifiedData.id;

    loader.start();
    putAdminExecute(sharedState.id, modifiedData);
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
                  <Typography variant="subtitle1">Update Admin</Typography>
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
                        disabled
                        name="name"
                        label="Name"
                        control={controlUpdate}
                        sx={{ marginBottom: "24px" }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormTextField
                        required
                        name="phone"
                        label="Phone"
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
              bottom: "0px",
              left: "0px",
              right: "0px",
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

    if (user && user.role.indexOf("superadmin") >= 0) {
      sharedFunction.setAction("Update");
      sharedFunction.setId(id);
      getAdminExecute(id);
    } else {
      noPermissionConfirm.open();
      loader.end();
    }
  };

  // Side Effects
  useEffect(() => {
    if (getAdminData) {
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
        name: getAdminData.name,
        phone: getAdminData.phone,
      });
      sidebar.open();
      loader.end();
    }
  }, [getAdminData]);

  useEffect(() => {
    if (putAdminData) {
      sidebar.close();
      sharedFunction.setAction("updateComplete");
      fetchList({
        params:
          Object.keys(sharedState.searchParams).length > 0
            ? sharedState.searchParams
            : { sort: "-updatedAt" },
        cb: () => {
          snackbar.open("Admin updated successfully.", false);
          resetUpdate();
          sharedFunction.setAction("View");
          sharedFunction.setId("");
        },
      });
      sidebar.close();
    }

    return () => {};
  }, [putAdminData]);

  // Side Effects
  useEffect(() => {
    if (getAdminError) {
      loader.end();
      switch (getAdminError.response.data) {
        case "INVALID_ID":
          snackbar.open("Something went wrong. Plaese try again later", true);
          break;

        default:
          break;
      }
    }
    loader.end();
    return () => {};
  }, [getAdminError]);

  useEffect(() => {
    if (putAdminError) {
      switch (putAdminError.response.data) {
        case "ADMIN_ACTIONS_NOT_ALLOWED":
          snackbar.open("Something went wrong. Plaese try again later", true);
          break;
        case "EMPTY_REQUEST":
          snackbar.open("Something went wrong. Plaese try again later", true);
          break;
        case "DUPLICATED_ADMIN":
          snackbar.open(
            "Unique admin name is required. Please rephrase your admin name",
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
  }, [putAdminError]);

  return {
    onUpdate,
  };
};

useUpdateAdmin.propTypes = {};

export default useUpdateAdmin;
