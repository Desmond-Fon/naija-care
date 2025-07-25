/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useUser } from "../../../../context/useUser";
import { useAppToast } from "../../../../lib/useAppToast";
import {
  addAppointmentToCurrentUser,
  rescheduleAppointmentForCurrentUser,
  deleteAppointmentForCurrentUser,
  removeFundsFromWallet,
  updateUserAppointment,
} from "../../../../lib/helpers/user";

// Appointment type definition
interface Appointment {
  id: string;
  type: "virtual" | "in-person";
  date: string;
  time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  paymentStatus: "unpaid" | "paid";
  googleMeetLink?: string;
  message: string;
  amount?: number | any;
  profilePic?: string;
}

// Main Appointments component
const Appointments = () => {
  // State for appointments
  const { user, setRefetch, refetch } = useUser();
  const toast = useAppToast();
  const [appointments, setAppointments] = useState<Appointment[]>(
    user?.appointments || []
  );
  // State for modal visibility
  const [showModal, setShowModal] = useState(false);
  // State for booking form
  const [form, setForm] = useState({
    type: "virtual" as "virtual" | "in-person",
    date: "",
    time: "",
    message: "",
  });
  // State for selected appointment (for reschedule/delete)
  const [selected, setSelected] = useState<Appointment | null>(null);
  // State for payment modal
  const [showPayment, setShowPayment] = useState(false);
  // State for payment method
  const [paymentMethod, setPaymentMethod] = useState("");
  // State for error/success messages
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle opening booking modal
  function handleBook() {
    setForm({ type: "virtual", date: "", time: "", message: "" });
    setShowModal(true);
    setMessage("");
  }

  // Handle booking appointment
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.date || !form.time) {
      toast({
        status: "error",
        description: "Please fill all fiends.",
      });
      setMessage("Please fill all fields.");
      return;
    }
    setMessage("");
    setLoading(false)
    try {
      await addAppointmentToCurrentUser(
        form.message, // message (not collected in form, so pass empty)
        user?.name, // name (not collected in form, so pass empty)
        user?.profilePic,
        form.date,
        form.time,
        form.type,
        "pending",
        "unpaid"
      );
      const newAppointment: Appointment = {
        id: Date.now().toString(),
        type: form.type,
        date: form.date,
        time: form.time,
        status: "pending",
        paymentStatus: "unpaid",
        message: form.message,
      };
      setAppointments([newAppointment, ...appointments]);
      setShowModal(false);
      setMessage("");
      setRefetch(!refetch);
      toast({
        status: "success",
        description:
          "Appointment booked successfully, please check for confirmation.",
      });
      setLoading(false)
    } catch (error: any) {
      toast({
        status: "error",
        description:
          error ||
          error?.message ||
          "Failed to book appointment. Please try again.",
      });
            setLoading(false);
      setMessage("Failed to book appointment. Please try again.");
    }
  }

  // Handle reschedule
  function handleReschedule(appt: Appointment) {
    setSelected(appt);
    setForm({
      type: appt.type,
      date: appt.date,
      time: appt.time,
      message: appt.message,
    });
    setShowModal(true);
    setMessage("");
  }

  // Handle update after reschedule
  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.date || !form.time || !selected) {
      setMessage("Please fill all fields.");
      return;
    }
    setMessage("");
    try {
      await rescheduleAppointmentForCurrentUser(
        selected.id,
        form.date,
        form.time,
        form.type,
        form.message
      );
      setAppointments(
        appointments.map((a) =>
          a.id === selected.id ? { ...a, ...form, status: "pending" } : a
        )
      );
      setShowModal(false);
      setSelected(null);
      setRefetch(!refetch);
    } catch (error: any) {
      toast({
        status: "error",
        description:
          error ||
          error?.message ||
          "Failed to book appointment. Please try again.",
      });
      setMessage("Failed to reschedule appointment. Please try again.");
    }
  }

  // Handle delete
  async function handleDelete(id: string) {
    setMessage("");
    try {
      await deleteAppointmentForCurrentUser(id);
      setAppointments(appointments.filter((a) => a.id !== id));
      setRefetch(!refetch);
      toast({
        status: "success",
        description: "Appointment deleted successfully.",
      });
    } catch (error: any) {
      toast({
        status: "error",
        description:
          error ||
          error?.message ||
          "Failed to book appointment. Please try again.",
      });
      setMessage("Failed to delete appointment. Please try again.");
    }
  }

  // Simulate admin confirming appointment
  // function simulateAdminConfirm(id: string) {
  //   setAppointments(
  //     appointments.map((a) =>
  //       a.id === id
  //         ? {
  //             ...a,
  //             status: "confirmed",
  //             googleMeetLink:
  //               a.type === "virtual"
  //                 ? "https://meet.google.com/example-link"
  //                 : undefined,
  //           }
  //         : a
  //     )
  //   );
  // }

  // Handle payment
  function handlePayment(id: string) {
    setSelected(appointments.find((a) => a.id === id) || null);
    setShowPayment(true);
    setPaymentMethod("");
    setMessage("");
  }

  // Simulate payment
  const handlePay = async () => {
    if (!paymentMethod) {
      setMessage("Select a payment method.");
      return;
    }
    if (selected) {
      try {
        await removeFundsFromWallet(
          selected.amount,
          paymentMethod as "card" | "blockchain" | "wallet"
        );
        await updateUserAppointment(selected.id, {
          paymentStatus: "paid",
        });
        setAppointments(
          appointments.map((a) =>
            a.id === selected.id ? { ...a, paymentStatus: "paid" } : a
          )
        );
        setRefetch(!refetch);
        toast({
          status: "success",
          description: "Payment successful.",
        });
        setShowPayment(false);
        setSelected(null);
        setMessage("");
      } catch (error: any) {
        toast({
          status: "error",
          description:
            error ||
            error?.message ||
            "Failed to make payment. Please try again.",
        });
        setMessage("Failed to make payment. Please try again.");
      }
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto w-full">
      <h1 className="text-2xl md:text-3xl font-bold text-blue-700 mb-6">
        Appointment
      </h1>
      {/* Book Appointment Button */}
      <div className="flex justify-end mb-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleBook}
        >
          Book Appointment
        </button>
      </div>
      {/* Appointment List */}
      <div className="bg-white rounded shadow p-4 overflow-x-auto">
        <h2 className="text-xl font-bold mb-4">My Appointments</h2>
        {appointments.length === 0 ? (
          <div className="text-gray-500">No appointments yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">Type</th>
                <th className="p-2">Date</th>
                <th className="p-2">Time</th>
                <th className="p-2">Status</th>
                <th className="p-2">Payment</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.id} className="border-b">
                  <td className="p-2 text-center capitalize">{a.type}</td>
                  <td className="p-2 text-center">{a.date}</td>
                  <td className="p-2 text-center">{a.time}</td>
                  <td className="p-2 text-center capitalize">
                    {a.status}
                    {a.status === "confirmed" &&
                      a.type === "virtual" &&
                      a.googleMeetLink && (
                        <div>
                          <a
                            href={a.googleMeetLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline text-xs block mt-1"
                          >
                            Google Meet Link
                          </a>
                        </div>
                      )}
                  </td>
                  <td className="p-2 text-center capitalize">
                    {a.paymentStatus}
                  </td>
                  <td className="p-2 text-center flex flex-col gap-1">
                    {/* {a.status === "pending" && (
                      <button
                        className="text-green-600 text-xs underline"
                        onClick={() => simulateAdminConfirm(a.id)}
                      >
                        Simulate Admin Confirm
                      </button>
                    )} */}
                    {a.status === "confirmed" &&
                      a.paymentStatus === "unpaid" && (
                        <button
                          className="bg-yellow-500 text-white px-2 py-1 rounded text-xs"
                          onClick={() => handlePayment(a.id)}
                        >
                          Pay
                        </button>
                      )}
                    <button
                      className="text-blue-600 text-xs underline"
                      onClick={() => handleReschedule(a)}
                    >
                      Reschedule
                    </button>
                    <button
                      className="text-red-600 text-xs underline"
                      onClick={() => handleDelete(a.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {/* Booking Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => {
                setShowModal(false);
                setSelected(null);
              }}
            >
              &times;
            </button>
            <h3 className="text-lg font-bold mb-4">
              {selected ? "Reschedule Appointment" : "Book Appointment"}
            </h3>
            <form
              onSubmit={selected ? handleUpdate : handleSubmit}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  className="w-full border rounded px-2 py-1"
                  value={form.type}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      type: e.target.value as "virtual" | "in-person",
                    })
                  }
                >
                  <option value="virtual">Virtual</option>
                  <option value="in-person">In-Person</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  className="w-full border rounded px-2 py-1"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Time</label>
                <input
                  type="time"
                  className="w-full border rounded px-2 py-1"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Additional Info
                </label>
                <input
                  type="text"
                  className="w-full border rounded px-2 py-1"
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  required
                />
              </div>
              {message && <div className="text-red-500 text-sm">{message}</div>}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-200"
                  onClick={() => {
                    setShowModal(false);
                    setSelected(null);
                  }}
                >
                  Cancel
                </button>
                {loading ? <button
                  // type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white"
                >
                  Loading...
                </button> :<button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white"
                >
                  {selected ? "Update" : "Book"}
                </button>}
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Payment Modal */}
      {showPayment && selected && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPayment(false)}
            >
              &times;
            </button>
            <h3 className="text-lg font-bold mb-4">Make Payment</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Payment Method
              </label>
              <select
                className="w-full border rounded px-2 py-1"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="">Select</option>
                <option value="card">Card</option>
                <option value="blockchain">Blockchain</option>
                <option value="wallet">Wallet</option>
              </select>
            </div>
            <h3 className="text-lg font-bold mb-4">
              Amount : ₦{Math.abs(selected?.amount)}
            </h3>

            {message && (
              <div className="text-red-500 text-sm mb-2">{message}</div>
            )}
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-200"
                onClick={() => setShowPayment(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white"
                onClick={handlePay}
              >
                Pay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
