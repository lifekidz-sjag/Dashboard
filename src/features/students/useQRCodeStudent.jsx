import { useEffect } from "react";
import { Box } from "@mui/material";

import useStudents from "../../services/students";

const useQRCodeStudent = ({ loader, confirm }) => {
  // API Services
  const { getStudentByName } = useStudents();

  const [
    { data: getStudentByNameData, error: getStudentByNameError },
    getStudentByNameExecute,
  ] = getStudentByName;

  const onView = name => {
    getStudentByNameExecute(name);
  };

  useEffect(() => {
    if (getStudentByNameData) {
      const extractId = url => {
        const regex = /(?<=file\/d\/)(.*?)(?=\/view)/;
        const match = url.match(regex);
        return match ? match[0] : "No ID found";
      };
      const gId = extractId(getStudentByNameData.qrCode);

      confirm.open(
        "Student QR Code",
        <Box>
          <div
            style={{
              height: 200,
              margin: "15px auto",
              maxWidth: 200,
              width: "100%",
              marginBottom: "30px",
            }}
          >
            <img
              className="student-drive-qr-code"
              src={`https://drive.google.com/thumbnail?id=${gId}&sz=w200`}
              alt="None"
            />
          </div>
        </Box>,
        {
          text: "DOWNLOAD",
          onClick: () => {
            window.open(
              `https://drive.google.com/thumbnail?id=${gId}&sz=w200`,
              "_blank",
              "noopener,noreferrer",
            );
          },
        },
        {
          text: "DONE",
        },
      );
    }

    return () => {};
  }, [getStudentByNameData]);

  // Side Effects
  useEffect(() => {
    if (getStudentByNameError) {
      //
    }
    loader.end();
    return () => {};
  }, [getStudentByNameError]);

  return {
    onView,
  };
};

export default useQRCodeStudent;
