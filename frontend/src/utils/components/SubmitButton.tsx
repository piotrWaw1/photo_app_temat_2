import Spinner from "react-bootstrap/Spinner";
import {Button} from "react-bootstrap";
import {FC} from "react";

interface LoadingSubmitButtonProps {
  isLoading: boolean;
  text: string;
}

const SubmitButton: FC<LoadingSubmitButtonProps> = ({isLoading, text}) => {
  return (
      <Button type="submit" disabled={isLoading} className='mt-3'>
        {isLoading && <Spinner size="sm" animation="border" className="me-2"/>}
        {text}
      </Button>
  )
}

export default SubmitButton