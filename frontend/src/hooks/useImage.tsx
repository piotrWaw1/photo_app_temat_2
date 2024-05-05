import {useCallback, useState} from "react";
import axios from "axios";
import {useSessionContext} from "./useSessionContext.tsx";

interface ImgGet {
  id: number;
  image: string;
  owner: string;
  owner_id: string;
  title: string;
  uploaded_on: string;
}

export const useImage = () => {
  const [imgLoading, setImgLoading] = useState(false)
  const [imgData, setImgData] = useState<ImgGet[]>()
  const {tokens} = useSessionContext()

  const getImg = useCallback(async () => {
    try {
      setImgLoading(true)
      const {data} = await axios.get<ImgGet[]>('/annotations/photos', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + String(tokens?.access),
        },
      })
      setImgData(data)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error)
      }
    } finally {
      setImgLoading(false)
    }
  }, [tokens?.access])

  const deleteImage = () => {
    try {
      setImgLoading(true)

    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error)
      }
    } finally {
      setImgLoading(false)
    }
  }

  return {getImg, deleteImage, imgLoading, imgData}
}