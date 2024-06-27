import {Container, Nav, Navbar} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";
import {useSessionContext} from "../../hooks/useSessionContext.tsx";

export default function HeaderLog(){
  const {removeToken, userName} = useSessionContext()
  return(
      <Navbar expand="lg" className="bg-body-tertiary mb-5">
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand href="#home">Photo App</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav"/>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <LinkContainer to="/">
                <Nav.Link>Home</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/addimage">
                <Nav.Link>Add Image</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/groups">
                <Nav.Link>Groups</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/images">
                <Nav.Link>LIST_ALL_IMAGES</Nav.Link>
              </LinkContainer>
            </Nav>
              <Nav.Link className="fw-bold text-primary" onClick={removeToken}>Log out</Nav.Link>
            <span className="ms-3">User: <b>{userName}</b></span>
          </Navbar.Collapse>
        </Container>
      </Navbar>
  )
}