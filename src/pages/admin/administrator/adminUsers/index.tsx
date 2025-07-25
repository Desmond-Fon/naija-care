/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createUserWithEmailAndPassword,
  // EmailAuthProvider,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  // signOut,
} from "firebase/auth";
import React, { useState, useRef, useEffect } from "react";
import { createUser, getUsersByAdmin } from "../../../../lib/helpers/user";
import { auth } from "../../../../lib/firebase";
import { useAppToast } from "../../../../lib/useAppToast";
// import { useUser } from "../../../../context/useUser";

const AdminUsers = () => {
  const toast = useAppToast();
  // const { user } = useUser();
  // State for users
  const [users, setUsers] = useState<any>([]);
  // State for modal visibility
  const [showModal, setShowModal] = useState(false);
  const [refetch, setRefetch] = useState(false);
  // State for form fields
  const [form, setForm] = useState({
    name: "",
    email: "",
    nhis_number: "",
    phone: "",
    address: "",
    profilePic: null as File | null,
    password: "",
    nin: "",
  });
  // State for profile picture preview
  const [preview, setPreview] = useState("");
  // Ref for file input
  const fileInputRef = useRef<HTMLInputElement>(null);
  // State for messages
  const [message, setMessage] = useState("");
  // State for NHIS search
  const [search, setSearch] = useState("");
  // State for viewing patient details
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [loading, setLoading] = useState(false);

  // Filter users by NHIS number
  const filteredUsers = users.filter((user: any) =>
    user.nhis_number.toLowerCase().includes(search.toLowerCase())
  );

  // Open details modal
  function handleViewDetails(user: any) {
    setSelectedUser(user);
    setShowDetailsModal(true);
  }
  // Close details modal
  function closeDetailsModal() {
    setShowDetailsModal(false);
    setSelectedUser(null);
  }

  // Handle input changes
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Handle profile picture change
  function handlePicChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setForm({ ...form, profilePic: file });
      };
      reader.readAsDataURL(file);
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          let allUsers = await getUsersByAdmin(user.uid);
          allUsers = allUsers.filter((user: any) => user.role === "user");
          setUsers(allUsers);
        } catch (err: any) {
          toast({
            status: "error",
            description: err?.message || "Failed to load users",
          });
        }
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [refetch]);

  // Handle open modal
  function openModal() {
    setShowModal(true);
    setForm({
      name: "",
      email: "",
      nhis_number: "",
      phone: "",
      address: "",
      profilePic: null as File | null,
      password: "",
      nin: "",
    });
    setPreview("");
    setMessage("");
  }

  // Handle close modal
  function closeModal() {
    setShowModal(false);
    setForm({
      name: "",
      email: "",
      nhis_number: "",
      phone: "",
      address: "",
      profilePic: null as File | null,
      password: "",
      nin: "",
    });
    setPreview("");
    setMessage("");
  }

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const cloudName = "dvikxcdh3";
    const uploadPreset = "newpreset"; // or try "ml_default" if you're okay using signed preset

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("cloud_name", cloudName);
    // if preset restricts folder

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Image upload failed");
    }

    return data.secure_url;
  };

  const generateNHISId = (): string => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomPart = "";
    for (let i = 0; i < 5; i++) {
      randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `NHIS${randomPart}`;
  };

  const createUserAsAdmin = async (e: any) => {
    e.preventDefault();

    const { email, password, name, phone, address, profilePic, nin } = form;

    if (!form.name || !form.email || !form.password) {
      toast({
        status: "error",
        description: "All fields are required",
      });
      return;
    }

    if (!profilePic) {
      toast({
        status: "error",
        description: "Please upload a profile image",
      });
      return;
    }

    const adminEmail = auth.currentUser?.email;
    const adminPassword = prompt(
      "Please enter your password to re-authenticate:"
    );

    // const credential = EmailAuthProvider.credential(adminEmail!, adminPassword!);
    setLoading(true);
    try {
      // Save admin user to come back to later
      const adminUser = auth.currentUser;

      // Create new user (this signs them in and kicks admin out)
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const newUser = userCredential.user;

      // Upload profile image
      const imageUrl = await uploadToCloudinary(profilePic as File);
      const nhisId = generateNHISId();

      // Save to Firestore
      await createUser({
        uid: newUser.uid,
        email,
        name,
        role: "user",
        nhis_number: nhisId,
        phone,
        address,
        profilePic: imageUrl,
        hospitalId: adminUser?.uid,
        wallet: 0,
        nin,
      });

      await sendEmailVerification(newUser);

      // ✅ Re-sign in admin
      await signInWithEmailAndPassword(auth, adminEmail!, adminPassword!);

      // Get all users again
      let allUsers = await getUsersByAdmin(adminUser ? adminUser?.uid : "");
      allUsers = allUsers.filter((user: any) => user.role === "user");
      setUsers(allUsers);
      setRefetch(!refetch);
      setShowModal(false);
      toast({
        status: "success",
        description: "User added successfully",
      });
      setLoading(false);
    } catch (error: any) {
      console.error("Error creating user:", error);
      setLoading(false);
      toast({
        status: "error",
        description: error?.message || "Error creating user",
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 w-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
        <h2 className="text-xl font-bold">Users Under This Admin</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by NHIS Number"
            className="border rounded px-2 py-1 w-full sm:w-56"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={openModal}
          >
            Add User
          </button>
        </div>
      </div>
      {/* Users List */}
      <div className="bg-white rounded shadow p-4 overflow-x-auto">
        {filteredUsers.length === 0 ? (
          <div className="text-gray-500">No users found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">Profile</th>
                <th className="p-2">Full Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">NHIS Number</th>
                <th className="p-2">Phone</th>
                <th className="p-2">Address</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user: any) => (
                <tr key={user.id} className="border-b">
                  <td className="p-2">
                    <img
                      src={user.profilePic}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover border"
                    />
                  </td>
                  <td className="p-2 font-semibold">{user.name}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">{user.nhis_number}</td>
                  <td className="p-2">{user.phone}</td>
                  <td className="p-2">{user.address}</td>
                  <td className="p-2">
                    <button
                      className="text-blue-600 underline text-xs"
                      onClick={() => handleViewDetails(user)}
                    >
                      View History
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={closeModal}
            >
              &times;
            </button>
            <h3 className="text-lg font-bold mb-4">Add User</h3>
            <form onSubmit={(e) => createUserAsAdmin(e)} className="space-y-4">
              <div className="flex flex-col items-center">
                <div className="relative mb-2">
                  <img
                    src={
                      preview ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        form.name || "User"
                      )}&background=0D8ABC&color=fff`
                    }
                    alt="Profile Preview"
                    className="w-20 h-20 rounded-full object-cover border-2 border-blue-200 shadow"
                  />
                  <button
                    type="button"
                    className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 shadow hover:bg-blue-700 focus:outline-none"
                    onClick={() => fileInputRef.current?.click()}
                    aria-label="Change profile picture"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2a2.828 2.828 0 11-4-4 2.828 2.828 0 014 4z"
                      />
                    </svg>
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handlePicChange}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  className="w-full border rounded px-2 py-1"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">NIN</label>
                <input
                  type="text"
                  name="nin"
                  className="w-full border rounded px-2 py-1"
                  value={form.nin}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  className="w-full border rounded px-2 py-1"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  className="w-full border rounded px-2 py-1"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Address
                </label>
                <textarea
                  name="address"
                  className="w-full border rounded px-2 py-1"
                  value={form.address}
                  onChange={handleChange}
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Password
                </label>
                <input
                  name="password"
                  className="w-full border rounded px-2 py-1"
                  value={form.password}
                  onChange={handleChange}
                />
              </div>
              {message && <div className="text-red-500 text-sm">{message}</div>}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-200"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white"
                >
                  {loading ? "Loading..." : "Add User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showDetailsModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={closeDetailsModal}
            >
              &times;
            </button>
            <div className="flex items-center gap-4 mb-4">
              <img
                src={selectedUser.profilePic}
                alt={selectedUser.name}
                className="w-16 h-16 rounded-full object-cover border"
              />
              <div>
                <div className="font-bold text-lg">{selectedUser.name}</div>
                <div className="text-sm text-gray-600">
                  {selectedUser.email}
                </div>
                <div className="text-xs text-gray-500">
                  NHIS: {selectedUser.nhis_number}
                </div>
              </div>
            </div>
            <h4 className="font-semibold mb-2">Patient History</h4>
            <ul className="mb-4 text-sm list-disc pl-5">
              {selectedUser.appointments.map((h: any, idx: any) => (
                <li key={idx}>
                  <span className="font-medium">{h.date}:</span> {h.message}{" "}
                  {h.note && <span className="text-gray-500">({h.note})</span>}
                </li>
              ))}
            </ul>
            <h4 className="font-semibold mb-2">Appointments</h4>
            <table className="w-full text-xs mb-2">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-1">Date</th>
                  <th className="p-1">Type</th>
                  <th className="p-1">Status</th>
                </tr>
              </thead>
              <tbody>
                {selectedUser.appointments.map((a: any, idx: any) => (
                  <tr key={idx}>
                    <td className="p-1">{a.date}</td>
                    <td className="p-1">{a.type}</td>
                    <td className="p-1">{a.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
