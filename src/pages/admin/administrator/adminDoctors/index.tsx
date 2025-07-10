import React, { useState, useRef } from "react";

// Doctor and Appointment types
interface Doctor {
  id: string;
  name: string;
  email: string;
  specialty: string;
  phone: string;
  profilePic?: string;
}

interface Appointment {
  id: string;
  patient: string;
  date: string;
  time: string;
  type: "virtual" | "in-person";
  status: "pending" | "confirmed" | "completed" | "cancelled";
}

// Dummy data for demonstration
const initialDoctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Williams",
    email: "williams@hospital.com",
    specialty: "Cardiology",
    phone: "08012345678",
    profilePic: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: "2",
    name: "Dr. Johnson",
    email: "johnson@hospital.com",
    specialty: "Dermatology",
    phone: "08087654321",
    profilePic: "https://randomuser.me/api/portraits/women/44.jpg",
  },
];

const dummyAppointments: Appointment[] = [
  {
    id: "a1",
    patient: "Jane Doe",
    date: "2024-05-10",
    time: "10:00",
    type: "virtual",
    status: "confirmed",
  },
  {
    id: "a2",
    patient: "John Smith",
    date: "2024-05-12",
    time: "14:00",
    type: "in-person",
    status: "completed",
  },
];

const AdminDoctors = () => {
  // State for doctors, search, modal, form, and selected doctor
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAppointmentsModal, setShowAppointmentsModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    specialty: "",
    phone: "",
    profilePic: "",
    preview: "",
  });
  const [message, setMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtered doctors by search
  const filteredDoctors = doctors.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  // Handle profile picture upload and preview
  function handlePicChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((f) => ({ ...f, preview: reader.result as string, profilePic: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  }

  // Handle add doctor form submission
  function handleAddDoctor(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.specialty || !form.phone) {
      setMessage("All fields are required.");
      return;
    }
    setDoctors([
      ...doctors,
      {
        id: (doctors.length + 1).toString(),
        name: form.name,
        email: form.email,
        specialty: form.specialty,
        phone: form.phone,
        profilePic: form.profilePic,
      },
    ]);
    setForm({ name: "", email: "", specialty: "", phone: "", profilePic: "", preview: "" });
    setShowAddModal(false);
    setMessage("");
  }

  // Open appointments modal for a doctor
  function handleViewAppointments(doctor: Doctor) {
    setSelectedDoctor(doctor);
    setShowAppointmentsModal(true);
  }

  // Close appointments modal
  function closeAppointmentsModal() {
    setSelectedDoctor(null);
    setShowAppointmentsModal(false);
  }

  // Render
  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by doctor name"
          className="border rounded px-3 py-2 w-full md:w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setShowAddModal(true)}
        >
          Add Doctor
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Profile</th>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Specialty</th>
              <th className="p-2">Phone</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDoctors.map((d) => (
              <tr key={d.id} className="border-b">
                <td className="p-2">
                  {d.profilePic ? (
                    <img src={d.profilePic} alt={d.name} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <span className="inline-block w-10 h-10 rounded-full bg-gray-200" />
                  )}
                </td>
                <td className="p-2 font-medium">{d.name}</td>
                <td className="p-2">{d.email}</td>
                <td className="p-2">{d.specialty}</td>
                <td className="p-2">{d.phone}</td>
                <td className="p-2">
                  <button
                    className="text-blue-600 underline text-xs"
                    onClick={() => handleViewAppointments(d)}
                  >
                    View Appointments
                  </button>
                </td>
              </tr>
            ))}
            {filteredDoctors.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-gray-400 py-4">No doctors found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Add Doctor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowAddModal(false)}
            >
              &times;
            </button>
            <h3 className="text-lg font-bold mb-4">Add Doctor</h3>
            <form onSubmit={handleAddDoctor} className="space-y-4">
              <div className="flex flex-col items-center gap-2">
                {form.preview ? (
                  <img src={form.preview} alt="Preview" className="w-16 h-16 rounded-full object-cover" />
                ) : (
                  <span className="inline-block w-16 h-16 rounded-full bg-gray-200" />
                )}
                <button
                  type="button"
                  className="text-blue-600 underline text-xs"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Upload Profile Picture
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handlePicChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  className="w-full border rounded px-2 py-1"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  className="w-full border rounded px-2 py-1"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Specialty</label>
                <input
                  type="text"
                  className="w-full border rounded px-2 py-1"
                  value={form.specialty}
                  onChange={e => setForm({ ...form, specialty: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="tel"
                  className="w-full border rounded px-2 py-1"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  required
                />
              </div>
              {message && <div className="text-red-500 text-xs">{message}</div>}
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
              >
                Add Doctor
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Appointments Modal */}
      {showAppointmentsModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={closeAppointmentsModal}
            >
              &times;
            </button>
            <h3 className="text-lg font-bold mb-4">Appointments for {selectedDoctor.name}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2">Patient</th>
                    <th className="p-2">Date</th>
                    <th className="p-2">Time</th>
                    <th className="p-2">Type</th>
                    <th className="p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dummyAppointments.map((appt) => (
                    <tr key={appt.id} className="border-b">
                      <td className="p-2">{appt.patient}</td>
                      <td className="p-2">{appt.date}</td>
                      <td className="p-2">{appt.time}</td>
                      <td className="p-2 capitalize">{appt.type}</td>
                      <td className="p-2 capitalize">{appt.status}</td>
                    </tr>
                  ))}
                  {dummyAppointments.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center text-gray-400 py-4">No appointments found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDoctors;