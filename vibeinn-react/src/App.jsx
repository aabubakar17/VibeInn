import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LandingPage from "./components/LandingPage";
import SearchResults from "./components/SearchResults";
import { MantineProvider } from "@mantine/core";
import { useState } from "react";
import HotelPage from "./components/HotelPage";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  return (
    <MantineProvider>
      <Navbar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      <main className="flex-grow  overflow-hidden bg-gray-100">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login setLoggedIn={setLoggedIn} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<SearchResults />} />
          <Route
            path="/hotelpage/:id"
            element={<HotelPage loggedIn={loggedIn} />}
          />
        </Routes>
      </main>
      <Footer />
    </MantineProvider>
  );
}

export default App;
