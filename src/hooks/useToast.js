import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const useToast = () => {

    const options = {
        position: "top-center"
    }

    const successToast = (message) => {
        toast.success(message, options)
    }

    const errorToast = (message) => {
        toast.error(message, options)
    }

    return {
        successToast,
        errorToast
    }
}

export { useToast };