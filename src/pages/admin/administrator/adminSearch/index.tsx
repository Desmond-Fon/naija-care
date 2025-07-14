/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { getAllUsers } from "../../../../lib/helpers/user";
import { auth } from "../../../../lib/firebase";
import { useAppToast } from "../../../../lib/useAppToast";

const AdminSearch = () => {
  const toast = useAppToast();
  const [users, setUsers] = useState<any>([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [adminId, setAdminId] = useState<string | null>(null);

  // Get admin ID on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setAdminId(user.uid);
    });
    return () => unsubscribe();
  }, []);

  // Trigger search automatically with debounce (300ms)
  useEffect(() => {
    if (!adminId || search.trim().length < 3) {
      setUsers([]); // Clear users if search too short
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const allUsers = await getAllUsers();
        const filtered = allUsers.filter(
          (user: any) =>
            user.role === "user" &&
            // user.hospitalId === adminId &&
            user.nhis_number?.toLowerCase().includes(search.toLowerCase())
        );
        setUsers(filtered);
      } catch (err: any) {
        toast({
          status: "error",
          description: err?.message || "Failed to load users",
        });
      }
    }, 300); // Debounce to avoid querying on every keystroke

    return () => clearTimeout(timeout);
  }, [search, adminId]);

  const handleViewDetails = (user: any) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedUser(null);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 w-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
        <h2 className="text-xl font-bold">Search Patient by NHIS Number</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Enter NHIS Number"
            className="border rounded px-2 py-1 w-full sm:w-56"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded shadow p-4 overflow-x-auto">
        {search.length < 3 ? (
          <div className="text-gray-400">
            Enter at least 3 characters to search by NHIS number.
          </div>
        ) : users.length === 0 ? (
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
              {users.map((user: any) => (
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

      {/* Details Modal */}
      {showDetailsModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative overflow-auto max-h-[90vh]">
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
              {selectedUser.appointments?.map((h: any, idx: number) => (
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
                {selectedUser.appointments?.map((a: any, idx: number) => (
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

export default AdminSearch;
