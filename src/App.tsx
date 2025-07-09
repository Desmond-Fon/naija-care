import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PublicLayout from "./layout/PublicLayout";
import Landing from "./pages/publicPages/landing";
import Contact from "./pages/publicPages/contact";
import Telemedicine from "./pages/admin/user/telemedics";
import FindCare from "./pages/publicPages/find-care";
import AuthLayout from "./layout/AuthLayout";
import { LogIn } from "lucide-react";
import Education from "./pages/publicPages/education";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/telemedicine" element={<Telemedicine />} />
            <Route path="/find-care" element={<FindCare />} />
            <Route path="/health-education" element={<Education />} />
            <Route path="/contact" element={<Contact />} />
          </Route>
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<LogIn />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
