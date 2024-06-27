import {Button, Col, Form, Row, Table} from "react-bootstrap";
import {Formik, FormikValues} from "formik";
import {FC, useCallback, useEffect, useState} from "react";
import * as yup from "yup";
import {useImage} from "../../../../hooks/useImage.tsx";
import axios from "axios";
import {useSessionContext} from "../../../../hooks/useSessionContext.tsx";
import {useParams} from "react-router-dom";
import {useToaster} from "../../../../hooks/useToaster.tsx";

interface GroupImages {
  id: number;
  owner: string;
  owner_id: number;
  title: string;
}

interface ManageImagesProps {
  owner: string;
}

const ManageImages: FC<ManageImagesProps> = ({owner}) => {
  const [loading, setLoading] = useState(false)
  const schema = yup.object().shape({
    image: yup.string().required('Image name is required')
  });
  const {getImg, imgData} = useImage()
  const {tokens, userName} = useSessionContext()
  const {id} = useParams()
  const {show} = useToaster()
  const [groupImages, setGroupImages] = useState<GroupImages[]>([])


  const getAllGroupPhotos = useCallback( async () => {
      try {
        setLoading(true)
        const {data} = await axios.get<GroupImages[]>(`/annotations/groups/${id}/get_all_photos`,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + String(tokens?.access),
              }
            })
        setGroupImages(data)
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log(error)
        }
      } finally {
        setLoading(false)
      }
    },[id, tokens?.access])


  const deletePhotoFromGroup = async (photoId: number) => {
    try {
      const response = await axios.delete(`/annotations/groups/${id}/remove_photo/${photoId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + String(tokens?.access),
        },
      });
      show({title: "Success", description: "Image deleted", bg: "success"})
      getAllGroupPhotos().then()
      console.log(response);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        show({title: "Error", description: `${error.response?.data}`, bg: "danger"})
        console.log(error)
      }
    }
  }

  const addPhotoToGroup = async (value: FormikValues) => {
    try {
      const toSend = {photo_id: value.image}
      await axios.post(`/annotations/groups/${id}/add_photo`, toSend, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokens?.access}`,
        },
      });
      show({title: "Success", description: "Image added", bg: "success"})
      getAllGroupPhotos().then()
    } catch (error) {

      if (axios.isAxiosError(error)) {
        const {response} = error
        show({title: "Error", description: response?.data.error, bg: "danger"})
        console.log(error)
      }
    }
  }
  



  useEffect(() => {
    getAllGroupPhotos().then()
    getImg().then()
  }, [getAllGroupPhotos, getImg, id, tokens?.access]);

  return (
      <>
        <h3 className="mt-3">Group images</h3>
        <Row className="mt-2">
          <Col md={6} xs={12}>
            <Table striped bordered hover>
              <thead>
              <tr>
                <th>Image title</th>
                <th>Owner</th>
                <th></th>
              </tr>
              </thead>
              <tbody>
              {groupImages.map(image => (
                  <tr key={`groupImage-${image.id}`} className="text-center">
                    <td>{image.title}</td>
                    <td>{image.owner}</td>
                    <td>
                      {(userName === image.owner || userName === owner) &&
                          <Button onClick={() => {
                            deletePhotoFromGroup(image.id).then()
                          }} variant="danger">Delete</Button>
                      }
                    </td>
                  </tr>
              ))}
              {groupImages.length === 0 &&
                  <tr className="text-center">
                      <td colSpan={3}>No images</td>
                  </tr>
              }
              </tbody>
            </Table>
          </Col>
          <Col md={6} xs={12}>
            <Formik
                validationSchema={schema}
                onSubmit={addPhotoToGroup}
                initialValues={{
                  image: ''
                }}
            >
              {({handleSubmit, handleChange, errors, touched}) => (
                  <Form
                      noValidate
                      onSubmit={handleSubmit}
                  >
                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                      <Form.Label>Add image</Form.Label>
                      <Form.Select
                          name="image"
                          autoFocus
                          onChange={handleChange}
                          isInvalid={touched.image && !!errors.image}
                      >
                        <option value=''>Select an image</option>
                        {imgData?.map(image => {
                              if (image.owner === userName) {
                                return (
                                    <option key={image.id} value={image.id}>{image.title}</option>
                                )
                              }
                            }
                        )}
                      </Form.Select>
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

export default ManageImages