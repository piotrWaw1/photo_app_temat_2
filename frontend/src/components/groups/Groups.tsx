import {Button, Container, Table} from "react-bootstrap";
import {useState} from "react";
import AddGroupForm from "./AddGroupForm.tsx";
import {useSessionContext} from "../../hooks/useSessionContext.tsx";
import axios from "axios";


export default function Groups() {

  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleOpen = () => setShow(true)


  const {tokens} = useSessionContext()

  const deleteGroup = async (groupId: number) => {
    try {

      const response = await axios.delete(`/annotations/groups/${groupId}/delete`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + String(tokens?.access),
            }
          })
      
      console.log(response);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error)
      }
    }
  }


  const getGroup = async () => {
    try {

      const response = await axios.get(`/annotations/groups/list`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + String(tokens?.access),
            }
          })
      
      console.log(response);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error)
      }
    }
  }

  return (
      <>
        <div className="d-flex justify-content-between">
          <h2>Your groups</h2>
          <Button variant="success" onClick={handleOpen}>Add</Button>
        </div>
        <Container fluid>
          <Table>
            <thead>
            <tr>
              <th>Name</th>
              <th>Owner</th>
              <th></th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>Grupa 1</td>
              <td>Owner</td>
              <td>
                <Button className="me-2">Edit</Button>
                <Button variant="danger">Delete</Button>
              </td>
            </tr>
            </tbody>
          </Table>
        </Container>
        <AddGroupForm showModal={show} handleClose={handleClose}/>



      <button onClick={() => deleteGroup(6)}>Delete</button>
      <button onClick={() => getGroup()}>getGroups</button>

      </>
  )
}