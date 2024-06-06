import {Button, Container, Table} from "react-bootstrap";
import {useCallback, useEffect, useState} from "react";
import AddGroupForm from "./util/AddGroupForm.tsx";
import {useSessionContext} from "../../hooks/useSessionContext.tsx";
import axios from "axios";
import GroupDeleteModal from "./util/GroupDeleteModal.tsx";
import {Link} from "react-router-dom";

interface Members {
  username: string;
}

interface GroupData {
  id: number;
  name: string;
  owner: string;
  members: Members[];
}

export default function Groups() {

  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleOpen = () => setShow(true)

  const [groupData, setGroupData] = useState<GroupData[]>()


  const {tokens} = useSessionContext()

  const getGroups = useCallback(async () => {
    try {
      const response = await axios.get(`/annotations/groups/list`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + String(tokens?.access),
            }
          })
      setGroupData(response.data)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error)
      }
    }
  }, [])

  useEffect(() => {
    getGroups().then()
  }, [getGroups, tokens?.access]);


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

  const [selectedGroup, setSelectedGroup] = useState<Pick<GroupData, "id" | "name">>({name: '', id: 0})
  const [showDelete, setShowDelete] = useState(false)
  const handleOpenDelete = (data: GroupData) => {
    setShowDelete(true)
    setSelectedGroup({id: data.id, name: data.name})
  }
  const handleCloseDelete = () => setShowDelete(false)

  const deleteGroupMember = async (groupId: number, username) => {
    try {
      const response = await axios.delete(`/annotations/groups/${groupId}/delete_member`, {
        data: {username},
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
            {groupData?.map(group => (
                <tr key={group.id}>
                  <td>{group.name}</td>
                  <td>{group.owner}</td>
                  <td>
                    <Link to={`${group.id}`}>
                      <Button className="me-2">Edit</Button>
                    </Link>
                    <Button variant="danger" onClick={() => handleOpenDelete(group)}>Delete</Button>
                  </td>
                </tr>
            ))}
            </tbody>
          </Table>
        </Container>
        <AddGroupForm showModal={show} handleClose={handleClose} update={getGroups}/>
        <GroupDeleteModal
            showModal={showDelete}
            groupTitle={selectedGroup.name}
            groupId={selectedGroup.id}
            handleClose={handleCloseDelete}
            update={getGroups}
        />

        {/* delete works only for owner -- veri gut */}
        {/*<button onClick={() => deleteGroup(12)}>Delete</button>*/}

        <button onClick={() => deleteGroupMember(9, {'username': 'qqqq'})}>deleteGroupMember</button>
        {/* updateGroup works for owner and member */}
        <button onClick={() => updateGroup(9, {'name': "other name"})}>updateGroup</button>
        <button onClick={() => addGroupMember(9, {'username': 'qqqq'})}>addGroupMember</button>

      </>
  )
}