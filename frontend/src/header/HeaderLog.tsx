import {Container, Nav, Navbar} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";
import {useSessionContext} from "../hooks/useSessionContext.tsx";

export default function HeaderLog(){
  const {removeToken} = useSessionContext()
  return(
      <Navbar expand="lg" className="bg-body-tertiary mb-5">
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand href="#home">PŚK Hackathon</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav"/>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <LinkContainer to="/">
                <Nav.Link>Home</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/images">
                <Nav.Link>LIST_ALL_IMAGES</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/edit">
                <Nav.Link>Something 2</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/annotation">
                <Nav.Link>Annotation</Nav.Link>
              </LinkContainer>
            </Nav>
              <Nav.Link onClick={removeToken}>Log out</Nav.Link>
          </Navbar.Collapse>
        </Container>
      </Navbar>
  )
}