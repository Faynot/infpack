import { useEffect, useState } from "react";

const useErrorRedirect = () => {
  const [errorInfo, setErrorInfo] = useState({ hasError: false, message: "" });

  useEffect(() => {
    const handleError = (event: any) => {
      if (event.error) {
        if (event.error.status === 502 || event.error.status === 429) {
          setErrorInfo({
            hasError: true,
            message: event.error.message || "An error occurred",
          });
        }
      }
    };

    window.addEventListener("error", handleError);

    return () => {
      window.removeEventListener("error", handleError);
    };
  }, []);

  useEffect(() => {
    if (errorInfo.hasError) {
      console.error(errorInfo.message);
      window.location.href = "/";
    }
  }, [errorInfo]);

  return errorInfo;
};

export default useErrorRedirect;
