import {Button, Container} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";
import {useSessionContext} from "../hooks/useSessionContext.tsx";
import HeaderLog from "../header/HeaderLog.tsx";
import HeaderNoLog from "../header/HeaderNoLog.tsx";

export default function Error() {
  const {userID} = useSessionContext()
  return (
      <>
        {userID ? <HeaderLog/> : <HeaderNoLog/>}
        <Container className="text-center">
          <h1>Oops!</h1>
          <h3>Page not avaible</h3>
          <LinkContainer to={'/'}>
            <Button>Go back</Button>
          </LinkContainer>
        </Container>
      </>
  )
}