import axios from "axios";
import {FormikValues} from "formik";
import {useSessionContext} from "./useSessionContext.tsx";
import {useToaster} from "./useToaster.tsx";

export default function useLogin() {
  const {saveToken} = useSessionContext()
  const {show} = useToaster()
  const setSession = async (formData: FormikValues) => {
    try {
      const {data} = await axios.post('auth/token', formData)
      saveToken(data)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data.detail
        show({title: "Error", description: data || 'Unknow error', bg: "danger"})
      }
    }
  }

  return {setSession}
}