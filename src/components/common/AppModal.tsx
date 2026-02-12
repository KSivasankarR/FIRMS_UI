import React from "react"
import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"

export function AppModal(props: any) {
  const { handleClose, handleSave, show, title } = props
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{props.children}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
