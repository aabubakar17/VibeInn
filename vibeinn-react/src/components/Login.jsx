import { useState } from "react";
import loginGraphic from "../assets/loginGraphic.png";
import { useNavigate } from "react-router-dom";
import { Alert } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import AuthService from "../services/auth.service";

const Login = ({ loggedIn, setLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const icon = <IconInfoCircle />;

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setEmail(email);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!(password.length > 0 && email.length > 0)) {
      setMessage("Please enter email and password");
    } else {
      setMessage("");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    try {
      const response = await AuthService.login(email, password);

      if (response && response.token) {
        setLoggedIn(true);
        console.log("response:", response);
        setMessage("");
        navigate("/dashboard");
      } else {
        setMessage("Login failed. Please try again.");
      }
    } catch (error) {
      console.log("error:", error);

      setMessage("Login failed. Please try again.");
    }
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="min-h-screen flex flex-col md:flex-row justify-center space-y-10 md:space-y-0 md:space-x-16 items-center my-2 mx-5 md:mx-0 md:my-0"
    >
      <div className="md:w-1/3">
        <img src={loginGraphic} alt="Sample image" width="500" height="500" />
      </div>

      <div className="md:w-1/3 max-w-sm">
        <h1 className="text-5xl font-semi-bold text-black mb-5">Welcome</h1>
        <p className="text-slate-500 mb-5">Login to start VibeInn</p>
        <input
          className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded"
          type="text"
          placeholder="Enter Email Address"
          onChange={handleEmailChange}
          value={email}
        />
        {emailError && <p className="text-danger">{emailError}</p>}
        <input
          className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded mt-4"
          type="password"
          placeholder="Enter Password"
          onChange={handlePasswordChange}
          value={password}
        />
        <div className="mt-4 flex justify-between font-semibold text-sm"></div>
        <div className="text-center md:text-left">
          {message && (
            <Alert
              className="my-4"
              variant="light"
              color="gray"
              title="Login failed"
              icon={icon}
            >
              {message}
            </Alert>
          )}
          <button
            className="mt-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-full shadow-md hover:bg-gray-600 px-4 py-2 text-white uppercase rounded text-xs tracking-wider"
            onClick={handleSubmit}
            type="submit"
          >
            Login
          </button>
        </div>
        <div className="mt-4 font-semibold text-sm text-black text-center md:text-left">
          Don&apos;t have an account?{" "}
          <button
            className="text-blue-600 hover:underline hover:underline-offset-4"
            onClick={handleRegisterClick}
          >
            Register
          </button>
        </div>
      </div>
    </form>
  );
};

export default Login;
