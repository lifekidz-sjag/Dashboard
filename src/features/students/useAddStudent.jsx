import { useEffect, useState } from "react";
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
import CryptoJS from "crypto-js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import QRCode from "qrcode.react";
import * as yup from "yup";

import formBg from "../../assets/form-bg.png";
import {
  FormDateTimePicker,
  FormSelect,
  FormTextAreaField,
  FormTextField,
} from "../../components/FormInput";
import ArrowBack from "../../components/GoogleIcons/ArrowBack";
import useClasses from "../../services/classes";
import useStudents from "../../services/students";

const useAddStudent = ({
  loader,
  sidebar,
  snackbar,
  setNewItemAnimation,
  fetchList,
  sharedState,
  sharedFunction,
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [qrCodeData, setQRCodeData] = useState("");

  // API service
  const { fetch: fetchClasses } = useClasses();
  const { post: postStudent } = useStudents();
  const [
    { data: fetchClassesData, error: fetchClassesError },
    fetchClassesExecute,
  ] = fetchClasses;
  const [
    { data: postStudentData, error: postStudentError },
    postStudentExecute,
  ] = postStudent;

  const createStudentSchema = yup.object({
    name: yup.string().required("Please enter name of the student"),
    age: yup
      .number("Must be a number type")
      .transform(value => (Number.isNaN(value) ? null : value))
      .nullable(),
    class: yup.string().required("Please select a class"),
    type: yup.string().required("Please select one"),
    gender: yup.string().required("Please select gender of the student"),
    birthday: yup.string().required("Please enter birthday of student"),
    allergies: yup.string(),
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
    control: controlCreate,
    handleSubmit: handleSubmitCreate,
    reset: resetAdd,
    watch,
    setValue,
    getValues,
  } = useForm({
    defaultValues: {
      name: "",
      age: 0,
      class: "",
      type: "",
      gender: "",
      birthday: new Date(new Date().setHours(new Date().getHours() + 8))
        .toISOString()
        .replace(/\.\d{3}Z$/, ""),
      allergies: "",
      famName: "",
      famContact: "",
      famRelationship: "",
      otherFamName: "",
      otherFamContact: "",
      otherFamRelationship: "",
    },
    resolver: yupResolver(createStudentSchema),
  });

  const handleAdd = async data => {
    const modifiedData = {
      name: data.name,
      class: data.class,
    };
    delete modifiedData.age;
    loader.start();

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(modifiedData),
      "wAqNU0K3BKX8",
    ).toString();

    setQRCodeData(JSON.stringify({ encrypted: encryptedData }));
  };

  const genderOptions = [
    { id: "male", name: "Male" },
    { id: "female", name: "Female" },
  ];

  const typeOptions = [
    { id: "regular", name: "Regular" },
    { id: "new", name: "New" },
  ];

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
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton
                  onClick={() => {
                    sidebar.close(() => {
                      sharedFunction.setAction("View");
                      resetAdd();
                    });
                  }}
                >
                  <ArrowBack color="inherit" />
                </IconButton>
                <Box sx={{ marginLeft: "8px" }}>
                  <Typography variant="subtitle1">Create Student</Typography>
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
                        control={controlCreate}
                        sx={{ marginBottom: "24px" }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormSelect
                        name="type"
                        label="Regular or New"
                        control={controlCreate}
                        options={typeOptions.map(data => ({
                          label: data.name,
                          value: data.id,
                        }))}
                        sx={{ marginBottom: "24px" }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormSelect
                        name="gender"
                        label="Gender"
                        control={controlCreate}
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
                        control={controlCreate}
                        options={dependencies.classes.map(data => ({
                          label: data.name,
                          value: data.id,
                        }))}
                        sx={{ marginBottom: "24px" }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ marginTop: "24px" }}>
                      <FormTextField
                        disabled
                        name="age"
                        label="Age"
                        control={controlCreate}
                      />
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ marginTop: "24px" }}>
                      <FormDateTimePicker
                        label="Birthday"
                        name="birthday"
                        control={controlCreate}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormTextAreaField
                        name="allergies"
                        label="Allergies"
                        control={controlCreate}
                        rows={3}
                        sx={{ marginBottom: "24px" }}
                      />
                    </Grid>

                    {/* Hidden QR Code element */}
                    <div style={{ display: "none" }}>
                      <QRCode
                        id="qrCodeCanvas"
                        value={dependencies.qrCodeData}
                        size={256}
                        level="H"
                        includeMargin
                      />
                    </div>
                    <FormLabel sx={{ marginLeft: "16px", marginRight: "8px" }}>
                      Family members
                    </FormLabel>
                    <Grid item xs={12}>
                      <FormTextField
                        required
                        control={controlCreate}
                        name="famName"
                        label="Main Family Member Name"
                        sx={{ marginBottom: "24px" }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormTextField
                        required
                        control={controlCreate}
                        name="famContact"
                        label="Main Family Member Contact"
                        sx={{ marginBottom: "24px" }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormTextField
                        required
                        control={controlCreate}
                        name="famRelationship"
                        label="Main Family Member Relationship"
                        sx={{ marginBottom: "24px" }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormTextField
                        required
                        control={controlCreate}
                        name="otherFamName"
                        label="Secondary Family Member Name (Optional)"
                        sx={{ marginBottom: "24px" }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormTextField
                        required
                        control={controlCreate}
                        name="otherFamContact"
                        label="Secondary Family Member Contact (Optional)"
                        sx={{ marginBottom: "24px" }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormTextField
                        required
                        control={controlCreate}
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
    sharedFunction.setAction("Add");
    resetAdd();
    fetchClassesExecute({ params: { sort: "name" } });
  };
  const calculateAge = dateString => {
    const birthDate = new Date(dateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age -= 1;
    }
    return age;
  };
  // Side Effects
  useEffect(() => {
    if (postStudentData) {
      sharedFunction.setAction("View");
      setNewItemAnimation(prevState => {
        return {
          ...prevState,
          newItem: postStudentData.id,
          callbackFunc: () => {
            snackbar.open("Student created successfully.", false);
            resetAdd();
          },
        };
      });
      fetchList({ params: { sort: "-updatedAt" } });

      sidebar.close();
      setQRCodeData("");
    }

    return () => {};
  }, [postStudentData]);

  useEffect(() => {
    if (sharedState.action !== "Add") {
      return;
    }
    if (fetchClassesData && fetchClassesData.data) {
      sidebar.setSidebar(prevState => {
        return {
          ...prevState,
          dependencies: {
            ...prevState.dependencies,
            classes: fetchClassesData && fetchClassesData.data,
            qrCodeData,
          },
          sidebar: sideCreate,
        };
      });
      sidebar.open();
    }

    if (qrCodeData) {
      setTimeout(() => {
        const data = getValues();
        dayjs.extend(utc);

        data.birthday = `${dayjs(new Date(data.birthday))
          .utc()
          .format("YYYY-MM-DD")}`;

        const qrCodeCanvas = document.getElementById("qrCodeCanvas");
        const qrCodeDataUri = qrCodeCanvas.toDataURL("image/jpeg", 0.3);

        data.qRcode = qrCodeDataUri.replace(/^data:image\/[a-z]+;base64,/, "");
        postStudentExecute(data);
      }, 1000);
    }
  }, [fetchClassesData, qrCodeData, sharedState.action]);

  useEffect(() => {
    if (fetchClassesError) {
      //
    }

    return () => {};
  }, [fetchClassesError]);

  // Side Effects
  useEffect(() => {
    if (postStudentError) {
      loader.end();

      switch (postStudentError.response.data) {
        case "EMPTY_REQUEST":
          snackbar.open("Something went wrong. Please try again later", true);
          break;
        case "DUPLICATED_STUDENT":
          snackbar.open(
            "Unique student name is required. Please rephrase your student name",
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
  }, [postStudentError]);

  useEffect(() => {
    if (watch("birthday")) {
      setValue("age", calculateAge(watch("birthday")));
    }
  }, [watch("birthday")]);

  return {
    onAdd,
  };
};

useAddStudent.propTypes = {};
export default useAddStudent;
