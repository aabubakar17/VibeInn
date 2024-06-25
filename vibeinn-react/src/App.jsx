import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { MantineProvider } from "@mantine/core";
import { useState } from "react";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  return (
    <MantineProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
        <main className="flex-grow overflow-y-auto">
          <Routes>
            <Route
              path="/login"
              element={<Login setLoggedIn={setLoggedIn} />}
            />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </MantineProvider>
  );
}

export default App;
