/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useEffect } from "react";
import { createContext, useContext, useState, type ReactNode } from "react";
import { auth } from "../lib/firebase";
import { getUserById } from "../lib/helpers/user";
import { useNavigate } from "react-router-dom";

interface UserContextType {
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  handleLogout: any;
  setRefetch: React.Dispatch<React.SetStateAction<any>>;
  refetch: any;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<null | any>(undefined);
  const [refetch, setRefetch] = useState<any>(false);

  useEffect(() => {
    // Access cookies only on the client side after component mounts
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        setUser(null);
        return;
      } else {
        getUserById(currentUser?.uid).then((usr) => {
          const userData = usr.data();
          setUser(userData);
        });
      }
    });
    return unsubscribe;
  }, [refetch]);


const handleLogout = async () => {
  try {
    await signOut(auth);
    // Optional: Redirect to login or home page
    navigate("/");
  } catch (error) {
    console.error("Error signing out:", error);
  }
};

  return (
    <UserContext.Provider value={{ user, setUser, handleLogout, setRefetch, refetch }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for using the context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
