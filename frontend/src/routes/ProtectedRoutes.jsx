import {Navigate} from "react-router-dom"
import { useAuth } from "../context/AuthContext.jsx"
import React from 'react'
import { SpinnerCustom } from "@/components/ui/spinner.jsx"

const ProtectedRoutes = ({children}) => {
    const {user,loading}=useAuth()
    if (loading) {
      return (
        <div className="flex h-screen w-screen items-center justify-center">
          <SpinnerCustom className="size-5" />
        </div>
      );
    }
    if(!user){
        return(
            <Navigate to="/login"/>
        )
    }
  return children
}

export default ProtectedRoutes