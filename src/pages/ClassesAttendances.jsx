import { useEffect } from "react";
import { useOutletContext, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

const ClassAttendances = () => {
  const [searchParams] = useSearchParams();
  console.log(searchParams.get("classId"));
  console.log(searchParams.get("targetDate"));
  dayjs.extend(utc);

  useEffect(() => {
    const today = dayjs(new Date());
    const targetDate = `${
      today.utc().format("YYYY-MM-DDTHH:mm:ssZ").split("+")[0]
    }Z`;
    axios
      .get(
        `Attendances?filter[classId]=${searchParams.get(
          "classId",
        )}&filter[targetDate]=${targetDate}`,
      )
      .then(response => {
        // Handle data
        console.log(response);
      });
  }, [searchParams]);
  return "TEST";
};

ClassAttendances.propTypes = {};

export default ClassAttendances;
