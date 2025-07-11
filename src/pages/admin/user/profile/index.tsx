/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from "react";
import { useUser } from "../../../../context/useUser";
import { useAppToast } from "../../../../lib/useAppToast";
import { updateUser } from "../../../../lib/helpers/user";

/**
 * Profile page component for viewing and editing user details, including profile picture.
 * Optimized to always sync state with user context and update UI on edits or refresh.
 */
const Profile = () => {
  const { user, setRefetch, refetch } = useUser();
  const toast = useAppToast();
  // State for edit mode
  const [editMode, setEditMode] = useState(false);
  // State for form fields
  const [form, setForm] = useState(user ? user : {});
  // State for messages
  const [message, setMessage] = useState("");
  // State for profile picture preview
  const [preview, setPreview] = useState(user?.profilePic || "");
  // Ref for file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Keep form and preview in sync with user context
  useEffect(() => {
    setForm(user ? user : {});
    setPreview(user?.profilePic || "");
  }, [user, refetch]);

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

  // Upload image to Cloudinary
  const uploadToCloudinary = async (file: File): Promise<string> => {
    const cloudName = "dvikxcdh3";
    const uploadPreset = "newpreset";
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("cloud_name", cloudName);
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

  // Handle save profile
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.phone || !form.address || !form.profilePic) {
      toast({
        status: "error",
        description: "Please fill in all required fields.",
      });
      return;
    }
    try {
      let imageUrl = form.profilePic;
      if (form.profilePic instanceof File) {
        imageUrl = await uploadToCloudinary(form.profilePic);
      }
      const updatedUser = {
        ...form,
        profilePic: imageUrl,
        updatedAt: new Date().toISOString(),
      };
      await updateUser(user.uid, updatedUser);
      toast({
        status: "success",
        description: "Profile updated successfully!",
      });
      setRefetch((prev: boolean) => !prev); // Triggers user context update
      setEditMode(false);
      setMessage("");
    } catch (error: any) {
      toast({
        status: "error",
        description: error.message || "Something went wrong while updating.",
      });
    }
  };

  // Handle cancel
  function handleCancel() {
    setForm(user ? user : {});
    setPreview(user?.profilePic || "");
    setEditMode(false);
    setMessage("");
  }

  return (
    <div className="max-w-6xl mx-auto p-4 w-full">
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-xl font-bold mb-4">My Profile</h2>
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <img
              src={preview}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-blue-200 shadow"
            />
            {editMode && (
              <button
                type="button"
                className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 shadow hover:bg-blue-700 focus:outline-none"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Change profile picture"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
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
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handlePicChange}
            />
          </div>
        </div>
        {editMode ? (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                name="name"
                className="w-full border rounded px-2 py-1"
                value={form.name || ""}
                readOnly
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">NHIS Number</label>
              <input
                type="text"
                name="nhis_number"
                className="w-full border rounded px-2 py-1"
                value={form.nhis_number || ""}
                readOnly
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                className="w-full border rounded px-2 py-1"
                value={form.email || ""}
                readOnly
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                className="w-full border rounded px-2 py-1"
                value={form.phone || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <textarea
                name="address"
                className="w-full border rounded px-2 py-1"
                value={form.address || ""}
                onChange={handleChange}
                rows={2}
                required
              />
            </div>
            {message && <div className="text-red-500 text-sm">{message}</div>}
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                className="px-4 py-2 rounded bg-gray-200"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-600 text-white"
              >
                Save
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div className="mb-3">
              <span className="block text-gray-600 text-sm mb-1">Name</span>
              <span className="font-semibold">{form.name}</span>
            </div>
            <div className="mb-3">
              <span className="block text-gray-600 text-sm mb-1">NHIS Number</span>
              <span className="font-semibold">{form.nhis_number}</span>
            </div>
            <div className="mb-3">
              <span className="block text-gray-600 text-sm mb-1">Email</span>
              <span className="font-semibold">{form.email}</span>
            </div>
            <div className="mb-3">
              <span className="block text-gray-600 text-sm mb-1">Phone</span>
              <span className="font-semibold">{form.phone}</span>
            </div>
            <div className="mb-3">
              <span className="block text-gray-600 text-sm mb-1">Address</span>
              <span className="font-semibold">{form.address}</span>
            </div>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white"
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </button>
            </div>
            {message && (
              <div className="text-green-600 text-sm mt-3">{message}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
