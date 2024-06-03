import {Button, Container, Table} from "react-bootstrap";
import {useState} from "react";
import AddGroupForm from "./AddGroupForm.tsx";

export default function Groups() {

  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleOpen = () => setShow(true)

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
        <AddGroupForm show={show} handleClose={handleClose}/>
      </>
  )
}