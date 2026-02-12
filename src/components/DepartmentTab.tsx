import router from 'next/router'

import React, { useEffect, useState } from 'react'

import styles from "@/styles/components/header.module.scss"

import { propTypes } from 'react-bootstrap/esm/Image'

interface Proptypes {

    active: number

}

const DepartmentTab = (Proptypes) => {



    const [activeTab, setActiveTab] = useState(0)

    useEffect(() => {

        setActiveTab(Proptypes.active)

    })

    return (
        <div>
            <>
                <div className={` ${styles.tabcontainer} mt-5 pt-3`}>
                    {
                        ['REPORTS', 'REGISTRATIONS'].map((o, i) => {
                            return (
                                <button key={o} className={i === activeTab ? styles.activeButton : styles.button} onClick={() => {
                                    if (i == 0) {
                                        router.push("/reports")
                                    } else if (i == 1) {
                                        router.push("/firms")
                                    }
                                    // else if (i == 2) {
                                    //     router.push("/")
                                    // }
                                    setActiveTab(i);
                                }}>{o}</button>
                            )
                        })
                    }
                </div>
            </>
        </div>
    )
}



export default DepartmentTab