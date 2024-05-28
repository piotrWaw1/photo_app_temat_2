import {FC} from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import {format} from "date-fns";
import {Col} from "react-bootstrap";
import axios from "axios";
import {useSessionContext} from "../hooks/useSessionContext.tsx";


const SingleImage = () =>{
    const {tokens} = useSessionContext()

    
    const imgGet = async (id: number) => {
        try {
            const response = await axios.get(`/annotations/photo/${id}`, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: 'Bearer ' + String(tokens?.access),
            }
            })
            console.log(response.data)
        } catch (error) {
            if (axios.isAxiosError(error)) {
            console.log(error)
            }
        }
        }


    return(
        <div>
            <button onClick={() => imgGet(7)}>test</button>
        </div>
    )
}
export default SingleImage;