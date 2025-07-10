import React, { useState, useRef } from "react";

// Dummy user data for demonstration
const dummyProfile = {
  name: "Jane Doe",
  email: "jane.doe@email.com",
  phone: "+2348012345678",
  nhis_number: "NHIS1223JD",
  address: "123 Main Street, Lagos, Nigeria",
  profilePic: "https://ui-avatars.com/api/?name=Jane+Doe&background=0D8ABC&color=fff"
};

/**
 * Profile page component for viewing and editing user details, including profile picture.
 * Allows editing of name, email, phone, NHIS number, address, and profile picture.
 */
const Profile = () => {
  // State for profile data (replace with real data fetching in production)
  const [profile, setProfile] = useState(dummyProfile);
  // State for edit mode
  const [editMode, setEditMode] = useState(false);
  // State for form fields
  const [form, setForm] = useState(profile);
  // State for messages
  const [message, setMessage] = useState("");
  // State for profile picture preview
  const [preview, setPreview] = useState(profile.profilePic);
  // Ref for file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle input changes
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Handle profile picture change
  function handlePicChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setForm({ ...form, profilePic: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  }

  // Handle save
  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    // Simple validation
    if (!form.name || !form.email) {
      setMessage("Name and email are required.");
      return;
    }
    setProfile(form);
    setEditMode(false);
    setMessage("Profile updated successfully.");
  }

  // Handle cancel
  function handleCancel() {
    setForm(profile);
    setPreview(profile.profilePic);
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
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2a2.828 2.828 0 11-4-4 2.828 2.828 0 014 4z" /></svg>
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
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">NHIS Number</label>
              <input
                type="text"
                name="nhis_number"
                className="w-full border rounded px-2 py-1"
                value={form.nhis_number}
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
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                className="w-full border rounded px-2 py-1"
                value={form.phone}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <textarea
                name="address"
                className="w-full border rounded px-2 py-1"
                value={form.address}
                onChange={handleChange}
                rows={2}
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
              <span className="font-semibold">{profile.name}</span>
            </div>
            <div className="mb-3">
              <span className="block text-gray-600 text-sm mb-1">NHIS Number</span>
              <span className="font-semibold">{profile.nhis_number}</span>
            </div>
            <div className="mb-3">
              <span className="block text-gray-600 text-sm mb-1">Email</span>
              <span className="font-semibold">{profile.email}</span>
            </div>
            <div className="mb-3">
              <span className="block text-gray-600 text-sm mb-1">Phone</span>
              <span className="font-semibold">{profile.phone}</span>
            </div>
            <div className="mb-3">
              <span className="block text-gray-600 text-sm mb-1">Address</span>
              <span className="font-semibold">{profile.address}</span>
            </div>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white"
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </button>
            </div>
            {message && <div className="text-green-600 text-sm mt-3">{message}</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;