import { createContext, useEffect, useContext, useState } from "react";
import { supabase } from "./supabaseClient";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(undefined);

  
 const signUpUser = async (email) => {
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          channel:'email'
        }
      });

      if (error) return { success: false, error: error.message };
      return { success: true, data, email };
    } catch (error) {
      return { success: false, error: "An unexpected error occurred" };
    }
  };


  
  const verifyOtp = async (email, token, password ) => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: "email",
      });

      if (error) {
        console.error("OTP verification failed:", error.message);
        return { success: false, error: error.message };
      }

      
      if (password && data.user) {
        const { error: pwError } = await supabase.auth.updateUser({ password });
        if (pwError) {
          console.error("Password update error:", pwError.message);
        }
      }

      console.log("OTP verified successfully:", data);
      return { success: true, data };
    } catch (error) {
      console.error("Unexpected error during OTP verification:", error);
      return { success: false, error: "An unexpected error occurred" };
    }
  };

  
  const resendOtp = async (email) => {
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
      });

      if (error) {
        console.error("Resend OTP error:", error.message);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error("Unexpected error during resend OTP:", error);
      return { success: false, error: "An unexpected error occurred" };
    }
  };

  
  const signInUser = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Sign in error:", error.message);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: "An unexpected error occurred" };
    }
  };

  
  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://authenticateyou.netlify.app/update-password',

      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: "An unexpected error occurred" };
    }
  };

  
  const updatePassword = async (newPassword) => {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: "An unexpected error occurred" };
    }
  };

  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

  }, []);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: "An unexpected error occurred" };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        signUpUser,
        verifyOtp,
        resendOtp,
        signInUser,
        resetPassword,
        updatePassword,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => useContext(AuthContext);
