import { useCallback, useEffect, useState } from "react";
import { Box, TablePagination } from "@mui/material";

const usePaging = (listDetails, refreshListFunc, reset) => {
  const { links, meta } = listDetails || {};
  const pageCount = meta && meta.totalPages;
  const rowCount = meta && meta.count;

  // Change pagination UI state
  const [pageIdx, setPageIdx] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const goTo = useCallback(
    targetPageIdx => {
      setPageIdx(targetPageIdx);
    },
    [setPageIdx],
  );

  useEffect(() => {
    if (pageIdx >= pageCount) {
      setPageIdx(0);
    }
  }, [pageCount]);

  const { self } = links || {};
  let selfPageParam = self ? {} : null;

  useEffect(() => {
    setPageIdx(0);
  }, [reset]);

  if (self) {
    decodeURIComponent(self.replaceAll("+", " "))
      .split("?")[1]
      .split("&")
      .forEach(item => {
        const param = item.split("=");
        selfPageParam = { ...selfPageParam, [param[0]]: param[1] };
      });
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    selfPageParam["page[size]"] = event.target.value;

    refreshListFunc({ params: selfPageParam });

    setPageIdx(0);
  };

  return {
    paginationComponent: (
      <Box component="div" sx={{ mx: "auto", maxWidth: 1200 }}>
        <TablePagination
          component="div"
          count={rowCount ?? 0}
          page={pageIdx}
          onPageChange={(e, val) => {
            // Update page param
            selfPageParam["page[number]"] = val + 1;
            refreshListFunc({ params: selfPageParam });
            goTo(val);
          }}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            "& .MuiTablePagination-selectLabel": {
              color: "rgba(43, 43, 43, 0.6)",
            },
          }}
        />
      </Box>
    ),
  };
};
// <Pagination
//   count={pageCount}
//   page={pageIdx + 1}

//   defaultPage={1}
//   color="primary"
//   size="large"
// />
export default usePaging;
