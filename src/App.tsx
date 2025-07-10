import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PublicLayout from "./layout/PublicLayout";
import Landing from "./pages/publicPages/landing";
import Contact from "./pages/publicPages/contact";
import FindCare from "./pages/publicPages/find-care";
import AuthLayout from "./layout/AuthLayout";
import Education from "./pages/publicPages/education";
import Login from "./pages/auth/login";
import UserLayout from "./layout/UserLayout";
import Appointments from "./pages/admin/user/appointments";
import Wallet from "./pages/admin/user/wallet";
import Overview from "./pages/admin/user/overview";
import Profile from "./pages/admin/user/profile";
import AdminOverview from "./pages/admin/administrator/adminOverview";
import AdminAppointments from "./pages/admin/administrator/adminAppointments";
import AdminUsers from "./pages/admin/administrator/adminUsers";
import AdminLayout from "./layout/AdminLayout";
import AdminDoctors from "./pages/admin/administrator/adminDoctors";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/find-care" element={<FindCare />} />
            <Route path="/health-education" element={<Education />} />
          </Route>
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
          </Route>
          <Route path="/user" element={<UserLayout />}>
            <Route path="" element={<Overview />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="wallet" element={<Wallet />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="" element={<AdminOverview />} />
            <Route path="appointments" element={<AdminAppointments />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="doctors" element={<AdminDoctors />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
