/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState } from "react";
import { useUser } from "../../../../context/useUser";

// Dummy data for demonstration
// const dummyUser = {
//   name: "Jane Doe",
//   email: "jane.doe@email.com",
//   wallet: 120.5,
//   appointments: [
//     { id: 1, type: "virtual", date: "2024-06-01", status: "completed" },
//     { id: 2, type: "in-person", date: "2024-06-10", status: "confirmed" },
//     { id: 3, type: "virtual", date: "2024-06-15", status: "pending" },
//   ],
//   transactions: [
//     { id: 1, type: "add", amount: 100, date: "2024-05-30" },
//     { id: 2, type: "pay", amount: -50, date: "2024-06-01" },
//   ],
// };

/**
 * Overview page component that summarizes user activities.
 * Displays user info, wallet balance, appointment stats, and recent actions.
 */
const Overview = () => {
  // State for user data (replace with real data fetching in production)
  const { user } = useUser();

  console.log(user);

  // Calculate appointment stats
  const totalAppointments =
    user && user?.appointments && user?.appointments.length;
  const completed =
    user &&
    user?.appointments &&
    user?.appointments.filter((a: any) => a.status === "completed").length;
  const upcoming =
    user &&
    user?.appointments &&
    user?.appointments.filter(
      (a: any) => a.status === "confirmed" || a.status === "pending"
    ).length;

  return (
    <div className="max-w-6xl mx-auto p-4 w-full">
      {/* User Info */}
      <div className="bg-white rounded shadow p-4 mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold mb-1">Welcome, {user?.name}</h2>
          <div className="text-gray-600 text-sm">{user?.email}</div>
          <div className="text-gray-600 font-semibold text-sm">
            {user?.nhis_number}
          </div>
        </div>
        <div className="mt-3 sm:mt-0">
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
            Wallet: ₦{user?.wallet.toFixed(2)}
          </span>
        </div>
      </div>
      {/* Appointment Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div className="bg-blue-50 rounded p-4 text-center">
          <div className="text-2xl font-bold">{totalAppointments}</div>
          <div className="text-gray-600">Total Appointments</div>
        </div>
        <div className="bg-green-50 rounded p-4 text-center">
          <div className="text-2xl font-bold">{completed}</div>
          <div className="text-gray-600">Completed</div>
        </div>
        <div className="bg-yellow-50 rounded p-4 text-center">
          <div className="text-2xl font-bold">{upcoming}</div>
          <div className="text-gray-600">Upcoming</div>
        </div>
      </div>
      {/* Recent Activities */}
      <div className="bg-white rounded shadow p-4">
        <h3 className="text-lg font-bold mb-3">Recent Activities</h3>
        <ul className="divide-y divide-gray-100">
          {user &&
            user?.transactions &&
            user?.transactions.map((tx: any) => (
              <li
                key={tx.id}
                className="py-2 flex items-center justify-between"
              >
                <span className="text-gray-700">
                  {tx.type === "add" ? "Added funds" : "Payment"}
                </span>
                <span
                  className={
                    tx.amount > 0
                      ? "text-green-600 font-semibold"
                      : "text-red-600 font-semibold"
                  }
                >
                  {tx.amount > 0 ? "+" : ""}₦{Math.abs(tx.amount)}
                </span>
                <span className="text-xs text-gray-400 ml-2">{tx.date}</span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Overview;
