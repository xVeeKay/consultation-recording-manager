import { createContext,useContext,useEffect,useState } from "react";
import { apiFetch } from "../api/apiFetch.js";
import { toast } from "sonner";

export const AuthContext=createContext()

export const AuthProvider=({children})=>{
    const [user,setUser]=useState(null)
    const [loading,setLoading]=useState(true)

    const logout=async()=>{
        try {
            await apiFetch("/auth/logout",{
                method:"POST"
            })
            setUser(null)
            toast.success("Logged out successfully")
        } catch (error) {
            toast.error("Error while logging out:",error.message)
            console.log(error)
        }
    }

    const fetchCurrentUser=async()=>{
        try {
            const res=await apiFetch("/auth/me")
            setUser(res.data)
        } catch (error) {
            setUser(null)
        }finally{
            setLoading(false)
        }
    }
    useEffect(()=>{
        fetchCurrentUser()
    },[])
    return (
        <AuthContext.Provider value={{user,setUser,loading,logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth=()=>useContext(AuthContext)