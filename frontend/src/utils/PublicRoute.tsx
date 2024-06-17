import {useSessionContext} from "../hooks/useSessionContext.tsx";
import {Navigate} from "react-router-dom";
import {FC, ReactNode} from "react";

interface PublicRouteProps{
  children: ReactNode;
}

const PublicRoute: FC<PublicRouteProps> = ({children}) => {
  const {userName} = useSessionContext()

  return userName ? <Navigate to={"/"}/> : children
}

export default PublicRoute