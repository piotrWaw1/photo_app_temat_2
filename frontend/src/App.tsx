import {Container} from "react-bootstrap";
import {Outlet} from "react-router-dom";
import HeaderLog from "./header/HeaderLog.tsx";

function App() {

  return (
      <>
        <HeaderLog/>
        <Container>
          <Outlet/>
        </Container>
      </>
  )
}

export default App
