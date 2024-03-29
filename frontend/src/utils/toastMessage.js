import {toast} from 'react-toastify'

export function successToast (message){
    toast.success(message, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
      });
}


export function errorToast (message){
    toast.error(message, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
      });
}


export function infoToast (message){
  toast.info(message, {
      position: 'bottom-center',
      autoClose: 6000,
      hideProgressBar: true,
      closeOnClick: true,
    });
}
