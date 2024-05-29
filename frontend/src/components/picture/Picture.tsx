import usePicture from "../../hooks/usePicture.tsx";
import {Col, Form, Image, Row} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Spinner from 'react-bootstrap/Spinner';
import axios from "axios";
import {useSessionContext} from "../../hooks/useSessionContext.tsx";

export default function Picture() {

  const {picData, anData, anLoading, annotateImage} = usePicture()



  const {tokens} = useSessionContext()

  const saveAnnotations = async (id: number, anData: string[]) => {
    try {
    
      const response = await axios.post(`/annotations/photo/${id}/annotate`,
       { anData },
       {
        headers: {
          'Content-Type': 'application/json',
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

  const deleteAnnotation = async (photoId: number, annotationId: number) => {
    try {
    
      const response = await axios.delete(`/annotations/photo/delete_annotation/${photoId}/${annotationId}`,
       {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + String(tokens?.access),
        }
      })
      console.log('Annotation deleted successfully');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error)
      }
    }
  }

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
        <button onClick={() => {saveAnnotations(picData?.id, anData)}}>Save annotation</button>
        <button onClick={() => {deleteAnnotation(7, 6)}}>Delete annotation</button>
      </Row>
  )
}