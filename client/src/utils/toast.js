import { toast } from "react-toastify";

const baseOptions = {
  position: "top-right",
  autoClose: 3000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const showSuccessToast = (message, toastId) =>
  toast.success(message, {
    ...baseOptions,
    toastId,
  });

export const showErrorToast = (message, toastId) =>
  toast.error(message, {
    ...baseOptions,
    toastId,
  });

export const showLoadingToast = (message, toastId) =>
  toast.loading(message, {
    ...baseOptions,
    autoClose: false,
    closeOnClick: false,
    toastId,
  });

export const updateToastSuccess = (toastId, message) =>
  toast.update(toastId, {
    render: message,
    type: "success",
    isLoading: false,
    autoClose: 2500,
    closeOnClick: true,
  });

export const updateToastError = (toastId, message) =>
  toast.update(toastId, {
    render: message,
    type: "error",
    isLoading: false,
    autoClose: 3500,
    closeOnClick: true,
  });
