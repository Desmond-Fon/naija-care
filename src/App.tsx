import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PublicLayout from "./layout/PublicLayout";
import Landing from "./pages/landing";
import Contact from "./pages/contact";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route  path='/' element={<PublicLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/contact" element={<Contact />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
