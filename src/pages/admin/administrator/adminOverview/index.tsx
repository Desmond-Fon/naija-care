// Dummy data for demonstration
const stats = {
  users: 120,
  doctors: 8,
  appointments: 340,
  revenue: 250000,
};

const recentActivities = [
  { id: 1, type: "user", message: "New user registered: Jane Doe", time: "2 mins ago" },
  { id: 2, type: "appointment", message: "Appointment confirmed for John Smith", time: "10 mins ago" },
  { id: 3, type: "doctor", message: "Dr. Williams added to Cardiology", time: "1 hour ago" },
  { id: 4, type: "payment", message: "Payment received from Jane Doe (₦5,000)", time: "2 hours ago" },
];

/**
 * AdminOverview component displays key metrics and recent activities for the admin dashboard.
 */
const AdminOverview = () => {
  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Admin Overview</h2>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-100 rounded-lg p-4 flex flex-col items-center">
          <span className="text-3xl font-bold text-blue-700">{stats.users}</span>
          <span className="text-gray-700 mt-2">Total Users</span>
        </div>
        <div className="bg-green-100 rounded-lg p-4 flex flex-col items-center">
          <span className="text-3xl font-bold text-green-700">{stats.doctors}</span>
          <span className="text-gray-700 mt-2">Total Doctors</span>
        </div>
        <div className="bg-yellow-100 rounded-lg p-4 flex flex-col items-center">
          <span className="text-3xl font-bold text-yellow-700">{stats.appointments}</span>
          <span className="text-gray-700 mt-2">Appointments</span>
        </div>
        <div className="bg-purple-100 rounded-lg p-4 flex flex-col items-center">
          <span className="text-3xl font-bold text-purple-700">₦{stats.revenue.toLocaleString()}</span>
          <span className="text-gray-700 mt-2">Total Revenue</span>
        </div>
      </div>
      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
        <ul className="divide-y divide-gray-200">
          {recentActivities.map((activity) => (
            <li key={activity.id} className="py-2 flex items-center">
              <span className="inline-block w-2 h-2 rounded-full mr-3"
                style={{ backgroundColor: activity.type === "user" ? "#3b82f6" : activity.type === "doctor" ? "#10b981" : activity.type === "appointment" ? "#f59e42" : "#a78bfa" }}
              ></span>
              <span className="flex-1">{activity.message}</span>
              <span className="text-xs text-gray-400 ml-4">{activity.time}</span>
            </li>
          ))}
          {recentActivities.length === 0 && (
            <li className="py-2 text-gray-400 text-center">No recent activities.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default AdminOverview;