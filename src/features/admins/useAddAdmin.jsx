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
} from "@mui/material";
import * as yup from "yup";

import { FormSelect, FormTextField } from "../../components/FormInput";
import ArrowBack from "../../components/GoogleIcons/ArrowBack";
import useAdmins from "../../services/admins";

const useAddAdmin = ({
  loader,
  sidebar,
  snackbar,
  noPermissionConfirm,
  user,
  setNewItemAnimation,
  fetchList,
  sharedFunction,
}) => {
  // API service
  const { post: postAdmin } = useAdmins();
  const [{ data: postAdminData, error: postAdminError }, postAdminExecute] =
    postAdmin;

  // React Hook Form Set Up
  const createAdminSchema = yup.object({
    name: yup.string().required("Please enter name of the admin"),
    phone: yup.string().required("Please enter phone number of the admin"),
    role: yup.string().required("Please select role"),
  });

  const {
    control: controlCreate,
    handleSubmit: handleSubmitCreate,
    reset: resetAdd,
  } = useForm({
    defaultValues: {
      name: "",
      phone: "",
      role: "admin",
    },
    resolver: yupResolver(createAdminSchema),
  });

  const handleAdd = async data => {
    const modifiedData = data;
    loader.start();
    postAdminExecute(modifiedData);
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
          sx={{
            overflow: "auto",
            maxHeight: { xs: "80vh", md: "100vh" },
            paddingBottom: "80px",
          }}
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
                  <Typography variant="subtitle1">Create New Admin</Typography>
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
                        name="phone"
                        label="Phone"
                        control={controlCreate}
                        sx={{ marginBottom: "24px" }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <FormSelect
                        name="role"
                        label="Role"
                        control={controlCreate}
                        options={[
                          {
                            label: "superadmin",
                            value: "superadmin",
                          },
                          {
                            label: "admin",
                            value: "admin",
                          },
                        ]}
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
    );
  };

  const onAdd = () => {
    if (user && user.role.indexOf("superadmin") >= 0) {
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
    if (postAdminData) {
      setNewItemAnimation(prevState => {
        return {
          ...prevState,
          newItem: postAdminData.id,
          callbackFunc: () => {
            snackbar.open("Admin created successfully.", false);
            resetAdd();
            sharedFunction.setAction("View");
          },
        };
      });
      fetchList({ params: { sort: "-updatedAt" } });

      sidebar.close();
    }

    return () => {};
  }, [postAdminData]);

  // Side Effects
  useEffect(() => {
    if (postAdminError) {
      loader.end();

      switch (postAdminError.response.data) {
        case "ADMIN_ACTIONS_NOT_ALLOWED":
          snackbar.open("Something went wrong. Please try again later", true);
          break;
        case "EMPTY_REQUEST":
          snackbar.open("Something went wrong. Please try again later", true);
          break;
        case "DUPLICATED_ADMIN":
          snackbar.open(
            "Unique admin name is required. Please rephrase your admin name",
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
  }, [postAdminError]);

  return {
    onAdd,
  };
};

useAddAdmin.propTypes = {};

export default useAddAdmin;
