/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import {
  getAppointmentsForAdmin,
  updateAppointmentForAdmin,
} from "../../../../lib/helpers/user";
import { useAppToast } from "../../../../lib/useAppToast";
import { auth } from "../../../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

// Appointment type definition (reuse from user appointments)
interface Appointment {
  id: string;
  name: string; // User's name or identifier
  userId?: string; // Add userId for backend updates
  userEmail?: string;
  type: "virtual" | "in-person";
  date: string;
  time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  paymentStatus: "unpaid" | "paid";
  amount: number;
  googleMeetLink?: string;
  doctor?: string;
  note?: string;
  profilePic?: string;
}

/**
 * AdminAppointments page: Lists all user appointments, allows status changes, editing payment amount, and managing Google Meet links.
 */
const AdminAppointments = () => {
  // State for appointments
  const toast = useAppToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // State for editing appointment
  const [editing, setEditing] = useState<Appointment | null>(null);
  // State for edit form
  const [form, setForm] = useState({
    amount: 0,
    googleMeetLink: "",
    status: "pending" as Appointment["status"],
    paymentStatus: "unpaid" as Appointment["paymentStatus"],
    doctor: "",
    note: "",
  });
  // State for messages
  const [message, setMessage] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const all = await getAppointmentsForAdmin(user.uid);
          setAppointments(all);
        } catch (err: any) {
          toast({
            status: "error",
            description: err?.message || "Failed to load appointment",
          });
        }
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);
  /**
   * Open edit modal for an appointment
   */
  function handleEdit(appt: Appointment) {
    setEditing(appt);
    setForm({
      amount: appt.amount,
      googleMeetLink: appt.googleMeetLink || "",
      status: appt.status,
      paymentStatus: appt.paymentStatus,
      doctor: appt.doctor || "",
      note: appt.note || "",
    });
    setMessage("");
  }

  /**
   * Update appointment details (status, amount, Google Meet link, payment status)
   */
  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setMessage("");
    try {
      await updateAppointmentForAdmin(editing.userId!, editing.id, {
        amount: form.amount,
        googleMeetLink: form.googleMeetLink || undefined,
        status: form.status,
        paymentStatus: form.paymentStatus,
        doctor: form.doctor,
        note: form.note,
      });
      setAppointments(
        appointments.map((a) =>
          a.id === editing.id
            ? {
                ...a,
                amount: form.amount,
                googleMeetLink: form.googleMeetLink || undefined,
                status: form.status,
                paymentStatus: form.paymentStatus,
                doctor: form.doctor,
                note: form.note,
              }
            : a
        )
      );
      setEditing(null);
    } catch (error: any) {
      toast({
        status: "error",
        description:
          error ||
          error?.message ||
          "Failed to update appointment. Please try again.",
      });
      setMessage("Failed to update appointment. Please try again.");
    }
  }

  /**
   * Close edit modal
   */
  function closeEdit() {
    setEditing(null);
    setMessage("");
  }

  /**
   * Generate a Google Meet link for a virtual appointment
   */
  function generateMeetLink() {
    setForm({
      ...form,
      googleMeetLink: "https://meet.google.com/generated-link",
    });
  }

  return (
    <div className="p-4 max-w-6xl mx-auto w-full">
      <h1 className="text-2xl md:text-3xl font-bold text-blue-700 mb-6">
        All User Appointments
      </h1>
      {/* Appointments Table */}
      <div className="bg-white rounded shadow p-4 overflow-x-auto">
        <h2 className="text-xl font-bold mb-4">Appointments</h2>
        {appointments.length === 0 ? (
          <div className="text-gray-500">No appointments found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">User</th>
                <th className="p-2">Doctor</th>
                <th className="p-2">Type</th>
                <th className="p-2">Date</th>
                <th className="p-2">Time</th>
                <th className="p-2">Status</th>
                <th className="p-2">Payment</th>
                <th className="p-2">Amount (₦)</th>
                <th className="p-2">Google Meet Link</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.id} className="border-b">
                  <td className="p-2 flex justify-start items-center gap-1">
                    <div className="w-10 h-10">
                      <img
                        className="w-full h-full rounded-full object-cover"
                        src={a.profilePic}
                        alt=""
                      />
                    </div>
                    {a.name}
                  </td>
                  <td className="p-2">
                    {a.doctor || (
                      <span className="text-gray-400 text-xs">Unassigned</span>
                    )}
                  </td>
                  <td className="p-2 capitalize">{a.type}</td>
                  <td className="p-2">{a.date}</td>
                  <td className="p-2">{a.time}</td>
                  <td className="p-2 capitalize">{a.status}</td>
                  <td className="p-2 capitalize">{a.paymentStatus}</td>
                  <td className="p-2">{a.amount}</td>
                  <td className="p-2">
                    {a.type === "virtual" && a.googleMeetLink ? (
                      <a
                        href={a.googleMeetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline text-xs"
                      >
                        Meet Link
                      </a>
                    ) : (
                      a.type === "virtual" && (
                        <span className="text-gray-400 text-xs">None</span>
                      )
                    )}
                  </td>
                  <td className="p-2">
                    <button
                      className="text-blue-600 underline text-xs"
                      onClick={() => handleEdit(a)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {/* Edit Appointment Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={closeEdit}
            >
              &times;
            </button>
            <h3 className="text-lg font-bold mb-4">Edit Appointment</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Doctor Assigned
                </label>
                <select
                  name=""
                  id=""
                  className="w-full border rounded px-2 py-1"
                  value={form.doctor}
                  onChange={(e) => setForm({ ...form, doctor: e.target.value })}
                  required
                >
                  <option value="" selected disabled>
                    Assign a doctor
                  </option>
                  <option value="Dr. Williams">
                    Dr. Williams (Cardiology)
                  </option>
                  <option value="Dr. Johnson">Dr. Johnson (Dermatology)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  className="w-full border rounded px-2 py-1"
                  value={form.status}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      status: e.target.value as Appointment["status"],
                    })
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Payment Status
                </label>
                <select
                  className="w-full border rounded px-2 py-1"
                  value={form.paymentStatus}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      paymentStatus: e.target
                        .value as Appointment["paymentStatus"],
                    })
                  }
                >
                  <option value="unpaid">Unpaid</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Amount (₦)
                </label>
                <input
                  type="number"
                  className="w-full border rounded px-2 py-1"
                  value={form.amount}
                  onChange={(e) =>
                    setForm({ ...form, amount: Number(e.target.value) })
                  }
                  min={0}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Doctors note
                </label>
                <input
                  type="text"
                  className="w-full border rounded px-2 py-1"
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  min={0}
                  required
                />
              </div>
              {editing.type === "virtual" && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Google Meet Link
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="w-full border rounded px-2 py-1"
                      value={form.googleMeetLink}
                      onChange={(e) =>
                        setForm({ ...form, googleMeetLink: e.target.value })
                      }
                      placeholder="Paste or generate link"
                    />
                    <button
                      type="button"
                      className="bg-blue-600 text-white px-2 py-1 rounded text-xs"
                      onClick={generateMeetLink}
                    >
                      Generate
                    </button>
                  </div>
                </div>
              )}
              {message && <div className="text-red-500 text-sm">{message}</div>}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-200"
                  onClick={closeEdit}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAppointments;
