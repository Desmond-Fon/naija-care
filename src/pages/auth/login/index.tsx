/* eslint-disable @typescript-eslint/no-explicit-any */
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "../../../lib/firebase";
import { getUserById } from "../../../lib/helpers/user";
import { useNavigate } from "react-router-dom";
import { useAppToast } from "../../../lib/useAppToast";

/**
 * Login page component with role selection (user/admin).
 * Includes a back button and omits header/footer for a focused experience.
 */
const Login = () => {
  const navigate = useNavigate()
  const toast = useAppToast()
  // State for form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // State for role selection
  const [isAdmin, setIsAdmin] = useState(false);
  // State for form submission
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (!email || !password) {
          // setError("Please enter both email and password.");
          toast({
            description: "Please enter both email and password.",
            status: "error",
          });
          return
        }
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userDoc = await getUserById(user.uid);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role === 'admin' && isAdmin) {
          // Redirect to admin dashboard
          toast({
            description: "Welcome to the admin dashboard!",
            status: "success",
          });
          navigate("/admin");
          setLoading(false);
        } else if (userData.role === 'user') {
          toast({
            description: "Welcome to the user dashboard!",
            status: "success",
          });
          navigate("/user");
          setLoading(false);
        } else {
          // Sign user out
          await auth.signOut();
          toast({
            description: "Access denied. You are not an admin.",
            status: "error",
          });
          setLoading(false);
        }
      } else {
        setLoading(false);
        await auth.signOut();
      }
    } catch (error: any) {
      setLoading(false);
      console.log(error)
      toast({
        description: error.message || "Access denied. You are not an admin.",
        status: "error",
      });
    }
  };

  // Handle back navigation
  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="absolute top-6 left-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium px-3 py-2 rounded-lg transition-colors bg-white shadow border border-gray-200"
          aria-label="Go back"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back
        </button>
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              id="role"
              type="checkbox"
              checked={isAdmin}
              onChange={e => setIsAdmin(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="role" className="text-gray-700 select-none">
              Login as Admin
            </label>
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-full font-semibold transition-all duration-200 shadow-lg"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;