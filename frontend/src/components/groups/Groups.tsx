import {Button, Container, Table} from "react-bootstrap";
import {useState} from "react";
import AddGroupForm from "./AddGroupForm.tsx";
import {useSessionContext} from "../../hooks/useSessionContext.tsx";
import axios from "axios";
import { set } from "date-fns";


export default function Groups() {

  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleOpen = () => setShow(true)

  const [groupData, setGroupData] = useState()


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


  const getGroups = async () => {
    try {

      const response = await axios.get(`/annotations/groups/list`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + String(tokens?.access),
            }
          })
      
      console.log(response);
      setGroupData(response.data)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error)
      }
    }
  }

  const updateGroup = async (groupId: number, groupData) => {
    try {
      const response = await axios.patch(`/annotations/groups/${groupId}/edit`, groupData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokens?.access}`,
        },
      });
      
      console.log(response);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error)
      }
    }
  }

  const addGroupMember = async (groupId: number, username) => {
    try {
      const response = await axios.post(`/annotations/groups/${groupId}/add_member`, username, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokens?.access}`,
        },
      });
      
      console.log(response);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error)
      }
    }
  }


  const deleteGroupMember = async (groupId: number, username) => {
    try {
      const response = await axios.delete(`/annotations/groups/${groupId}/delete_member`, {
            data: { username },
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + String(tokens?.access),
            },
          });
      
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


      {/* delete works only for owner -- veri gut */}
      <button onClick={() => deleteGroup(12)}>Delete</button>
      {/* getGroups works for owner and member */}
      <button onClick={() => getGroups()}>getGroups</button>
      
      <button onClick={() => deleteGroupMember(9, {'username':'qqqq'})}>deleteGroupMember</button>
      {/* updateGroup works for owner and member */} 
      <button onClick={() => updateGroup(9, {'name':"other name"})}>updateGroup</button>
      <button onClick={() => addGroupMember(9, {'username': 'qqqq'})}>addGroupMember</button>
      
      </>
  )
}