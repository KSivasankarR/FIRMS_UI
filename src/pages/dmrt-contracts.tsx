import Head from "next/head"
import { Container } from "react-bootstrap"

export default function OldPortal() {
  return (
    <>
      <Head>
        <title>DMRT Contracts</title>
        <link rel="icon" href="/firmsHome/igrsfavicon.ico" />
      </Head>
      <main className="main-wrap">
        <Container>
          <div>DMRT Contracts</div>
        </Container>
      </main>
    </>
  )
}
