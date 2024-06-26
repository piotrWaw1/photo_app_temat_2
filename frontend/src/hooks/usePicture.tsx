import {useParams} from "react-router-dom";
import {useCallback, useEffect, useState} from "react";
import axios from "axios";
import {useSessionContext} from "./useSessionContext.tsx";
import {useToaster} from "./useToaster.tsx";

interface Annotations {
  created_at: string;
  id: number;
  text: string;
  user: string;
}

interface AIAnnotations{
  annotations:string[];
  image_url: string;
}

interface PicData {
  id: number;
  image: string;
  image_url: string | null;
  owner: string;
  owner_id: number;
  title: string;
  uploaded_on: string; // or Date if you prefer to work with Date objects
  annotations: Annotations[]
}

export default function usePicture() {
  const {id} = useParams()
  const {tokens} = useSessionContext()
  const [picData, setPicData] = useState<PicData | null>(null)
  const [picError, setPicError] = useState(false)
  const [anData, setAnData] = useState<AIAnnotations>()
  const [anLoading, setAnLoading] = useState(false)
  const [picLoading, setPicLoading] = useState(false)

  const {show} = useToaster()
  const getData = useCallback(async () => {
    try {
      setPicError(false)
      setPicLoading(true)
      const {data} = await axios.get(`annotations/photo/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + String(tokens?.access),
        },
      })
      setPicData(data)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          setPicError(true)
        }
        console.log(error)
      }
    } finally {
      setPicLoading(false)
    }

  }, [id, tokens?.access])

  useEffect(() => {
    getData().then()
  }, [getData]);

  const annotateImage = async () => {
    try {
      setAnLoading(true)
      const {data} = await axios.get<AIAnnotations>(`/annotations/photos_edit/${id}`, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + String(tokens?.access),
        }
      })
      console.log(data)
      setAnData(data)
      if (data.annotations.length) {
        show({title: "Success", description: "Annotation found!", bg: "success"})
      } else {
        show({title: "Error", description: "Annotation not found!", bg: "danger"})
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error)
      }
    } finally {
      setAnLoading(false)
    }
  }

  return {annotateImage, getData, picData, picLoading, anData, anLoading, picError}
}