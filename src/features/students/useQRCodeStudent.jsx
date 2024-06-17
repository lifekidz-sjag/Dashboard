import { useEffect } from "react";
import { Box } from "@mui/material";

import useStudents from "../../services/students";

const useQRCodeStudent = ({ loader, confirm, snackbar }) => {
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
      console.log(getStudentByNameData);

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
              height: 130,
              margin: "15px auto",
              maxWidth: 130,
              width: "100%",
              marginBottom: "30px",
            }}
          >
            <img
              src={`https://drive.google.com/thumbnail?id=${gId}&sz=w1000`}
              alt="None"
            />
          </div>
        </Box>,
        {
          text: "COPY",
          onClick: async () => {
            // handleCopy(url);
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
