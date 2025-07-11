/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "../firebase";
import { usersCollection } from "./db";
import { doc, getDocs, setDoc, getDoc } from "firebase/firestore";

export const getCurrentUserRole = async () => {
  const user = auth.currentUser;
  if (!user) return null;

  const docRef = doc(usersCollection, user.uid);
  const userSnap = await getDoc(docRef);

  if (userSnap.exists()) {
    return userSnap.data().role;
  }

  return null;
};

export const createUser = async (newUser: any) => {
  const role = await getCurrentUserRole();

  if (role !== "admin") {
    throw new Error("Permission denied: Only admins can create users.");
  }

  return setDoc(
    doc(usersCollection, newUser.uid),
    JSON.parse(JSON.stringify(newUser))
  );
};
export const getUserById = (userID: string) => {
  return getDoc(doc(usersCollection, userID));
};

export const getUsers = async () => {
  const snapshot = await getDocs(usersCollection);
  const users = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return users;
};

