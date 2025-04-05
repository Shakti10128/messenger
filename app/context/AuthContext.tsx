'use client'
import { SessionProvider } from "next-auth/react"
import React, { FC } from "react"

interface AuthContextProvider{
    children: React.ReactNode
}


// to use session of nextauth in any component, the component must be wraaped inside sessionProvider

// wrap the root layout inside this AuthContext to use session inside while app
const AuthContext: FC<AuthContextProvider> = ({children}) => {
  return (
    <SessionProvider>
        {children}
    </SessionProvider>
  )
}

export default AuthContext