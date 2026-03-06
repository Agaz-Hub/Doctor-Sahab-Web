import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import About from "./pages/About";
import Appointment from "./pages/Appointment";
import Contact from "./pages/Contact";
import Doctors from "./pages/Doctors";
import Login from "./pages/Login";
import MyAppointments from "./pages/MyAppointments";
import MyProfile from "./pages/MyProfile";
import DocAI from "./pages/DocAI";
import Footer from "./components/Footer";
import { ToastContainer, toast } from "react-toastify";

function App() {
  return (
    <div className="min-h-screen">
      <ToastContainer />
      <Navbar />
      <div className="mx-4 sm:mx-6 md:mx-8 lg:mx-[8%] xl:mx-[10%] max-w-[1400px] 2xl:mx-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/appointment/:docId" element={<Appointment />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/doctors/:speciality" element={<Doctors />} />
          <Route path="/login" element={<Login />} />
          <Route path="/my-appointments" element={<MyAppointments />} />
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/docai" element={<DocAI />} />
        </Routes>
        <Footer />
      </div>
    </div>
  );
}

export default App;
