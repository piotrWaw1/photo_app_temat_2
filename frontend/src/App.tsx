import {useEffect} from 'react'
import axios from "axios";
import {Container} from "react-bootstrap";
import {Outlet} from "react-router-dom";

function App() {

  useEffect(() => {
    const testData = async () => {
      try {
        const response = await axios.post('/auth/token', {
          "email": "test2@email.com",
          "password": "a2"
        })
        console.log(response)
      } catch (error) {
        console.log(error)
      }
    }
    void testData()
  }, []);

  return (
      <Container>
        <Outlet/>
      </Container>
  )
}

export default App
