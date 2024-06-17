import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import CryptoJS from "crypto-js";
import { Html5QrcodeScanner, Html5QrcodeScanType } from "html5-qrcode";

import useAttendances from "../../services/attendances";

const useClockInStudent = ({
  loader,
  popupClockIn,
  snackbar,
  sharedFunction,
}) => {
  const [studentInfo, setStudentInfo] = useState(null);
  // API Services
  const { clockIn } = useAttendances();

  const [{ data: clockInData, error: clockInError }, clockInExecute] = clockIn;

  // QR States
  const onScan = () => {
    sharedFunction.setAction("Add");
    popupClockIn.open(
      "Clock In Student",
      {
        text: "Add New",
        onClick: () => {},
      },
      {
        onClick: () => {
          document.getElementById("html5-qrcode-button-camera-stop").click();
          setTimeout(() => {
            popupClockIn.close();
          }, 1000);
        },
      },
      "headerBorder",
      <Box id="reader" />,
    );
  };
  useEffect(() => {
    if (clockInData) {
      snackbar.open(
        `You have clocked in ${studentInfo.studentName} successfully.`,
        false,
      );
      popupClockIn.close();

      setStudentInfo({});
    }

    return () => {};
  }, [clockInData]);

  // Side Effects
  useEffect(() => {
    if (clockInError) {
      loader.end();
      setStudentInfo({});
      popupClockIn.close();

      switch (clockInError.response.data) {
        case "INVALID_STUDENT_NAME":
          snackbar.open("Something went wrong. Plaese try again later", true);
          break;
        case "INVALID_CLASS":
          snackbar.open("Something went wrong. Plaese try again later", true);
          break;
        case "EMPTY_REQUEST":
          snackbar.open("Something went wrong. Plaese try again later", true);
          break;
        case "ALREADY_CLOCKED_IN":
          snackbar.open(
            `${studentInfo.studentName} has already been clocked in!`,
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
  }, [clockInError]);

  useEffect(() => {
    if (popupClockIn.isOpen) {
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
  }, [popupClockIn.isOpen]);

  useEffect(() => {
    if (studentInfo && Object.keys(studentInfo).length > 0) {
      clockInExecute(studentInfo);
    }
  }, [studentInfo]);

  return {
    // renderQRscanner,
    onScan,
  };
};

export default useClockInStudent;
