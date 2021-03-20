import { ToastOptions, toast } from 'react-toastify';

export const toastOptions:ToastOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
}

export default {
  success: (val: any) => {
    toast.success(val, toastOptions)
  },
  warn: (val: any) => {
    toast.warn(val, toastOptions)
  },
  default: (val: any) => {
    toast(val, toastOptions)
  },
  error: (val: any) => {
    toast.error(val, toastOptions)
  },
  info: (val: any) => {
    toast.info(val, toastOptions)
  }
}