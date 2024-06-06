import {Button, Container} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";

export default function Error() {
  return (
      <>
        <Container className="text-center">
          <h1>Oops! 404</h1>
          <h3>Page not avaible</h3>
          <LinkContainer to={'/'}>
            <Button>Go back</Button>
          </LinkContainer>
        </Container>
      </>
  )
}