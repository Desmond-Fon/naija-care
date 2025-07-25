/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAuth } from "firebase/auth";
import { auth, database } from "../firebase";
import { usersCollection } from "./db";
import {
  doc,
  getDocs,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  increment,
  collection,
} from "firebase/firestore";


// USERS
// export const getCurrentUserRole = async () => {
//   const user = auth.currentUser;
//   if (!user) return null;

//   const docRef = doc(usersCollection, user.uid);
//   const userSnap = await getDoc(docRef);

//   if (userSnap.exists()) {
//     return userSnap.data().role;
//   }

//   return null;
// };

export const getCurrentUserRole = async () => {
  const user = auth.currentUser;
  if (!user) {
    console.warn("No authenticated user.");
    return null;
  }

  const docRef = doc(usersCollection, user.uid);
  const userSnap = await getDoc(docRef);

  if (!userSnap.exists()) {
    console.warn("User document not found for:", user.uid);
    return null;
  }

  const data = userSnap.data();
  console.log("Fetched user data:", data);
  return data?.role;
};


export const getCurrentUser = async () => {
  const user = auth.currentUser;
  if (!user) return null;

  const docRef = doc(usersCollection, user.uid);
  const userSnap = await getDoc(docRef);

  if (userSnap.exists()) {
    return userSnap.data();
  }

  return null;
};



// ADMIN

export const createUser = async (newUser: any) => {
  // const role = await getCurrentUserRole();

  // if (role !== "admin") {
  //   throw new Error("Permission denied: Only admins can create users.");
  // }

  return setDoc(
    doc(usersCollection, newUser.uid),
    JSON.parse(JSON.stringify(newUser))
  );
};

export const getUserById = (userID: string) => {
  return getDoc(doc(usersCollection, userID));
};

export const getAllUsers = async () => {
  const snapshot = await getDocs(usersCollection);
  const users = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return users;
};

export const getUsersByAdmin = async (adminId: string) => {
  const snapshot = await getDocs(usersCollection);
  const users = snapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .filter((user: any) => user.hospitalId === adminId); // Only users linked to the admin

  return users;
};

export const updateUser = async (uid: string, updatedValues: Partial<any>) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    const userRef = doc(usersCollection, uid);
    await updateDoc(userRef, updatedValues);
    return true; // or return updatedValues if needed
  } else {
    throw new Error(
      "User is not authenticated. Please log in to update a user."
    );
  }
};



// APPOINTMENTS FOR USERS
export const addAppointmentToCurrentUser = async (
  message: string,
  name: string,
  profilePic: string,
  date: string,
  time: string,
  type: string,
  status: string = "pending",
  paymentStatus: string = "unpaid"
) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) throw new Error("User must be logged in");

  const appointment = {
    name,
    profilePic,
    userId: user.uid,
    email: user.email,
    message,
    date,
    time,
    type,
    status,
    paymentStatus,
    id: doc(collection(database, "appointments")).id,
  };

  const userRef = doc(usersCollection, user.uid);

  // Use setDoc with merge: true to ensure the array is created if not present
  try {
    await setDoc(
      userRef,
      {
        appointments: arrayUnion(appointment),
      },
      { merge: true }
    );
    return true;
  } catch (error) {
    console.error("Error adding appointment:", error);
    throw error;
  }
};

export const updateUserAppointment = async (
  appointmentId: string,
  updates: Partial<{
    message: string;
    name: string;
    date: string;
    time: string;
    type: string;
    status: string;
    paymentStatus: string;
  }>
) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) throw new Error("User must be logged in");

  const userRef = doc(usersCollection, user.uid);

  try {
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) throw new Error("User not found");

    const data = userSnap.data();
    const currentAppointments = data.appointments || [];

    const updatedAppointments = currentAppointments.map((appt: any) =>
      appt.id === appointmentId ? { ...appt, ...updates } : appt
    );

    await updateDoc(userRef, {
      appointments: updatedAppointments,
    });

    return true;
  } catch (error) {
    console.error("Error updating appointment:", error);
    throw error;
  }
};

export const rescheduleAppointmentForCurrentUser = async (
  appointmentId: string,
  newDate: string,
  newTime: string,
  newType: string,
  newMessage: string
) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error("User must be logged in");
  const userRef = doc(usersCollection, user.uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) throw new Error("User not found");
  const data = userSnap.data();
  const appointments = Array.isArray(data.appointments)
    ? data.appointments
    : [];
  const updatedAppointments = appointments.map((appt: any) =>
    appt.id === appointmentId
      ? {
          ...appt,
          date: newDate,
          time: newTime,
          type: newType,
          status: "pending",
          message: newMessage,
        }
      : appt
  );
  await setDoc(userRef, { appointments: updatedAppointments }, { merge: true });
  return true;
};

