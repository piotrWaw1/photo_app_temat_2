import HeaderNoLog from "../header/HeaderNoLog.tsx";
import Login from "./components/Login.tsx";
import {Container} from "react-bootstrap";

export default function LoginFormContainer() {

  return (
      <>
        <HeaderNoLog/>
        <Container className="mt-5">
          <Login/>
        </Container>
      </>

  )
}