import HeaderNoLog from "../header/HeaderNoLog.tsx";
import {Container} from "react-bootstrap";
import Register from "./components/Register.tsx";

export default function RegisterFormContainer() {
  return (
      <>
        <HeaderNoLog/>
        <Container className="mt-5">
          <Register/>
        </Container>

      </>
  )
}