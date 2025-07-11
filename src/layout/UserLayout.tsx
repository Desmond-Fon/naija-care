import { useEffect, useState } from "react";
import {
  LogOut,
  //   User,
  LayoutDashboard,
  Calendar,
  Wallet,
  Menu,
  X,
  UserRoundPen,
  Cog,
} from "lucide-react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAppToast } from "../lib/useAppToast";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useUser } from "../context/useUser";

/**
 * Responsive user dashboard layout with sidebar (desktop) and top nav (mobile).
 * Sidebar contains navigation and profile/logout; main area renders Outlet.
 */
const navItems = [
  { label: "Overview", icon: LayoutDashboard, href: "/user" },
  { label: "Appointment", icon: Calendar, href: "/user/appointments" },
  { label: "Wallet", icon: Wallet, href: "/user/wallet" },
  { label: "Profile", icon: UserRoundPen, href: "/user/profile" },
];

const UserLayout = () => {
  const toast = useAppToast();
  const navigate = useNavigate();
  const {user} = useUser()
  // State for active nav item
  const [active, setActive] = useState("Overview");
  // State for profile dropdown
  const [profileOpen, setProfileOpen] = useState(false);
  // State for mobile sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Handle logout (replace with real logic)
  const handleLogout = () => {
    toast({
      status: "info",
      description: "Log out successful",
    });
    signOut(auth);
    navigate("/");
    // Redirect or clear auth state here
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!user) {
        toast({
          status: "error",
          description: "Please login to access your dashboard",
        });
        navigate("/");
      }
    }, 5000); // wait 800ms (or adjust depending on how fast your user fetch runs)

    return () => clearTimeout(timeout);
  }, [user, toast, navigate]);
  

  return (
    <div className="h-screen w-screen flex bg-gray-50 overflow-hidden">
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200 flex items-center justify-between px-4 py-3 shadow-sm">
        <button onClick={() => setSidebarOpen(true)} aria-label="Open menu">
          <Menu className="w-6 h-6 text-blue-700" />
        </button>
        <div className="text-xl font-bold text-blue-700">NaijaCare</div>
        <button onClick={() => setProfileOpen((v) => !v)} aria-label="Profile">
          <Cog className="w-6 h-6 text-blue-700" />
        </button>
        {/* Profile dropdown (mobile) */}
        {profileOpen && (
          <div className="absolute right-4 top-14 w-40 bg-white border rounded-lg shadow-lg z-40">
            <Link to={"/user/profile"}>
              <button
                className="w-full text-left px-4 py-3 hover:bg-blue-50 text-gray-700"
                onClick={() => {
                  setProfileOpen(false);
                }}
              >
                View Profile
              </button>
            </Link>
            <button
              className="w-full text-left px-4 py-3 hover:bg-blue-50 text-red-600 flex items-center gap-2"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        )}
      </div>
      {/* Sidebar (desktop) & Drawer (mobile) */}
      <aside
        className={`fixed md:static top-0 left-0 z-40 h-screen w-64 bg-white border-r border-gray-200 flex flex-col py-8 px-4 min-h-0 flex-shrink-0 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:flex md:w-64 md:h-screen md:py-8 md:px-4`}
        style={{
          boxShadow: sidebarOpen ? "0 2px 8px rgba(0,0,0,0.08)" : undefined,
        }}
      >
        {/* Close button (mobile) */}
        <div className="md:hidden flex justify-end mb-4">
          <button onClick={() => setSidebarOpen(false)} aria-label="Close menu">
            <X className="w-6 h-6 text-blue-700" />
          </button>
        </div>
        <div className="mb-10 text-2xl font-bold text-blue-700 text-center hidden md:block">
          NaijaCare
        </div>
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <Link to={item.href} key={item.label} tabIndex={-1}>
              <button
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-blue-50 transition-colors ${
                  active === item.label ? "bg-blue-100 text-blue-700" : ""
                }`}
                onClick={() => {
                  setActive(item.label);
                  setSidebarOpen(false);
                }}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            </Link>
          ))}
        </nav>
        {/* Profile & Logout (desktop) */}
        <div className="mt-10 border-t pt-6 hidden md:block">
          <div className="relative">
            <button
              className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-blue-50 text-gray-700 font-medium"
              onClick={() => setProfileOpen((v) => !v)}
            >
              <Cog className="w-5 h-5" />
              Action
            </button>

            {profileOpen && (
              <div className="absolute top-[-120px] left-0 mt-2 w-full bg-white border rounded-lg shadow-lg z-20">
                <Link to={"/user/profile"}>
                  <button
                    className="w-full text-left px-4 py-3 hover:bg-blue-50 text-gray-700"
                    onClick={() => {
                      setProfileOpen(false);
                    }}
                  >
                    View Profile
                  </button>
                </Link>
                <button
                  className="w-full text-left px-4 py-3 hover:bg-blue-50 text-red-600 flex items-center gap-2"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
      {/* Main Content (scrollable) */}
      <main className="flex-1 h-screen min-h-0 overflow-y-auto p-4 md:p-8 pt-16 md:pt-8">
        <Outlet />
      </main>
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default UserLayout;
