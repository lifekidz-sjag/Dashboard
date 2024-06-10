import axios from "axios";

const linkParser = linkHeader => {
  // const re = /<([^?]+\?[a-z]+=([\d]+))>;[\s]*rel="([a-z]+)"/g;
  const re = /<([^>]+)>;[\s]*rel="([a-z]+)"/g;
  const obj = {};
  let arrRes = re.exec(linkHeader);

  while (arrRes !== null) {
    const url = new URL(arrRes[1]);
    const page = window.parseInt(new URLSearchParams(url.search).get("_page"));

    obj[arrRes[2]] = {
      url,
      page,
    };

    arrRes = re.exec(linkHeader);
  }

  return obj;
};

export function handleResponse(response) {
  const { link } = response.headers;

  if (response.results) {
    return response.results;
  }

  if (response.data) {
    if (link) {
      response.data.pagination = linkParser(link);
    }
    return response.data;
  }

  return response;
}

export function handleError(error) {
  let statusCode = 0;
  let errorCode = "";

  if (axios.isCancel(error)) {
    return { isCancelled: true };
  }

  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx

    statusCode = error.response.status;
    errorCode = error.response.data;
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js

    statusCode = 12164;
    errorCode = "Server Unreachable";
  } else {
    // Something happened in setting up the request that triggered an Error
    statusCode = 400;
    errorCode = error.message;
  }

  // console.log(error.config);

  return { error, errorCode, statusCode };

  // if (reason.data) {
  //   return {
  //     error: reason.data,
  //   };
  // }

  // return { reason };
}
