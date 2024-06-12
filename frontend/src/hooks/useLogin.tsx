import axios from "axios";
import {FormikValues} from "formik";
import {useSessionContext} from "./useSessionContext.tsx";
import {useToaster} from "./useToaster.tsx";
import {useState} from "react";

export default function useLogin() {
  const {saveToken} = useSessionContext()
  const {show} = useToaster()
  const [loading, setLoading] = useState(false)
  const setSession = async (formData: FormikValues) => {
    try {
      setLoading(true)
      const {data} = await axios.post('auth/token', formData)
      saveToken(data)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data.detail
        show({title: "Error", description: data || 'Unknow error', bg: "danger"})
      }
    }finally {
      setLoading(false)
    }
  }

  return {setSession, loading}
}