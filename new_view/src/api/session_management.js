import axios from "axios";

// Add the JWT to all HTTP requests
const setHeaders = () => {
  axios.defaults.headers.common["Authorization"] =
    sessionStorage.getItem("app-token") !== null
      ? sessionStorage.getItem("app-token")
      : null;
};

/**
 * deletes any (expired) token and relaunch the app
 */
const reAuthenticate = (status) => {
  if (status === 401) {
    // delete all the information (not just the token)
    sessionStorage.clear();
    //reload the app
    window.location.reload(true);
  }
};

export { setHeaders, reAuthenticate };
