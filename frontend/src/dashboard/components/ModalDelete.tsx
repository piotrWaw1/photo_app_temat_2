import {Button, Modal} from "react-bootstrap";
import {FC} from "react";
import axios from "axios";
import {useSessionContext} from "../../hooks/useSessionContext.tsx";
import {useToaster} from "../../hooks/useToaster.tsx";

interface ModalDeleteProps {
  showModal: boolean;
  pictureTitle: string
  handleClose: () => void;
  id: number;
}

const ModalDelete: FC<ModalDeleteProps> = (props) => {
  const {showModal, handleClose, id, pictureTitle} = props
  const {tokens} = useSessionContext()
  const {show} = useToaster()
  const imgDelete = async () => {
    try {
      const response = await axios.delete(`/annotations/photos/${id}`, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + String(tokens?.access),
        }
      })
      show({title:"Success", description:`Image deleted`, bg:"success"})
      console.log(response.data)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const {response} = error
        show({title:"Error", description:`${response?.data.detail}`, bg:"danger"})
        console.log(error)
      }
    } finally {
      handleClose()
    }
  }

  return (
      <Modal show={showModal} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you want to delete picture <b>{pictureTitle}</b>?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={imgDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
  )
}

export default ModalDelete