import {Button, Form, Modal} from "react-bootstrap";
import {FC, useState} from "react";
import * as yup from "yup";
import {Formik, FormikValues} from "formik";
import axios from "axios";
import {useSessionContext} from "../../hooks/useSessionContext.tsx";
import {useToaster} from "../../hooks/useToaster.tsx";


interface AddGroupFormProps {
  showModal: boolean;
  handleClose: () => void;
}

const AddGroupForm: FC<AddGroupFormProps> = (props) => {
  const {showModal, handleClose} = props
  const {tokens} = useSessionContext()
  const {show} = useToaster()

  const schema = yup.object().shape({
    name: yup.string().required('Group name is required')
  });

  const [loading, setLoading] = useState(false)
  const handleSend = async (data: FormikValues) => {
    try {
      setLoading(true)
      const response = await axios.post('annotations/groups', {name: data.name}, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + String(tokens?.access),
        }
      })
      console.log(response)
      show({title: "Success", description: `Group created successfully!`, bg: "success"})
    } catch (error) {
      if (axios.isAxiosError(error)) {
        show({title: "Error", description: `Error`, bg: "danger"})
        console.log(error)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
      <Modal show={showModal} onHide={handleClose} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Add Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
              validationSchema={schema}
              onSubmit={handleSend}
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
                    <Form.Label>Group name</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        placeholder="SuperPhotoGroup"
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
                    <Button variant="secondary" onClick={handleClose} disabled={loading}>
                      Close
                    </Button>
                    <Button type="submit" disabled={loading}>Save changes</Button>
                  </div>
                </Form>
            )}

          </Formik>
        </Modal.Body>
      </Modal>
  )
}

export default AddGroupForm