export const deleteAppointmentForCurrentUser = async (
  appointmentId: string
) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error("User must be logged in");
  const userRef = doc(usersCollection, user.uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) throw new Error("User not found");
  const data = userSnap.data();
  const appointments = Array.isArray(data.appointments)
    ? data.appointments
    : [];
  const updatedAppointments = appointments.filter(
    (appt: any) => appt.id !== appointmentId
  );
  await setDoc(userRef, { appointments: updatedAppointments }, { merge: true });
  return true;
};



// APPOINTMENTS FOR ADMIN
export const getAllAppointmentsForAdmin = async () => {
  const usersSnap = await getDocs(usersCollection);
  const allAppointments: any[] = [];
  usersSnap.forEach((docSnap) => {
    const data = docSnap.data();
    const appointments = Array.isArray(data.appointments)
      ? data.appointments
      : [];
    appointments.forEach((appt: any) => {
      allAppointments.push({
        ...appt,
        userId: docSnap.id,
        userEmail: data.email || "",
      });
    });
  });
  return allAppointments;
};

export const getAppointmentsForAdmin = async (adminId: string) => {
  const usersSnap = await getDocs(usersCollection);
  const adminAppointments: any[] = [];

  usersSnap.forEach((docSnap) => {
    const data = docSnap.data();

    // Only consider users with hospitalId matching the admin's UID
    if (data.hospitalId === adminId) {
      const appointments = Array.isArray(data.appointments)
        ? data.appointments
        : [];

      appointments.forEach((appt: any) => {
        adminAppointments.push({
          ...appt,
          userId: docSnap.id,
          userEmail: data.email || "",
        });
      });
    }
  });

  return adminAppointments;
};

export const updateAppointmentForAdmin = async (
  userId: string,
  appointmentId: string,
  updates: Record<string, any>
) => {
  const userRef = doc(usersCollection, userId);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) throw new Error("User not found");
  const data = userSnap.data();
  const appointments = Array.isArray(data.appointments)
    ? data.appointments
    : [];
  const updatedAppointments = appointments.map((appt: any) =>
    appt.id === appointmentId ? { ...appt, ...updates } : appt
  );
  await setDoc(userRef, { appointments: updatedAppointments }, { merge: true });
  return true;
};



// WALLET FOR USERS
export const addFundsToWallet = async (
  amount: number,
  method: "card" | "blockchain"
) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) throw new Error("User must be logged in");

  const userRef = doc(usersCollection, user.uid);

  const transaction = {
    id: Date.now(), // simple unique ID using timestamp
    type: "Deposit",
    method: method === "card" ? "Card" : "Blockchain",
    amount,
    date: new Date().toISOString().slice(0, 10),
    timestamp: new Date().toISOString(), // use client time
  };

  try {
    await setDoc(
      userRef,
      {
        wallet: increment(amount), // increase wallet by amount
        transactions: arrayUnion(transaction), // add to transaction array
      },
      { merge: true }
    );

    return {
      message: `Successfully added ₦${amount.toLocaleString()} via ${
        transaction.method
      }`,
      transaction,
    };
  } catch (error) {
    console.error("Error updating wallet:", error);
    throw new Error("Could not add funds. Please try again.");
  }
};

export const removeFundsFromWallet = async (
  amount: number,
  method: "card" | "blockchain" | "wallet"
) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error("User must be logged in");
  const userRef = doc(usersCollection, user.uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) throw new Error("User not found");
  const data = userSnap.data();
  const currentBalance = typeof data.wallet === "number" ? data.wallet : 0;
  if (method !== "card" && method !== "blockchain" && currentBalance < amount) {
    throw new Error("Wallet balance is not up to the amount to be paid.");
  }
  const transaction = {
    id: Date.now(),
    type: "Payment",
    method:
      method === "card"
        ? "Card"
        : method === "blockchain"
        ? "Blockchain"
        : "Wallet",
    amount: -amount,
    date: new Date().toISOString().slice(0, 10),
    timestamp: new Date().toISOString(),
  };
  try {
    await setDoc(
      userRef,
      {
        wallet: increment(-amount), // deduct wallet by amount
        transactions: arrayUnion(transaction), // add to transaction array
      },
      { merge: true }
    );
    return {
      message: `Successfully paid ₦${amount.toLocaleString()} via ${
        transaction.method
      }`,
      transaction,
    }; 
  } catch (error) {
    console.error("Error deducting wallet:", error);
    throw new Error("Could not deduct funds. Please try again.");
  }
};



