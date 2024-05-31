import usePicture from "../../hooks/usePicture.tsx";
import {Col, Form, Image, Row, Table} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Spinner from 'react-bootstrap/Spinner';
import axios from "axios";
import {useSessionContext} from "../../hooks/useSessionContext.tsx";
import * as yup from "yup";
import {ErrorMessage, Formik, FormikValues} from "formik";
import {useParams} from "react-router-dom";
import {useToaster} from "../../hooks/useToaster.tsx";
import {format} from "date-fns";


export default function Picture() {

  const {picData, anData, anLoading, annotateImage, getData, picLoading} = usePicture()
  const {tokens} = useSessionContext()
  const {show} = useToaster()
  const {id} = useParams()

  const deleteAnnotation = async (annotationId: number) => {
    try {

      await axios.delete(`/annotations/photo/delete_annotation/${id}/${annotationId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + String(tokens?.access),
            }
          })
      show({title: "Success", description: "Annotation deleted successfully", bg: "success"})
      getData().then()
      console.log('Annotation deleted successfully');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error)
      }
    }
  }

  const sendAnotations = async (formData: FormikValues) => {
    try {
      let toSend = []
      if (formData.anotations) {
        toSend = [...formData.anotations]
      } else {
        toSend.push(formData.anotation)
      }
      console.log(toSend)
      await axios.post(`/annotations/photo/${id}/annotate`,
          {anData: [...toSend]},
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + String(tokens?.access),
            }
          })
      show({title: "Success", description: "Annotation added successfully", bg: "success"})
      getData().then()
    } catch (error) {
      if (axios.isAxiosError(error)) {
        show({title: "Error", description: error.response?.data[0], bg: "danger"})
        console.log(error)
      }
    }
  }


  const schema = yup.object({
    anotations: yup.array().min(1, "Select at least one anotation")
  })

  const schema2 = yup.object({
    anotation: yup.string().min(1, "Annotation is too short")
  })

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
              {anLoading && <Spinner size="sm" animation="border" className="me-2"/>}
              Anotate
            </Button>
            <Formik
                initialValues={{anotations: []}}
                validationSchema={schema}
                onSubmit={sendAnotations}
            >
              {({handleChange, handleSubmit, touched, errors}) => (
                  <Form onSubmit={handleSubmit}>
                    {anData.length !== 0 && anData.map((item, id) => (
                        <Form.Group className="mb-3" id="formGridCheckbox" key={id}>
                          <Form
                              onChange={handleChange}
                              type="checkbox"
                              as={Form.Check}
                              name="anotations"
                              value={item}
                              label={`${item}`}
                              isInvalid={touched.anotations && !!errors.anotations}
                          />
                        </Form.Group>
                    ))}
                    <ErrorMessage name="anotations" component="div"/>
                    {anData.length !== 0 &&
                        <Button type="submit">Save</Button>
                    }
                    {anData.length === 0 && "No anotation"}
                  </Form>
              )}

            </Formik>
          </div>
          <h3 className="mt-4">Available annotations</h3>
          <Table>
            <thead>
            <tr>
              <th>Annotation</th>
              <th>Creator</th>
              <th>Date</th>
              <th></th>
            </tr>
            </thead>
            <tbody>
            {picData?.annotations.map(an => (
                <tr key={an.id}>
                  <td>{an.text}</td>
                  <td>{an.user}</td>
                  <td>{format(new Date(an.created_at), "yyyy-MM-dd")}</td>
                  <td>
                    <Button onClick={() => deleteAnnotation(an.id)}>Delete</Button>
                  </td>
                </tr>
            ))}
            {picData?.annotations.length === 0 && !picLoading &&
                <tr>
                    <td colSpan={4} className="text-center">No annotation found</td>
                </tr>
            }
            {picLoading &&
                <tr>
                    <td colSpan={4} className="text-center">
                        Loading
                        <Spinner size="sm" animation="border" className="me-2"/>
                    </td>
                </tr>
            }
            </tbody>
          </Table>
          <Formik
              validationSchema={schema2}
              onSubmit={sendAnotations}
              initialValues={{
                anotation: ''
              }}
          >
            {({handleSubmit, handleChange, values, touched, errors}) => (
                <Form
                    noValidate
                    onSubmit={handleSubmit}
                >
                  <Form.Group controlId="validationCustom01">
                    <Form.Label>Add annotation</Form.Label>
                    <Form.Control
                        type="text"
                        name="anotation"
                        value={values.anotation}
                        onChange={handleChange}
                        isInvalid={touched.anotation && !!errors.anotation}
                        placeholder="Anotation"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.anotation}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Button className="mt-2" type="submit">Add</Button>
                </Form>
            )}
          </Formik>

        </Col>
      </Row>
  )
}