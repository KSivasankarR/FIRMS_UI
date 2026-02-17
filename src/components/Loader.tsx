import React from "react"
import { useAppSelector } from "@/redux/hooks"
import Image from "next/image"
import styles from "@/styles/components/Loader.module.scss"

const Loader = () => {
  const Loading = useAppSelector((state) => state.common.Loading)

  return (
    <>
      {Loading.enable ? (
        <div className={styles.container}>
          <div className={styles.loader}>
            <Image
              alt=""
              width={50}
              height={50}
              className={styles.image}
              src="/firmsHome/assets/Loader.svg"
            ></Image>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </>
  )
}

export default Loader
