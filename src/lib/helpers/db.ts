import { database } from "../firebase";
import { collection } from "firebase/firestore";

export const usersCollection = collection(database, "users");

// export const blogCollection = collection(database, "blogs");
