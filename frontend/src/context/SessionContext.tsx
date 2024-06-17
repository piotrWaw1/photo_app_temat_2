import {createContext, ReactNode, useEffect, useState} from "react";
import {jwtDecode} from "jwt-decode";
import axios from "axios";

interface TokenResponse {
  access: string;
  refresh: string;
}

interface TokenDecode {
  token_type: string;
  exp: number;
  iat: number;
  jti: string;
  user_id: number;
  username:string;
}

interface SessionContextData {
  userName: string | null;
  tokens: TokenResponse | null;
  saveToken: (token: TokenResponse) => void;
  removeToken: () => void;
}

export const SessionContext = createContext<SessionContextData>({
  userName: null,
  tokens: null,
  saveToken: () => undefined,
  removeToken: () => undefined,
})

export const SessoinProvider = ({children}: { children: ReactNode }) => {
  const [userName, setUserName] = useState<null | string>(() => getUserFromToken())
  const [tokens, setTokens] = useState<TokenResponse | null>(() => getToken())

  const saveToken = (token: TokenResponse) => { // use when login
    sessionStorage.setItem('authTokens', JSON.stringify(token))
    setTokens(token)

    const tokenDecode: TokenDecode = jwtDecode(token.access)
    setUserName(tokenDecode.username)
  }

  const removeToken = () => { // use when logout
    sessionStorage.removeItem('authTokens')
    setTokens(null)
    setUserName(null)
  }


  useEffect(() => {
    const updateToken = async () => {
      try {
        const response = await axios.post("/auth/token/refresh", {
          refresh: tokens?.refresh,
        })
        if (response.status === 200) {
          sessionStorage.setItem('authTokens', JSON.stringify(response.data))
          setUserName(getUserFromToken())
          setTokens(getToken())
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          removeToken()
        }
      }
    }
    const REFRESH_INTERVAL = 1000 * 60 * 5; // 10 minutes
    // const REFRESH_INTERVAL = 500
    const interval = setInterval(() => {
      if (tokens) {
        void updateToken();
      }
    }, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [tokens]);

  const contextData: SessionContextData = {
    userName,
    tokens,
    saveToken,
    removeToken
  }

  return (
      <SessionContext.Provider value={contextData}>
        {children}
      </SessionContext.Provider>
  )
}

function getToken(): TokenResponse | null {
  const tokens = sessionStorage.getItem('authTokens')
  return tokens ? JSON.parse(tokens) : null
}

function getUserFromToken(): string | null {
  const token = sessionStorage.getItem('authTokens')
  if (token) {
    const decodeAccess: TokenDecode = jwtDecode(JSON.parse(token).access)
    return decodeAccess.username
  }
  return null
}