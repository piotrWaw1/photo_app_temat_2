import * as yup from "yup";
import {Formik} from "formik";
import {Button, Col, Form} from "react-bootstrap";
import useLogin from "../../hooks/useLogin.tsx";

export default function Login() {

  const {setSession} = useLogin()
  const schema = yup.object().shape({
    email: yup.string().email().required('E-mail is required'),
    password: yup.string().required('Password is required'),
  });

  return (
      <Formik
          validationSchema={schema}
          onSubmit={setSession}
          initialValues={{
            email: '',
            password: '',
          }}
      >
        {({handleSubmit, handleChange, values, touched, errors}) => (
            <Form
                noValidate
                onSubmit={handleSubmit}
                className='d-flex flex-column align-items-center justify-content-center'
            >
              <Form.Group as={Col} md="5" controlId="validationFormik01">
                <Form.Label>E-mail</Form.Label>
                <Form.Control
                    autoComplete="yes"
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
              <Form.Group as={Col} md="5" controlId="validationFormik02" className="mt-2">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    autoComplete="yes"
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
              <Button type="submit" className='mt-3'>Login</Button>
            </Form>
        )}
      </Formik>
  )
}