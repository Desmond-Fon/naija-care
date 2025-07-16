/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  getAdminStats,
  getRecentActivities,
} from "../../../../lib/helpers/user";
import { useAppToast } from "../../../../lib/useAppToast";
import { auth } from "../../../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

const AdminOverview = () => {
  const toast = useAppToast();
  const [stats, setStats] = useState<any>({
    users: 0,
    doctors: 0,
    appointments: 0,
    revenue: 0,
  });
  const [activities, setActivities] = useState<any>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [activitiesError, setActivitiesError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setActivitiesLoading(true);
        setActivitiesError("");

        try {
          const data = await getAdminStats(user.uid);
          setStats(data);
        } catch (err: any) {
          toast({
            status: "error",
            description: err?.message || "Failed to load statistics",
          });
        } finally {
          setActivitiesLoading(false);
        }
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setActivitiesLoading(true);
        setActivitiesError("");

        try {
          const acts = await getRecentActivities(user.uid, 10);
          setActivities(acts);
        } catch (err: any) {
          toast({
            status: "error",
            description: err?.message || "Failed to load recent activities",
          });
          setActivitiesError("Failed to load recent activities.");
        } finally {
          setActivitiesLoading(false);
        }
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  const activityColors: Record<string, string> = {
    user: "#3b82f6", // blue
    appointment: "#f59e42", // orange
    doctor: "#10b981", // green
    payment: "#a78bfa", // purple
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Admin Overview</h2>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-100 rounded-lg p-4 flex flex-col items-center">
          <span className="text-3xl font-bold text-blue-700">
            {stats.users}
          </span>
          <span className="text-gray-700 mt-2">Total Users</span>
        </div>
        <div className="bg-green-100 rounded-lg p-4 flex flex-col items-center">
          <span className="text-3xl font-bold text-green-700">
            {stats.doctors}
          </span>
          <span className="text-gray-700 mt-2">Total Doctors</span>
        </div>
        <div className="bg-yellow-100 rounded-lg p-4 flex flex-col items-center">
          <span className="text-3xl font-bold text-yellow-700">
            {stats.appointments}
          </span>
          <span className="text-gray-700 mt-2">Appointments</span>
        </div>
        <div className="bg-purple-100 rounded-lg p-4 flex flex-col items-center">
          <span className="text-3xl font-bold text-purple-700">
            ₦{stats.revenue.toLocaleString()}
          </span>
          <span className="text-gray-700 mt-2">Total Revenue</span>
        </div>
      </div>
      {/* Recent Activities */}
      <div className="recent-activities" style={{ marginTop: 32 }}>
        <h3>Recent Activities</h3>
        {activitiesLoading ? (
          <p>Loading activities...</p>
        ) : activitiesError ? (
          <p style={{ color: "red" }}>{activitiesError}</p>
        ) : (
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 24,
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}
          >
            {activities.length === 0 ? (
              <p>No recent activities.</p>
            ) : (
              <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {activities.map((a: any, idx: any) => (
                  <li
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 16,
                    }}
                  >
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: activityColors[a.type] || "#ccc",
                        marginRight: 12,
                        display: "inline-block",
                      }}
                    ></span>
                    <span style={{ flex: 1 }}>{a.message}</span>
                    <span
                      style={{ color: "#888", fontSize: 14, marginLeft: 16 }}
                    >
                      {timeAgo(a.timestamp)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper to format time ago
function timeAgo(dateStr: string) {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return `${diff} sec${diff !== 1 ? "s" : ""} ago`;
  if (diff < 3600)
    return `${Math.floor(diff / 60)} min${
      Math.floor(diff / 60) !== 1 ? "s" : ""
    } ago`;
  if (diff < 86400)
    return `${Math.floor(diff / 3600)} hour${
      Math.floor(diff / 3600) !== 1 ? "s" : ""
    } ago`;
  return `${Math.floor(diff / 86400)} day${
    Math.floor(diff / 86400) !== 1 ? "s" : ""
  } ago`;
}

export default AdminOverview;
