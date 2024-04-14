import {createContext, ReactNode, useState} from "react";
import {jwtDecode} from "jwt-decode";

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
}

interface SessionContextData {
  userID: number | null;
  tokens: TokenResponse | null;
  saveToken: (token: TokenResponse) => void;
  removeToken: () => void;
}

export const SessionContext = createContext<SessionContextData>({
  userID: null,
  tokens: null,
  saveToken: () => undefined,
  removeToken: () => undefined,
})

export const SessoinProvider = ({children}: { children: ReactNode }) => {
  const [userID, setUserId] = useState<null | number>(() => getUserFromToken())
  const [tokens, setTokens] = useState<TokenResponse | null>(() => getToken())

  const saveToken = (token: TokenResponse) => { // use when login
    localStorage.setItem('authTokens', JSON.stringify(token))
    setTokens(token)

    const tokenDecode: TokenDecode = jwtDecode(token.access)
    setUserId(tokenDecode.user_id)
  }

  const removeToken = () => { // use when logout
    localStorage.removeItem('authTokens')
    setTokens(null)
    setUserId(null)
  }

  const contextData: SessionContextData = {
    userID,
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
  const tokens = localStorage.getItem('authTokens')
  return tokens ? JSON.parse(tokens) : null
}

function getUserFromToken(): number | null {
  const token = localStorage.getItem('authTokens')
  if (token) {
    const decodeAccess: TokenDecode = jwtDecode(JSON.parse(token).access)
    return decodeAccess.user_id
  }
  return null
}