import Head from "next/head"
import { Container } from "react-bootstrap"

export default function OldPortal() {
  return (
    <>
      <Head>
        <title>Old Portal</title>
        <link rel="icon" href="/firmsHome/igrsfavicon.ico" />
      </Head>
      <main className="main-wrap">
        <Container>
          <div>Old Portal</div>
        </Container>
      </main>
    </>
  )
}
