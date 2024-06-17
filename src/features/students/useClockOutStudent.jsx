import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { Html5QrcodeScanner, Html5QrcodeScanType } from "html5-qrcode";

import useAttendances from "../../services/attendances";

const useClockOutStudent = ({
  loader,
  popupClockOut,
  snackbar,
  sharedFunction,
}) => {
  const [studentInfo, setStudentInfo] = useState(null);
  // API Services
  const { clockOut } = useAttendances();

  const [{ data: clockOutData, error: clockOutError }, clockOutExecute] =
    clockOut;

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
      <Box id="reader" />,
    );
  };
  useEffect(() => {
    if (clockOutData) {
      snackbar.open(
        `You have clocked out ${studentInfo.studentName} successfully.`,
        false,
      );
      popupClockOut.close();
      setStudentInfo({});
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
            const decodedStudentInfo = JSON.parse(decodedText);
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
      clockOutExecute(studentInfo);
    }
  }, [studentInfo]);

  return {
    // renderQRscanner,
    onScan,
  };
};

export default useClockOutStudent;
