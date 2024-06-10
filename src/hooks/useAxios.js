import axios from "axios";
import useAxios from "axios-hooks";

// const useAxios = makeUseAxios({
//   axios: axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL }),
// });

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

export default useAxios;

export const transformUrl = (apiEndpoint, id) => {
  return `${apiEndpoint}/${id}`;
};
