import NavBar from "./Components/NavBar";
import Footer from "./Components/Footer";
import { Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import Xlsx from "./Pages/Xlsx";
import H5LinkConverter from "./Pages/H5LinkConverter";
import UQTWLinkConverter from "./Pages/UQTWLinkConverter";
import EjsConverter from "./Pages/EjsConverter";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { initalizeAnalytics, trackPageView } from "./utils/analytics";
import { useEffect } from "react";

const link = {
  "/": "Home",
  "/xlsx": "Xlsx",
  "/h5Link": "H5Link",
  "/uqtwh5Link": "H5Link(UQTW)",
};

function App() {
  const location = useLocation();

  useEffect(() => {
    initalizeAnalytics();
  }, []);

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location]);

  return (
    <div className="flex flex-col h-screen px-36 min-w-[128rem]">
      <div className="h-32 shrink-0 flex z-50">
        <NavBar link={link} />
      </div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/xlsx" element={<Xlsx />} />
        <Route path="/h5Link" element={<H5LinkConverter />} />
        <Route path="/uqtwh5Link" element={<UQTWLinkConverter />} />
        <Route path="/ejs" element={<EjsConverter />} />
      </Routes>
      <Footer />
      <ToastContainer />
    </div>
  );
}

export default App;
