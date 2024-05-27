import {FormikValues} from "formik";
import axios from "axios";
import {useSessionContext} from "./useSessionContext.tsx";
import {useState} from "react";
import {useToaster} from "./useToaster.tsx";

export default function useAddImg() {
  const {tokens} = useSessionContext()
  const {show} = useToaster()

  const [loading, setLoading] = useState(false)
  const sendImg = async (value: FormikValues) => {
    try {
      setLoading(true)
      const dataToSend = {title: value.title, image: value.img_file[0]}
      const response = await axios.post(`/annotations/photos`, dataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + String(tokens?.access),
        }
      })
      show({title:"Success",description:`Img ${response.statusText}`,bg:"success"})
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error)
      }
    }finally {
      setLoading(false)
    }
  }
  return {sendImg, loading}
}