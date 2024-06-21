import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  FormLabel,
  Grid,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import dayjs, { utc } from "dayjs";
import * as yup from "yup";

import formBg from "../../assets/form-bg.png";
import {
  FormDateTimePicker,
  FormSelect,
  FormTextField,
} from "../../components/FormInput";
import ArrowBack from "../../components/GoogleIcons/ArrowBack";
import useClasses from "../../services/classes";
import useStudents from "../../services/students";

const useUpdateStudent = ({
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
  const { fetch: fetchClasses } = useClasses();
  const { get: getStudent, put: putStudent } = useStudents();
  const [
    { data: fetchClassesData, error: fetchClassesError },
    fetchClassesExecute,
  ] = fetchClasses;

  const [{ data: getStudentData, error: getStudentError }, getStudentExecute] =
    getStudent;

  const [{ data: putStudentData, error: putStudentError }, putStudentExecute] =
    putStudent;

  // React Hook Form Set Up
  const updateStudentSchema = yup.object({
    name: yup.string().required("Please enter name of the student"),
    age: yup.number().required("Please enter age of the student"),
    class: yup.string().required("Please select a class"),
    gender: yup.string().required("Please select gender of the student"),
    type: yup.string().required("Please select one"),
    birthday: yup.string().required("Please enter birthday of student"),
    famName: yup.string().required("Please enter main family member name"),
    famContact: yup
      .string()
      .required("Please enter main family member contact"),
    famRelationship: yup
      .string()
      .required("Please enter main family member relationship"),
    otherFamName: yup.string(),
    otherFamContact: yup.string(),
    otherFamRelationship: yup.string(),
  });

  const {
    control: controlUpdate,
    handleSubmit: handleSubmitUpdate,
    reset: resetUpdate,
  } = useForm({
    defaultValues: {
      name: "",
      age: "",
      class: "",
      gender: "",
      type: "",
      birthday: new Date(new Date().setHours(new Date().getHours() + 8))
        .toISOString()
        .replace(/\.\d{3}Z$/, ""),
      famName: "",
      famContact: "",
      famRelationship: "",
      otherFamName: "",
      otherFamContact: "",
      otherFamRelationship: "",
    },
    resolver: yupResolver(updateStudentSchema),
  });

  const handleUpdate = async data => {
    const modifiedData = data;
    delete modifiedData.id;
    dayjs.extend(utc);

    modifiedData.birthday = `${dayjs(new Date(data.birthday))
      .utc()
      .format("YYYY-MM-DD")}`;

    loader.start();
    putStudentExecute(sharedState.id, modifiedData);
  };

  const genderOptions = [
    { id: "male", name: "Male" },
    { id: "female", name: "Female" },
  ];
  const typeOptions = [
    { id: "regular", name: "Regular" },
    { id: "new", name: "New" },
  ];
  const sideUpdate = dependencies => {
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
          sx={{
            overflow: "auto",
            maxHeight: { xs: "calc(80vh - 140px)", md: "100vh" },
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
                position: "sticky",
                top: 0,
                background: "#fff",
                zIndex: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box>
                  <IconButton onClick={sidebar.close}>
                    <ArrowBack color="inherit" />
                  </IconButton>
                </Box>
                <Box sx={{ marginLeft: "8px" }}>
                  <Typography variant="subtitle1">Update Student</Typography>
                </Box>
              </Box>
            </Box>

            {/* Form Fields */}
            <Box
              sx={{
                flex: "1 1 auto",
                minHeight: {
                  xs: "calc(100vh - 400px)",
                },
                height: {
                  xs: "calc(100vh - 400px)",
                },
                padding: "0px 0px 160px",
                boxSizing: "border-box",
                position: "relative",
                zIndex: 1,
              }}
            >
              <Grid container alignItems="center">
                <Grid item xs={12} sx={{ marginTop: "30px" }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <FormTextField
                        required
                        name="name"
                        label="Name"
                        control={controlUpdate}
                        sx={{ marginBottom: "24px" }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormSelect
                        name="type"
                        label="Regular or New?"
                        control={controlUpdate}
                        options={typeOptions.map(data => ({
                          label: data.name,
                          value: data.id,
                        }))}
                        sx={{ marginBottom: "24px" }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormTextField
                        required
                        name="age"
                        label="Age"
                        control={controlUpdate}
                        sx={{ marginBottom: "24px" }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormSelect
                        name="gender"
                        label="Gender"
                        control={controlUpdate}
                        options={genderOptions.map(data => ({
                          label: data.name,
                          value: data.id,
                        }))}
                        sx={{ marginBottom: "24px" }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormSelect
                        name="class"
                        label="Class"
                        control={controlUpdate}
                        options={dependencies.classes.map(data => ({
                          label: data.name,
                          value: data.id,
                        }))}
                        sx={{ marginBottom: "24px" }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormDateTimePicker
                        label="Birthday"
                        name="birthday"
                        control={controlUpdate}
                      />
                    </Grid>
                    <FormLabel sx={{ marginLeft: "16px", marginRight: "8px" }}>
                      Family members
                    </FormLabel>
                    <Grid item xs={12}>
                      <FormTextField
                        required
                        control={controlUpdate}
                        name="famName"
                        label="Main Family Member Name"
                        sx={{ marginBottom: "24px" }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormTextField
                        required
                        control={controlUpdate}
                        name="famContact"
                        label="Main Family Member Contact"
                        sx={{ marginBottom: "24px" }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormTextField
                        required
                        control={controlUpdate}
                        name="famRelationship"
                        label="Main Family Member Relationship"
                        sx={{ marginBottom: "24px" }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormTextField
                        required
                        control={controlUpdate}
                        name="otherFamName"
                        label="Secondary Family Member Name (Optional)"
                        sx={{ marginBottom: "24px" }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormTextField
                        required
                        control={controlUpdate}
                        name="otherFamContact"
                        label="Secondary Family Member Contact (Optional)"
                        sx={{ marginBottom: "24px" }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormTextField
                        required
                        control={controlUpdate}
                        name="otherFamRelationship"
                        label="Secondary Family Member Relationship (Optional)"
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
      getStudentExecute(id);
      fetchClassesExecute();
    } else {
      noPermissionConfirm.open();
      loader.end();
    }
  };

  // Side Effects
  useEffect(() => {
    if (getStudentData && fetchClassesData && fetchClassesData.data) {
      // open form
      sidebar.setSidebar(prevState => {
        return {
          ...prevState,
          dependencies: {
            ...prevState.dependencies,
            classes: fetchClassesData.data,
          },
          sidebar: sideUpdate,
        };
      });
      resetUpdate({
        name: getStudentData.name,
        age: getStudentData.age,
        gender: getStudentData.gender,
        type: getStudentData.type,
        class: getStudentData.class,
        birthday: getStudentData.birthday,
        famName: getStudentData.famName,
        famContact: getStudentData.famContact,
        famRelationship: getStudentData.famRelationship,
        otherFamName: getStudentData.otherFamName,
        otherFamContact: getStudentData.otherFamContact,
        otherFamRelationship: getStudentData.otherFamRelationship,
      });
      sidebar.open();
      loader.end();
    }
  }, [getStudentData, fetchClassesData]);

  useEffect(() => {
    if (putStudentData) {
      sidebar.close();
      sharedFunction.setAction("updateComplete");
      fetchList({
        params:
          Object.keys(sharedState.searchParams).length > 0
            ? sharedState.searchParams
            : { sort: "-updatedAt" },
        cb: () => {
          snackbar.open("Student updated successfully.", false);
          resetUpdate();
          sharedFunction.setAction("View");
          sharedFunction.setId("");
        },
      });
      sidebar.close();
    }

    return () => {};
  }, [putStudentData]);

  useEffect(() => {
    if (fetchClassesError) {
      //
    }

    return () => {};
  }, [fetchClassesError]);

  // Side Effects
  useEffect(() => {
    if (getStudentError) {
      loader.end();
      switch (getStudentError.response.data) {
        case "INVALID_ID":
          snackbar.open("Something went wrong. Plaese try again later", true);
          break;

        default:
          break;
      }
    }
    loader.end();
    return () => {};
  }, [getStudentError]);

  useEffect(() => {
    if (putStudentError) {
      switch (putStudentError.response.data) {
        case "ADMIN_ACTIONS_NOT_ALLOWED":
          snackbar.open("Something went wrong. Plaese try again later", true);
          break;
        case "EMPTY_REQUEST":
          snackbar.open("Something went wrong. Plaese try again later", true);
          break;
        case "DUPLICATED_STUDENT":
          snackbar.open(
            "Unique student name is required. Please rephrase your student name",
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
  }, [putStudentError]);

  return {
    onUpdate,
  };
};

useUpdateStudent.propTypes = {};

export default useUpdateStudent;
