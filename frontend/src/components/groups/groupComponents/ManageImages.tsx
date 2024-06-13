import {Button, Col, Form, Row, Table} from "react-bootstrap";
import {Formik} from "formik";
import {useState} from "react";
import * as yup from "yup";

export default function ManageImages(){
  const [loading, setLoading] = useState(false)
  const schema = yup.object().shape({
    image: yup.string().required('Image name is required')
  });
return(
    <>
        <h3 className="mt-3">Group images</h3>
        <Row className="mt-2">
          <Col md={6} xs={12}>
            <Table striped bordered hover>
              <thead>
              <tr>
                <th>Image title</th>
                <th></th>
              </tr>
              </thead>
              <tbody>
              <tr className="text-center">
                <td>image 1</td>
                <td>
                  <Button variant="danger">Delete</Button>
                </td>
              </tr>
              </tbody>
            </Table>
          </Col>
          <Col md={6} xs={12}>
            <Formik
                validationSchema={schema}
                onSubmit={console.log}
                initialValues={{
                  image: ''
                }}
            >
              {({handleSubmit, values, handleChange, errors, touched}) => (
                  <Form
                      noValidate
                      onSubmit={handleSubmit}
                  >
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                      <Form.Label>Add image</Form.Label>
                      <Form.Control
                          type="text"
                          name="image"
                          placeholder="image title"
                          autoFocus
                          value={values.image}
                          onChange={handleChange}
                          isInvalid={touched.image && !!errors.image}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.image}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <div className="d-flex justify-content-end gap-2">
                      <Button type="submit" disabled={loading}>Add</Button>
                    </div>
                  </Form>
              )}
            </Formik>
          </Col>
        </Row>
      </>
)
}