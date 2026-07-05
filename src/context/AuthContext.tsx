import { createContext } from "react";
import type { authContext } from "../assets/types";

export const AuthContext = createContext<authContext | null> (null)