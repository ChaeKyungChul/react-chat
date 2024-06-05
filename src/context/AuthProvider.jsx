import React, { createContext, useContext } from 'react'

const AuthContext = createContext();

const AuthProvider = ({ children , value }) => {
  return (
    <AuthContext.Provider value={value}>
       {children}
    </AuthContext.Provider>    
  )
}

const useAuthValue = () => {
    return useContext(AuthContext);
}

export {AuthProvider, useAuthValue }