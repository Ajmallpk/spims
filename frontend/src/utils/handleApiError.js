// import toast from "react-hot-toast";

// export const handleApiError = (error, fallback = "Something went wrong") => {

//   if (error.response) {
//     const message =
//       error.response.data?.error ||
//       error.response.data?.message ||
//       error.response.data?.detail ||
//       fallback;

//     toast.error(message);
//   }

//   else if (error.request) {
//     toast.error("Network error. Please check your internet connection.");
//   }

//   else {
//     toast.error(fallback);
//   }
// };



import toast from "react-hot-toast";

export const handleApiError = (
  error,
  fallback = "Something went wrong"
) => {

  let message = fallback;

  if (error.response) {

    message =

      Object.values(
        error.response.data?.errors || {}
      )[0]?.[0] ||

      error.response.data?.message ||

      error.response.data?.error ||

      error.response.data?.detail ||

      fallback;

    

  }

  else if (error.request) {

    message =
      "Network error. Check internet connection.";

  }

  toast.error(message);

  return message;

};