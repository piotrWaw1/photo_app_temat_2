import {useImage} from "../hooks/useImage.tsx";
import {useEffect} from "react";
import ImagesComponent from "./components/ImagesComponent.tsx";
import {Container, Row} from "react-bootstrap";

export default function Home() {
  const {getImg, imgData} = useImage()
  // console.log(imgData)
  useEffect(() => {
    void getImg()
  }, [getImg])
  return (
      <>
        <h2>Your Images</h2>
        <Container fluid>
          <Row>
            {imgData && imgData.length !== 0 ? <ImagesComponent data={imgData}/> : "No img"}
          </Row>
        </Container>
      </>
  )
}