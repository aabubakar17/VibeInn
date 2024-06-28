import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LandingPage from "./components/LandingPage";
import { MantineProvider } from "@mantine/core";
import { useState } from "react";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  return (
    <MantineProvider>
      <Navbar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      <main className="flex-grow  overflow-hidden">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login setLoggedIn={setLoggedIn} />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
      <Footer />
    </MantineProvider>
  );
}

export default App;
