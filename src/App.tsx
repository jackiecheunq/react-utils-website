import NavBar from "./Components/NavBar";
import Footer from "./Components/Footer";
import { Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import Xlsx from "./Pages/Xlsx";
import H5LinkConverter from "./Pages/H5LinkConverter";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const link = {
  "/": "Home",
  "/xlsx": "Xlsx",
  "/h5Link": "H5Link",
};

function App() {
  return (
    <div className="flex flex-col h-screen px-36 min-w-[128rem]">
      <div className="h-32 shrink-0 flex z-50">
        <NavBar link={link} />
      </div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/xlsx" element={<Xlsx />} />
        <Route path="/h5Link" element={<H5LinkConverter />} />
      </Routes>
      <Footer />
      <ToastContainer />
    </div>
  );
}

export default App;
