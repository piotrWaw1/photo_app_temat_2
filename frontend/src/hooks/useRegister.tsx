import axios from "axios";
import {FormikValues} from "formik";
import {useNavigate} from "react-router-dom";
import {useToaster} from "./useToaster.tsx";
import {useState} from "react";

export default function useRegister() {
  const nav = useNavigate()
  const {show} = useToaster()
  const [loading, setLoading] = useState(false)
  const register = async (data: FormikValues) => {
    try {
      setLoading(true)
      await axios.post('auth/register', data);
      nav('/')
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const {response} = error
        const username = response?.data.username ? response.data.username[0] : undefined
        const email = response?.data.email ? response.data.email[0] : undefined
        show({title: "Error", description: username || email || "Unknow error", bg: "danger"})
      }
    }finally {
      setLoading(false)
    }
  }

  return {register, loading}
}