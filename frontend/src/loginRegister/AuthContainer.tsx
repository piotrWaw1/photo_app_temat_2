import HeaderNoLog from "../components/header/HeaderNoLog.tsx";
import {Outlet} from "react-router-dom";
import {Container} from "react-bootstrap";

export default function AuthContainer() {
  return (
      <>
        <HeaderNoLog/>
        <Container className="mt-5">
          <Outlet/>
        </Container>
      </>
  )
}