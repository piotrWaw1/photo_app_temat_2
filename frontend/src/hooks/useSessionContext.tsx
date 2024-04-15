import {useContext} from "react";
import {SessionContext} from "../context/SessionContext.tsx";

export const useSessionContext = () => useContext(SessionContext)