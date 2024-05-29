import usePicture from "../../hooks/usePicture.tsx";
import {Col, Form, Image, Row} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Spinner from 'react-bootstrap/Spinner';

export default function Picture() {

  const {picData, anData, anLoading, annotateImage} = usePicture()
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
            <Button disabled={anLoading} onClick={annotateImage} className="mb-3">
              {anLoading && <Spinner size="sm" animation="border"  className="me-2"/>}
              Anotate
            </Button>
            <div>
              {anData.length !== 0 && anData.map((item,id) => (
                  <Form.Group className="mb-3" id="formGridCheckbox" key={id}>
                    <Form.Check type="checkbox" label={`${item}`} value={item}/>
                  </Form.Group>
              ))}
              {anData.length === 0 && "No anotation"}
            </div>
          </div>
          <h3 className="mt-4">Available annotations</h3>
          <div>
            <div>
              Annotation 1
              <Button className="ms-3 mb-2">Delete</Button>
            </div>
            <div>
              Annotation 2
              <Button className="ms-3">Delete</Button>
            </div>
          </div>
          <Form.Group controlId="validationCustom01">
            <Form.Label>Add annotation</Form.Label>
            <Form.Control
            required
            type="text"
            placeholder="Anotation"
          />
        </Form.Group>
        </Col>
      </Row>
  )
}