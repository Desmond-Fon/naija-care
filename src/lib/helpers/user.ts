/* eslint-disable @typescript-eslint/no-explicit-any */
import { usersCollection } from "./db";
import { doc, getDocs, setDoc, getDoc } from "firebase/firestore";

export const createUser = async (user: any) => {
  return setDoc(
    doc(usersCollection, user.uid),
    JSON.parse(JSON.stringify(user))
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

