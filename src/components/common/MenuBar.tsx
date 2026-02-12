import Container from "react-bootstrap/Container"
import Nav from "react-bootstrap/Nav"
import Navbar from "react-bootstrap/Navbar"
import { routes } from "@/router/routes"
import Link from "next/link"

export default function MenuBar() {
  return (
    <>
      <img
        alt=""
        src="/firmsHome/assets/logo_new.jpg"
        style={{ margin: "5px" }}
        className="d-inline-block align-top"
      />
      <Navbar collapseOnSelect variant="dark" style={{ backgroundColor: "#396018" }}>
        <Container fluid="sm" style={{ marginLeft: 0, marginRight: 0 }}>
          <Navbar.Brand href="/firmsHome/home" style={{ fontSize: "25px", fontWeight: "bold" }}>
            FASP
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto">
              {routes.map((route) => {
                return (
                  <Link href={route.path} key={route.name}>
                    <li className="nav-item" style={{ cursor: "pointer" }}>
                      <a className="nav-link">{route.name}</a>
                    </li>
                  </Link>
                )
              })}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  )
}
