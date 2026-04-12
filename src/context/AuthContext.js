import { createContext, useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authStatus, setAuthStatus] = useState("unknown");
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setAuthStatus("authed");
        setUser(data.session.user);
      } else {
        setAuthStatus("guest");
      }
    });


    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          setAuthStatus("authed");
          setUser(session.user);
        } else {
          setAuthStatus("guest");
          setUser(null);
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);


  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ authStatus, user, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;