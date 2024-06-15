import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box } from "@mui/material";
import * as yup from "yup";

import { FormTextField } from "../../components/FormInput";

const useSearchClasses = ({ loader, fetchList, sharedFunction }) => {
  // Native states

  const searchInfoSchema = yup.object({
    keyword: yup.string(),
  });

  const {
    control: controlSearch,
    handleSubmit: handleSubmitSearch,
    reset: resetSearch,
  } = useForm({
    defaultValues: {
      keyword: "",
    },
    resolver: yupResolver(searchInfoSchema),
  });

  // API service

  const handleSearchClick = async data => {
    loader.start();
    sharedFunction.setSearchStatus("searching");
    const params = {
      sort: data.searchSort,
      "page[size]": 10,
    };

    if (data.keyword) {
      params["filter[name]"] = `like:${data.keyword}`;
    }

    sharedFunction.setSearchParams(params);

    fetchList({
      params,
    });
  };

  const handleBackClick = () => {
    loader.start();
    fetchList({
      params: {
        sort: "-updatedAt",
      },
    });
    resetSearch();
    sharedFunction.setSearchStatus("none");
    sharedFunction.setSearchParams({});
  };

  const searchBarContent = () => {
    return (
      <Box
        sx={{
          display: "flex",
          flexFlow: { xs: "wrap", md: "unset" },
          gap: { xs: "8px", md: "16px" },
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Box
          sx={{
            flex: { xs: "100%", md: "5 1 160px" },
            order: { xs: "1", md: "3" },
          }}
        >
          <FormTextField
            name="keyword"
            control={controlSearch}
            label="Keywords"
          />
        </Box>
      </Box>
    );
  };
  // Side Effects

  return {
    submitFunc: handleSubmitSearch,
    searchFunc: handleSearchClick,
    backFunc: handleBackClick,
    reset: resetSearch,
    searchBarContent,
  };
};

useSearchClasses.propTypes = {};

export default useSearchClasses;
