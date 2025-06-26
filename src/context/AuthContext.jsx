import { createContext,useEffect,useContext, Children, useState } from "react";
import { supabase } from "./supabaseClient";
import { data } from "react-router-dom";

const Authcontext = createContext()

export const AuthContextProvider = ({children}) =>{
    const [session,setSession] = useState(undefined)

    const signUpUser = async(email,password) =>{
        const {data,error} = await supabase.auth.signUp({
            email: email,
            password: password,
            options:{
                emailRedirectTo:undefined
            }
        })
        if(error){
            console.error(`There is a problem in Signin up: ${error}`)
            return {success:false,error:error.message}
        }
        return{success:true,data}
    }
      const verifyOtp = async (email, token) => {
        try {
            const { data, error } = await supabase.auth.verifyOtp({
                email: email,
                token: token,
                type: 'signup'
            })
            if (error) {
                console.error("OTP verification error:", error)
                return { success: false, error: error.message }
            }
            console.log("Email verification successful", data)
            return { success: true, data }
        } catch (error) {
            console.error("Unexpected error during OTP verification:", error)
            return { success: false, error: "An unexpected error occurred" }
        }
    }

    const resendOtp = async (email) => {
        try {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email: email
            })
            if (error) {
                console.error("Resend OTP error:", error)
                return { success: false, error: error.message }
            }
            return { success: true }
        } catch (error) {
            console.error("Unexpected error during resend OTP:", error)
            return { success: false, error: "An unexpected error occurred" }
        }
    }


    const signInUser = async(email,password) =>{
        try {
            const {data,error} = await supabase.auth.signInWithPassword({
                email:email,
                password:password
            })
            if(error){
                console.error("sign in error,",error)
                return {success:false,error:error.message}
            }
            console.log("sign-in successfull",data)
            return{success:true,data}
        } catch (error) {
            console.error("an error occured:",error)
            
        }
    }
       const resetPassword = async (email) => {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/update-password`
            })
            if (error) {
                return { success: false, error: error.message }
            }
            return { success: true }
        } catch (error) {
            console.error("Password reset error:", error)
            return { success: false, error: "An unexpected error occurred" }
        }
    }
        const updatePassword = async (newPassword) => {
        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            })
            if (error) {
                return { success: false, error: error.message }
            }
            return { success: true }
        } catch (error) {
            console.error("Password update error:", error)
            return { success: false, error: "An unexpected error occurred" }
        }
    }

  
    useEffect(() =>{
        supabase.auth.getSession().then(({data:{session}}) =>{
            setSession(session)
        })
        supabase.auth.onAuthStateChange((_event,session) =>{
            setSession(session)
        })
    },[])

    const signOut = () =>{
        const {error} = supabase.auth.signOut()
        if(error){
            console.error("there was an error," ,error)
        }
    }

    return (
        <Authcontext.Provider value={{session, signUpUser,signInUser,signOut,resetPassword,updatePassword,verifyOtp,resendOtp}}>
            {children}
        </Authcontext.Provider>
    )
}

export const UserAuth = () =>{
    return useContext(Authcontext)
}