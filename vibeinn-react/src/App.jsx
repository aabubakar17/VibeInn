import { Route, Routes, useLocation } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LandingPage from "./components/LandingPage";
import SearchResults from "./components/SearchResults";
import { MantineProvider } from "@mantine/core";
import { useState } from "react";
import HotelPage from "./components/HotelPage";
import Dashboard from "./components/Dashboard";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const location = useLocation();

  // Check if the current location is "/"
  const isHomePage = location.pathname === "/";

  return (
    <MantineProvider>
      <Navbar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      <main className="flex-grow overflow-hidden ">
        <Routes>
          <Route
            path="/"
            element={
              <LandingPage loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
            }
          />
          <Route path="/login" element={<Login setLoggedIn={setLoggedIn} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<SearchResults />} />
          <Route
            path="/hotelpage/:id"
            element={<HotelPage loggedIn={loggedIn} />}
          />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
      {/* Render Footer only if it's not the homepage */}
      {!isHomePage && <Footer />}
    </MantineProvider>
  );
}

export default App;
