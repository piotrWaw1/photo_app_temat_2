import usePicture from "../../hooks/usePicture.tsx";
import {Col, Form, Image, Row} from "react-bootstrap";
import Button from "react-bootstrap/Button";

export default function Picture() {

  const {picData, anData, picLoading, anLoading, annotateImage} = usePicture()
  return (
      <Row>
        <Col>
          <h2>{picData?.title}</h2>
          <Image src={`http://127.0.0.1:8000/${picData?.image}`} width={800} rounded/>
        </Col>
        <Col>
          <h2>Annotations</h2>
          <h3>AI annotations</h3>
          <div>
            <Button disabled={anLoading} onClick={annotateImage} className="mb-3">Anotate</Button>
            <div>
              {anData.length !== 0 && anData.map((item,id) => (
                  <Form.Group className="mb-3" id="formGridCheckbox" key={id}>
                    <Form.Check type="checkbox" label={`${item}`}/>
                  </Form.Group>
              ))}
              {anData.length === 0 && "No anotation"}
            </div>
          </div>
          <h3>Manual annotations</h3>
        </Col>
      </Row>
  )
}