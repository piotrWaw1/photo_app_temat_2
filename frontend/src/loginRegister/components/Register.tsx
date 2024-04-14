import {Button, Col, Form} from "react-bootstrap";
import {Formik} from "formik";
import * as yup from "yup";

export default function Register() {

  const schema = yup.object().shape({
    username: yup.string().min(4).required('User name is required'),
    email: yup.string().email('This is not an email').required('E-mail is required'),
    password: yup.string().min(8).required('Password is required'),
    repeat_password: yup.string().required('Password is required')
        .oneOf([yup.ref('password')], 'Passwords must match'),
  });

  return (
      <Formik
          validationSchema={schema}
          onSubmit={console.log}
          initialValues={{
            username: '',
            email: '',
            password: '',
            repeat_password: ''
          }}
      >
        {({handleSubmit, handleChange, values, touched, errors}) => (
            <Form
                noValidate
                onSubmit={handleSubmit}
                className='d-flex flex-column align-items-center justify-content-center'
            >
              <Form.Group as={Col} md="5" controlId="validationFormik01">
                <Form.Label>User name</Form.Label>
                <Form.Control
                    type="text"
                    name="username"
                    value={values.username}
                    onChange={handleChange}
                    isInvalid={touched.username && !!errors.username}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.username}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="5" controlId="validationFormik02" className="mt-2">
                <Form.Label>E-mail</Form.Label>
                <Form.Control
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    isInvalid={touched.email && !!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="5" controlId="validationFormik03" className="mt-2">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    autoComplete="no"
                    type="password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    isInvalid={touched.password && !!errors.password}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="5" controlId="validationFormik04" className="mt-2">
                <Form.Label>Repeat password</Form.Label>
                <Form.Control
                    autoComplete="no"
                    type="password"
                    name="repeat_password"
                    value={values.repeat_password}
                    onChange={handleChange}
                    isInvalid={touched.repeat_password && !!errors.repeat_password}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.repeat_password}
                </Form.Control.Feedback>
              </Form.Group>
              <Button type="submit" className='mt-3'>Sing Up</Button>
            </Form>
        )}
      </Formik>
  )
}