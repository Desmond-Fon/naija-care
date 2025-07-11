import { toast, type ToastOptions, type TypeOptions } from "react-toastify";

interface AppToastOptions extends ToastOptions {
  description: string;
  status: Exclude<TypeOptions, "default">; // Exclude 'default'
}

export function useAppToast() {
  return ({ description, status, ...options }: AppToastOptions) => {
    switch (status) {
      case "info":
        toast.info(description, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          ...options,
        });
        break;
      case "success":
        toast.success(description, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          ...options,
        });
        break;
      case "warning":
        toast.warning(description, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          ...options,
        });
        break;
      case "error":
        toast.error(description, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          ...options,
        });
        break;
      default:
        throw new Error(`Unsupported status type: ${status}`);
    }
  };
}
