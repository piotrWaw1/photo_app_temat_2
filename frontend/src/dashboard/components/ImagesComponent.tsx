import {FC} from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import {format} from "date-fns";
import {Col} from "react-bootstrap";

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
  const formatDate = (value: string) => {
    return format(new Date(value), "yyyy-MM-dd HH:mm")
  }
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
                <Button variant="primary">Go somewhere</Button>
              </Card.Body>
              <p className="ps-3">Created: {formatDate(img.uploaded_on)}</p>
            </Card>
          </Col>
      ))
  )
}

export default ImagesComponent