import {useEffect} from 'react'
import './App.css'
import axios from "axios";

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
    <p>XDDD</p>
  )
}

export default App
