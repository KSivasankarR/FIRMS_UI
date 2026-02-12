import Modal from "react-bootstrap/Modal"
import styles from "@/styles/components/AadharPopup.module.scss"
import Image from "next/image"
import { useAppSelector, useAppDispatch } from "@/redux/hooks"
import { DeletePopupAction } from "@/redux/commonSlice"

function DeletePopup() {
  const dispatch = useAppDispatch()
  const DeletePopupMemory = useAppSelector((state) => state.common.DeletePopupMemory)

  const OnClicAction = (isProceed: any) => {
    if (isProceed) {
      dispatch(
        DeletePopupAction({
          ...DeletePopupMemory,
          enable: false,
          response: true,
          inProcess: true,
          message: "",
          redirectOnSuccess: "",
        })
      )
    } else {
      dispatch(
        DeletePopupAction({
          ...DeletePopupMemory,
          enable: false,
          response: false,
          message: "",
          redirectOnSuccess: "",
          deleteId: "",
          applicationId: "",
        })
      )
    }
  }

  return (
    <div className="home-main-sec">
      {DeletePopupMemory.enable && (
        <div className={styles.container}>
          <Modal.Dialog className={styles.modaldialog}>
            {/* <div className={styles.modalHeaderInfo}>
            <Row className={styles.Modalheader}>
              <Col lg={10}>
                <Modal.Title className={styles.ModalTitle}>Delete</Modal.Title>
              </Col>
            </Row>
          </div> */}
            <Modal.Body className={styles.succesxsodalbody}>
              <div>
                <Image alt="Image" height={100} width={100} src="/images/trash-bin-img.png" />
              </div>
              <div>
                <text className={styles.AdharText}>{DeletePopupMemory.message}</text>
              </div>
              <div>
                <button
                  onClick={() => OnClicAction(false)}
                  className="proceedButton"
                  style={{ marginRight: "1rem" }}
                >
                  Cancel
                </button>
                <button onClick={() => OnClicAction(true)} className="proceedButton">
                  Delete
                </button>
              </div>
            </Modal.Body>
          </Modal.Dialog>
        </div>
      )}
    </div>
  )
}

export default DeletePopup
