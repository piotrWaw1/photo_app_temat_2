import {Button, Modal} from "react-bootstrap";
import {FC} from "react";
import axios from "axios";
import {useSessionContext} from "../../../hooks/useSessionContext.tsx";
import {useToaster} from "../../../hooks/useToaster.tsx";

interface GroupDeleteModalProps {
  showModal: boolean;
  groupTitle: string;
  groupId: number;
  handleClose: () => void;
  update: () => void;
}

const GroupDeleteModal: FC<GroupDeleteModalProps> = (props) => {
  const {showModal, groupTitle, handleClose, groupId, update} = props
  const {tokens} = useSessionContext()
  const {show} = useToaster()

  const deleteGroup = async () => {
    try {
      await axios.delete(`/annotations/groups/${groupId}/delete`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + String(tokens?.access),
            }
          })
      show({title: "Success", description: "Group deleted.", bg: "success"})
      handleClose()
      update()
    } catch (error) {
      if (axios.isAxiosError(error)) {
        show({title: "Error", description: error.response?.data, bg: "danger"})
        console.log(error)
      }
    }
  }

  return (
      <Modal show={showModal} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you want to delete group <b>{groupTitle}</b>?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={deleteGroup}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
  )
}

export default GroupDeleteModal