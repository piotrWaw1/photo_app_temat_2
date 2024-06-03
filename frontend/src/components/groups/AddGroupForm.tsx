import {Button, Form, Modal} from "react-bootstrap";
import {FC} from "react";
import * as yup from "yup";
import {Formik} from "formik";


interface AddGroupFormProps {
  show: boolean;
  handleClose: () => void;
}

const AddGroupForm: FC<AddGroupFormProps> = (props) => {

  const {show, handleClose} = props

  const schema = yup.object().shape({
    groupName: yup.string().required('Group name is required')
  });

  return (
      <Modal show={show} onHide={handleClose} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Add Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
              validationSchema={schema}
              onSubmit={console.log}
              initialValues={{
                groupName: ''
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
                        name="groupName"
                        placeholder="SuperPhotoGroup"
                        autoFocus
                        value={values.groupName}
                        onChange={handleChange}
                        isInvalid={touched.groupName && !!errors.groupName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.groupName}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <div className="d-flex justify-content-end gap-2">
                    <Button variant="secondary" onClick={handleClose}>
                      Close
                    </Button>
                    <Button type="submit">Save changes</Button>
                  </div>
                </Form>
            )}

          </Formik>
        </Modal.Body>
      </Modal>
  )
}

export default AddGroupForm