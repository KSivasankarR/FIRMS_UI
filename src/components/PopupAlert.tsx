import React, { useEffect } from "react"
import styles from "@/styles/components/PopupAlert.module.scss"
import { useAppSelector, useAppDispatch } from "@/redux/hooks"
import { PopupAction } from "@/redux/commonSlice"
import { useRouter } from "next/router"
import { Loading } from "@/GenericFunctions"

const PopupAlert = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const PopupMemory = useAppSelector((state) => state.common.PopupMemory)

  const OnCancelAction = () => {
    if (PopupMemory.redirectOnSuccess && PopupMemory.redirectOnSuccess != "") {
      router.push(PopupMemory.redirectOnSuccess)
    }
    Loading(false)
    dispatch(PopupAction({ ...PopupMemory, enable: false, redirectOnSuccess: "", message: "" }))
  }

  useEffect(() => {
    if (PopupMemory.enable) {
      setTimeout(() => {
        if (PopupMemory.redirectOnSuccess && PopupMemory.redirectOnSuccess != "") {
          if (PopupMemory.redirectOnSuccess === "/") {
            localStorage.clear()
            setTimeout(() => {
              router.push("/")
            }, 0)
          } else {
            router.push(PopupMemory.redirectOnSuccess)
          }
        }
        dispatch(PopupAction({ ...PopupMemory, enable: false }))
      }, 2500)
    }
  }, [PopupMemory.enable])

  return (
    <div>
      {PopupMemory.enable && (
        <div className={styles.container}>
          <div className={styles.Messagebox}>
            <div className={styles.header}>
              <div className={`d-flex justify-content-between ${styles.letHeader}`}>
                <text className={styles.text}>Message</text>
                <div onClick={OnCancelAction} className={styles.closeAction}>
                  <img alt="" className={styles.sImage} src="/firmsHome/assets/popup-close.svg" />
                </div>
              </div>
            </div>
            <div className={styles.popupBox}>
              {PopupMemory.type ? (
                <div className={styles.SuccessImg}>
                  <img alt="" className={styles.sImage} src="/firmsHome/assets/success-icon.png" />
                </div>
              ) : (
                <img alt="" className={styles.errorImg} src="/firmsHome/assets/popup-error.png" />
              )}
              <text className={styles.message}>{PopupMemory.message}</text>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PopupAlert
