import React from "react";
import "./App.css";
import { useLocation } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import About from "./pages/about";
import PolicyTerms from "./pages/privacy";
import Contact from "./pages/contact";
import Home from "./pages/home";
import GoogleGeminiEffectDemo from "./pages/initial";
import Search from "./pages/search";
import PageNotFound from "./pages/404";
import Maintanance from "./pages/maintainance";
import Loader from "./components/loader/loader";
import { Analytics } from "@vercel/analytics/react";

function Main() {
  const location = useLocation();
  const isRootPath = location.pathname === "/";

  return isRootPath ? (
    <div className="p-0 m-0 flex flex-col bg-black">
      <Routes>
        <Route path="/" element={<GoogleGeminiEffectDemo />} />
      </Routes>
    </div>
  ) : (
    <div className="p-0 m-0 flex flex-col bg-black">
      <Navbar />
      {/* <NavbarNew/> */}
      <div style={{ minHeight: "40rem" }}>
        <Routes>
          <Route path="/search" element={<Search />} />
          <Route path="/loader" element={<Loader />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<PolicyTerms />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<PageNotFound />} />
          <Route
            path="/watch/:animeId/:animeTitle/:episodeNumber"
            element={<Maintanance />}
          />
          <Route path="/watch/:animeId/" element={<Maintanance />} />{" "}
        </Routes>
      </div>
      {/* <NewFooter/> */}
      <Footer />
      <Analytics />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Main />
    </Router>
  );
}

export default App;
