import {useContext} from "react";
import {ToasterContext} from "../context/ToasterContext.tsx";

export const useToaster = () => useContext(ToasterContext)