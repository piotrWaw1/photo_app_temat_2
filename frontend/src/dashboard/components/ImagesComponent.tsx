import {FC} from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import {format} from "date-fns";
import {Col} from "react-bootstrap";
import axios from "axios";
import {useSessionContext} from "../../hooks/useSessionContext.tsx";
import {Link} from "react-router-dom";

interface ImgData {
  id: number;
  image: string;
  owner: string;
  owner_id: string;
  title: string;
  uploaded_on: string;
}

interface ImagesComponentProps {
  data: ImgData[];
}

const ImagesComponent: FC<ImagesComponentProps> = ({data}) => {
  const {tokens} = useSessionContext()
  const formatDate = (value: string) => {
    return format(new Date(value), "yyyy-MM-dd HH:mm")
  }

  const imgDelete = async (id: number) => {
    try {
      const response = await axios.delete(`/annotations/photos/${id}`, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + String(tokens?.access),
        }
      })
      console.log(response.data)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error)
      }
    }
  }

  // const annotateImage = async (id: number) => {
  //   try {
  //     const response = await axios.get(`/annotations/photos_edit/${id}`, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //         Authorization: 'Bearer ' + String(tokens?.access),
  //       }
  //     })
  //     console.log(response.data)
  //   } catch (error) {
  //     if (axios.isAxiosError(error)) {
  //       console.log(error)
  //     }
  //   }
  // }


  return (
      data.map((img) => (
          <Col key={img.id} xs={12} md={6} lg={4} xxl={3} className="mb-3">
            <Card className="card-width">
              <Card.Img variant="top" src={`http://localhost:8000/${img.image}`} className="img-size"/>
              <Card.Body>
                <Card.Title>{img.title}</Card.Title>
                <Card.Text>
                  No annotation found
                </Card.Text>
                <Button variant="primary" onClick={() => {
                  imgDelete(img.id).then()
                }}>
                  Delete
                </Button>
                <Link to={`${img.id}`}>
                  <Button variant="primary" className="mx-2">Info</Button>
                </Link>

              </Card.Body>
              <p className="ps-3">Created: {formatDate(img.uploaded_on)}</p>
            </Card>
          </Col>
      ))
  )
}

export default ImagesComponent