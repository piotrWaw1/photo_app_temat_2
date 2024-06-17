import {Button, Col, Form, Row, Table} from "react-bootstrap";
import {Formik, FormikValues} from "formik";
import * as yup from "yup";
import {FC} from "react";
import {useSessionContext} from "../../../hooks/useSessionContext.tsx";
import axios from "axios";
import {useParams} from "react-router-dom";

interface Member {
  username: string;
}

interface ManageGroupsProps {
  data: Member[];
  loading: boolean;
  update: () => void;
}

const ManageGroups: FC<ManageGroupsProps> = ({data, loading, update}) => {
  const {userName, tokens} = useSessionContext()
  const {id} = useParams()
  const schema = yup.object().shape({
    name: yup.string().required('Group name is required')
  });


  const addMember = async (data: FormikValues) => {
    try {
      await axios.post(`/annotations/groups/${id}/add_member`, {username: data.name},
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + String(tokens?.access),
            }
          }
      )
      update()
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error)
      }
    }
  }


  return (
      <>
        <h3 className="mt-3">Group members</h3>
        <Row className="mt-2">
          <Col md={6} xs={12}>
            <Table striped bordered hover>
              <thead>
              <tr>
                <th>Username</th>
                <th>Action</th>
              </tr>
              </thead>
              <tbody>
              {data.map((member, index) => {
                if (member.username === userName && data.length === 1) {
                  return (
                      <tr key={`group${index}`} className="text-center">
                        <td colSpan={2}>No members</td>
                      </tr>
                  )
                }
                if (member.username === userName) {
                  return
                }
                return (
                    <tr key={`group${index}`} className="text-center">
                      <td>{member.username}</td>
                      <td>
                        <Button variant="danger">Delete</Button>
                      </td>
                    </tr>
                )
              })}
              </tbody>
            </Table>
          </Col>
          <Col md={6} xs={12}>
            <Formik
                validationSchema={schema}
                onSubmit={addMember}
                initialValues={{
                  name: ''
                }}
            >
              {({handleSubmit, values, handleChange, errors, touched}) => (
                  <Form
                      noValidate
                      onSubmit={handleSubmit}
                  >
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                      <Form.Label>Add user</Form.Label>
                      <Form.Control
                          type="text"
                          name="name"
                          placeholder="username"
                          autoFocus
                          value={values.name}
                          onChange={handleChange}
                          isInvalid={touched.name && !!errors.name}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.name}
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

export default ManageGroups