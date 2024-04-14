import {useSessionContext} from "../hooks/useSessionContext.tsx";
import {Navigate} from "react-router-dom";
import {FC, ReactNode} from "react";

interface PrivateRouteProps{
  children: ReactNode;
}

const PrivateRoute: FC<PrivateRouteProps> = ({children}) => {
  const {userID} = useSessionContext()

  return !userID ? <Navigate to={"/login"}/> : children
}

export default PrivateRoute