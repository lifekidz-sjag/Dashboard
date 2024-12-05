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
import useClasses from "../../services/classes";
import useTeachers from "../../services/teachers";

const useAddTeacher = ({
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
  const { fetch: fetchClasses } = useClasses();
  const { post: postTeacher } = useTeachers();
  const [
    { data: fetchClassesData, error: fetchClassesError },
    fetchClassesExecute,
  ] = fetchClasses;
  const [
    { data: postTeacherData, error: postTeacherError },
    postTeacherExecute,
  ] = postTeacher;

  // React Hook Form Set Up
  const createTeacherScema = yup.object({
    name: yup.string().required("Please enter name of the teacher"),
    phone: yup.string().required("Please enter phone number of the teacher"),
    class: yup.string().required("Please select a class"),
  });

  const {
    control: controlCreate,
    handleSubmit: handleSubmitCreate,
    reset: resetAdd,
  } = useForm({
    defaultValues: {
      name: "",
      phone: "",
      class: "",
    },
    resolver: yupResolver(createTeacherScema),
  });

  const handleAdd = async data => {
    loader.start();
    postTeacherExecute(data);
  };

  const sideCreate = dependencies => {
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
                  <Typography variant="subtitle1">
                    Create New Teacher
                  </Typography>
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
                        name="class"
                        label="Class"
                        control={controlCreate}
                        options={dependencies.classes.map(data => ({
                          label: data.name,
                          value: data.id,
                        }))}
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
    if (user && user.role.indexOf("admin") >= 0) {
      sharedFunction.setAction("Add");
      resetAdd();
      fetchClassesExecute({ params: { sort: "name" } });
    } else {
      noPermissionConfirm.open();
      loader.end();
    }
  };

  // Side Effects
  useEffect(() => {
    if (postTeacherData) {
      setNewItemAnimation(prevState => {
        return {
          ...prevState,
          newItem: postTeacherData.id,
          callbackFunc: () => {
            snackbar.open("Teacher created successfully.", false);
            resetAdd();
            sharedFunction.setAction("View");
          },
        };
      });
      fetchList({ params: { sort: "-updatedAt" } });

      sidebar.close();
    }

    return () => {};
  }, [postTeacherData]);

  useEffect(() => {
    if (fetchClassesData && fetchClassesData.data) {
      sidebar.setSidebar(prevState => {
        return {
          ...prevState,
          dependencies: {
            ...prevState.dependencies,
            classes: fetchClassesData.data,
          },
          sidebar: sideCreate,
        };
      });
      sidebar.open();
    }

    return () => {};
  }, [fetchClassesData]);

  useEffect(() => {
    if (fetchClassesError) {
      //
    }

    return () => {};
  }, [fetchClassesError]);

  // Side Effects
  useEffect(() => {
    if (postTeacherError) {
      loader.end();

      switch (postTeacherError.response.data) {
        case "ADMIN_ACTIONS_NOT_ALLOWED":
          snackbar.open("Something went wrong. Please try again later", true);
          break;
        case "EMPTY_REQUEST":
          snackbar.open("Something went wrong. Please try again later", true);
          break;
        case "DUPLICATED_TEACHER":
          snackbar.open(
            "Unique teacher name is required. Please rephrase your teacher name",
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
  }, [postTeacherError]);

  return {
    onAdd,
  };
};

useAddTeacher.propTypes = {};

export default useAddTeacher;
