import * as yup from "yup";
import {Formik} from "formik";
import {Button, Col, Form} from "react-bootstrap";
import React from "react";
import useAddImg from "../../hooks/useAddImg.tsx";

const SUPORTED_FORMATS = ['jpg', 'jpeg', 'gif', 'bmp', 'png', 'svg', 'webp', 'jfif'];
const MAX_FILE_SIZE = 50000 * 1024; // 50000KB in bytes

export default function AddImage() {

  const {sendImg, loading} = useAddImg()

  const schema = yup.object().shape({
    title: yup.string().required('Title is required'),
    img_file: yup.mixed().required("Image file is requirde")
        .test("is-valid type", "Invalid type",
            (value) => {
              const file = value as FileList
              if (file.length) {
                const extension = file[0].name.split('.').pop()
                return !!extension && SUPORTED_FORMATS.includes(extension)
              }
            }
        )
        .test("is-valid size", "File is too big",
            (value) => {
              const file = value as FileList
              if (file.length) {
                return file[0].size <= MAX_FILE_SIZE
              }
            }
        )
  })

  return (
      <Formik
          validationSchema={schema}
          onSubmit={sendImg}
          initialValues={{
            title: '',
            img_file: ''
          }}
      >
        {({setFieldValue, handleSubmit, handleChange, values, touched, errors}) => (
            <Form
                noValidate
                onSubmit={handleSubmit}
                className='d-flex flex-column align-items-center justify-content-center'
            >
              <Form.Group as={Col} md="5" controlId="validationFormik01">
                <Form.Label>Title</Form.Label>
                <Form.Control
                    type="text"
                    name="title"
                    value={values.title}
                    onChange={handleChange}
                    isInvalid={touched.title && !!errors.title}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.title}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="5" controlId="validationFormik02" className="mt-2">
                <Form.Label>File</Form.Label>
                <Form.Control
                    type="file"
                    name="img_file"
                    accept="image/jpg, image/jpeg, image/gif, image/bmp, image/png, image/svg, image/webp, image/jfif"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      void setFieldValue("img_file", event.currentTarget.files)
                    }}
                    isInvalid={touched.img_file && !!errors.img_file}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.img_file}
                </Form.Control.Feedback>
              </Form.Group>
              <Button disabled={loading} type="submit" className='mt-3'>Submit</Button>
            </Form>
        )}
      </Formik>
  )
}