import {Button, Modal} from "react-bootstrap";
import {FC} from "react";

interface ModalDeleteProps {
  show: boolean;
  pictureTitle: string
  handleClose: () => void;
  handleDelete: () => void;
}

const ModalDelete: FC<ModalDeleteProps> = (props) => {
  const {show, handleClose, handleDelete, pictureTitle} = props

  return (
      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you want to delete picture <b>{pictureTitle}</b>?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
  )
}

export default ModalDelete