// STATS FOR ADMIN
export const getAdminStatsAll = async () => {
  const usersCol = collection(database, "users");

  // Fetch all users
  const usersSnap = await getDocs(usersCol);
  let users = 0;
  let doctors = 0;
  let appointments = 0;
  let revenue = 0;

  usersSnap.forEach((doc) => {
    const data = doc.data();
    if (data.role === "user") users++;
    if (data.role === "doctor") doctors++;
    if (Array.isArray(data.appointments)) {
      appointments += data.appointments.length;
      data.appointments.forEach((appt: any) => {
        if (appt.paymentStatus === "paid" && typeof appt.amount === "number") {
          revenue += appt.amount;
        }
      });
    }
  });

  return { users, doctors, appointments, revenue };
};

export const getRecentActivitiesAll = async (limit = 10) => {
  const usersCol = collection(database, "users");
  const usersSnap = await getDocs(usersCol);
  let activities: any[] = [];

  usersSnap.forEach((doc) => {
    const data = doc.data();
    // New user registration
    if (data.createdAt) {
      activities.push({
        type: "user",
        message: `New user registered: ${data.name || data.email}`,
        timestamp: data.createdAt,
      });
    }
    // Doctor added
    if (data.role === "doctor" && data.createdAt) {
      activities.push({
        type: "doctor",
        message: `Dr. ${data.name || data.email} added to ${
          data.specialty || "the platform"
        }`,
        timestamp: data.createdAt,
      });
    }
    // Appointments
    if (Array.isArray(data.appointments)) {
      data.appointments.forEach((appt) => {
        if (appt.createdAt) {
          activities.push({
            type: "appointment",
            message: `Appointment confirmed for ${data.name || data.email}`,
            timestamp: appt.createdAt,
          });
        }
        // Payments
        if (appt.paymentStatus === "paid" && appt.paymentDate) {
          activities.push({
            type: "payment",
            message: `Payment received from ${data.name || data.email} (₦${
              appt.amount?.toLocaleString?.() || appt.amount
            })`,
            timestamp: appt.paymentDate,
          });
        }
      });
    }
  });

  // Sort by timestamp descending and limit
  activities = activities
    .filter((a) => a.timestamp)
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    .slice(0, limit);

  return activities;
};

export const getAdminStats = async (adminId: string) => {
  const usersCol = collection(database, "users");
  const usersSnap = await getDocs(usersCol);

  let users = 0;
  let doctors = 0;
  let appointments = 0;
  let revenue = 0;

  usersSnap.forEach((doc) => {
    const data = doc.data();

    // Only process users under this admin
    if (data.hospitalId === adminId) {
      if (data.role === "user") users++;
      if (data.role === "doctor") doctors++;

      if (Array.isArray(data.appointments)) {
        appointments += data.appointments.length;

        data.appointments.forEach((appt: any) => {
          if (
            appt.paymentStatus === "paid" &&
            typeof appt.amount === "number"
          ) {
            revenue += appt.amount;
          }
        });
      }
    }
  });

  return { users, doctors, appointments, revenue };
};

export const getRecentActivities = async (adminId: string, limit = 10) => {
  const usersCol = collection(database, "users");
  const usersSnap = await getDocs(usersCol);
  let activities: any[] = [];

  usersSnap.forEach((doc) => {
    const data = doc.data();

    // Only include users under this admin
    if (data.hospitalId === adminId) {
      // New user registration
      if (data.createdAt) {
        activities.push({
          type: "user",
          message: `New user registered: ${data.name || data.email}`,
          timestamp: data.createdAt,
        });
      }

      // Doctor added
      if (data.role === "doctor" && data.createdAt) {
        activities.push({
          type: "doctor",
          message: `Dr. ${data.name || data.email} added to ${
            data.specialty || "the platform"
          }`,
          timestamp: data.createdAt,
        });
      }

      // Appointments
      if (Array.isArray(data.appointments)) {
        data.appointments.forEach((appt) => {
          if (appt.createdAt) {
            activities.push({
              type: "appointment",
              message: `Appointment confirmed for ${data.name || data.email}`,
              timestamp: appt.createdAt,
            });
          }

          // Payments
          if (appt.paymentStatus === "paid" && appt.paymentDate) {
            activities.push({
              type: "payment",
              message: `Payment received from ${data.name || data.email} (₦${
                appt.amount?.toLocaleString?.() || appt.amount
              })`,
              timestamp: appt.paymentDate,
            });
          }
        });
      }
    }
  });

  // Sort by timestamp descending and limit
  activities = activities
    .filter((a) => a.timestamp)
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    .slice(0, limit);

  return activities;
};
