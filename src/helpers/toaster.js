import { toast } from "react-toastify";

const options = {
    position: "bottom-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  }
export const dispError = (err)=>{
    if(err && err.response && err.response.data && err.response.data.msg)
        toast.error(err.response.data.msg, options);
}
export const dispSuccess = (msg)=>{
    toast.success(msg, options)
}
