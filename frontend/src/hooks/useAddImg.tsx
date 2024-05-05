import {FormikValues} from "formik";
import axios from "axios";
import {useSessionContext} from "./useSessionContext.tsx";

export default function useAddImg() {
  const {tokens} = useSessionContext()
  const sendImg = async (value: FormikValues) => {
    try {
      const dataToSend = {title: value.title, image: value.img_file[0]}

      const response = await axios.post(`/annotations/photos`, dataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + String(tokens?.access),
        }
      })
      console.log(response)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error)
      }
    }
  }

  return {sendImg}
}