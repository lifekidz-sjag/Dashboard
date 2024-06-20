import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  FormControl,
  FormGroup,
  Grid,
  Rating,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import CryptoJS from "crypto-js";
import { Html5QrcodeScanner, Html5QrcodeScanType } from "html5-qrcode";
import * as yup from "yup";

import formBg from "../../assets/form-bg.png";
import useAttendances from "../../services/attendances";
import useStudentEvaluation from "../../services/studentEvaluation";

const useClockOutStudent = ({
  loader,
  popupClockOut,
  sidebar,
  snackbar,
  sharedFunction,
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [studentInfo, setStudentInfo] = useState(null);
  const [step, setStep] = useState(0);
  const [cId, setCId] = useState("");
  const [classEvaluation, setClassEvaluation] = useState([]);
  const [postData, setPostData] = useState({});

  const ratingSchema = yup.object({
    rating: yup.array(),
  });
  const {
    control: controlRating,
    getValues: getValuesRating,
    reset: resetRating,
    handleSubmit: handleSubmitRating,
  } = useForm({
    defaultValues: {
      rating: [],
    },
    resolver: yupResolver(ratingSchema),
  });
  const { fields: fieldsRating } = useFieldArray({
    control: controlRating, // control props comes from useForm (optional: if you are using FormProvider)
    name: "rating", // unique name for your Field Array
    keyName: "key",
  });

  // API
  const { clockOut } = useAttendances();
  const { post: postStudentEvaluation } = useStudentEvaluation();

  const [{ data: clockOutData, error: clockOutError }, clockOutExecute] =
    clockOut;

  const [
    { data: postStudentEvaluationData, error: postStudentEvaluationError },
    postStudentEvaluationExecute,
  ] = postStudentEvaluation;
  // QR States
  const onScan = () => {
    sharedFunction.setAction("Add");
    popupClockOut.open(
      "Clock Out Student",
      {
        text: "Add New",
        onClick: () => {},
      },
      {
        onClick: () => {
          document.getElementById("html5-qrcode-button-camera-stop").click();
          setTimeout(() => {
            popupClockOut.close();
          }, 1000);
        },
      },
      "headerBorder",
      step === 0 ? <Box id="reader" /> : <Box />,
    );
  };

  const onRatingChanged = (checkedId, value, index) => {
    const temp = getValuesRating().rating.map((ori, i) => {
      if (index === i) {
        return {
          ...getValuesRating().rating[index],
          rating: value,
        };
      }
      return ori;
    });

    resetRating({
      rating: temp,
    });
  };

  const handleRating = data => {
    loader.start();
    clockOutExecute(studentInfo);
    setPostData(data);
  };

  const sideRating = () => {
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
          onSubmit={handleSubmitRating(handleRating)}
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
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box sx={{ marginLeft: "8px" }}>
                    <Typography variant="subtitle1">Create Student</Typography>
                  </Box>
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
              <FormControl sx={{ width: "100%" }}>
                <FormGroup row>
                  <Controller
                    name="rating"
                    render={({ field: { onChange, value } }) => {
                      return (
                        <Grid container spacing={2} sx={{ padding: "32px" }}>
                          {classEvaluation.map((item, index) => {
                            return (
                              <Grid item xs={12} key={item.id}>
                                <>
                                  <Typography variant="body1">
                                    {index + 1}. {item.criteriaName} {` - `}
                                    {item.criteriaDescription}
                                  </Typography>
                                  <Typography variant="body2" />
                                  <Rating
                                    name={item.criteriaName}
                                    value={value.index}
                                    onChange={(e, newValue) => {
                                      onChange(
                                        onRatingChanged(
                                          item.id,
                                          newValue,
                                          index,
                                        ),
                                      );
                                    }}
                                  />
                                </>
                              </Grid>
                            );
                          })}
                        </Grid>
                      );
                    }}
                    control={controlRating}
                  />
                </FormGroup>
              </FormControl>
              ,
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

  useEffect(() => {
    if (clockOutData && postData) {
      postStudentEvaluationExecute({
        classId: studentInfo.classId,
        studentName: studentInfo.studentName,
        evaluation: postData.rating,
      });
    }

    return () => {};
  }, [clockOutData]);

  // Side Effects
  useEffect(() => {
    if (clockOutError) {
      loader.end();
      popupClockOut.close();
      setStudentInfo({});

      switch (clockOutError.response.data) {
        case "INVALID_STUDENT_NAME":
          snackbar.open("Something went wrong. Plaese try again later", true);
          break;
        case "INVALID_CLASS":
          snackbar.open("Something went wrong. Plaese try again later", true);
          break;
        case "EMPTY_REQUEST":
          snackbar.open("Something went wrong. Plaese try again later", true);
          break;
        case "ALREADY_CLOCKED_OUT":
          snackbar.open(
            `You have not clocked in ${studentInfo.studentName} yet!`,
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
  }, [clockOutError]);

  useEffect(() => {
    if (postStudentEvaluationData) {
      loader.end();

      snackbar.open(
        `You have clocked out ${studentInfo.studentName} successfully.`,
        false,
      );
      popupClockOut.close();
      setStudentInfo({});
      setPostData({});
    }
  }, [postStudentEvaluationData]);

  useEffect(() => {
    if (postStudentEvaluationError) {
      if (postStudentEvaluationData) {
        loader.end();
        popupClockOut.close();
        setStudentInfo({});
        setPostData({});
        switch (clockOutError.response.data) {
          case "INVALID_STUDENT_NAME":
            snackbar.open("Something went wrong. Plaese try again later", true);
            break;
          case "INVALID_CLASS_ID":
            snackbar.open("Something went wrong. Plaese try again later", true);
            break;
          case "EMPTY_REQUEST":
            snackbar.open("Something went wrong. Plaese try again later", true);
            break;
          case "UNAUTHORIZED_ACTION":
            snackbar.open("Please login again to proceed", true);
            break;
          default:
            break;
        }
      }
    }
  }, [postStudentEvaluationError]);

  useEffect(() => {
    if (popupClockOut.isOpen) {
      setTimeout(() => {
        const scanner = new Html5QrcodeScanner("reader", {
          qrbox: {
            width: 250,
            height: 250,
          },
          fps: 5,
          supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
        });

        let isScanning = true;

        scanner.render(decodedText => {
          if (isScanning) {
            scanner.clear();
            const bytes = CryptoJS.AES.decrypt(
              JSON.parse(decodedText).encrypted,
              "wAqNU0K3BKX8",
            );
            const decodedStudentInfo = JSON.parse(
              bytes.toString(CryptoJS.enc.Utf8),
            );
            const studentName = decodedStudentInfo.name;
            const classId = decodedStudentInfo.class;

            setStudentInfo({
              classId,
              studentName,
            });

            isScanning = false; // Set isScanning to false to stop further scanning
          }
        });
      }, 1000);
    }
  }, [popupClockOut.isOpen]);

  useEffect(() => {
    if (studentInfo && Object.keys(studentInfo).length > 0) {
      setStep(1);
      setCId(studentInfo.classId);
    }
  }, [studentInfo]);

  useEffect(() => {
    if (cId) {
      axios.get(`Classes/${cId}/Evaluation`).then(response => {
        // Handle data
        popupClockOut.close();
        const array = [];
        response.data.data.forEach(v => {
          array.push({
            id: v.id,
            rating: 0,
          });
        });

        resetRating({ rating: array });
        setClassEvaluation(response.data.data);
      });
    }
  }, [cId]);

  useEffect(() => {
    if (classEvaluation && studentInfo) {
      sidebar.setSidebar(prevState => {
        return {
          ...prevState,
          dependencies: {
            ...prevState.dependencies,
            fieldsRating,
          },
          sidebar: sideRating,
        };
      });
      sidebar.open();
    }
  }, [classEvaluation, fieldsRating]);

  return {
    // renderQRscanner,
    onScan,
  };
};

export default useClockOutStudent;
