import { useState } from "react";
import loginGraphic from "../assets/loginGraphic.png";
import { Alert } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import AuthService from "../services/auth.service";

const Register = () => {
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [message, setMessage] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const icon = <IconInfoCircle />;

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setNewPassword(password);

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (passwordRegex.test(password)) {
      setPasswordError("");
    }
  };

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setNewEmail(email);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
      setEmailError("");
    }
  };

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setPasswordError(
        "Password must be at least 8 characters, including at least 1 uppercase character, a number, and a special character"
      );
      return;
    }
    e;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    if (emailRegex.test(newEmail) && passwordRegex.test(newPassword)) {
      try {
        const response = await AuthService.register(
          firstName,
          lastName,
          newEmail,
          newPassword
        );
        if (response && response.token) {
          setIsRegistered(true);
          console.log("response", response);
          /* navigate("/saved-locations"); */
        } else {
          setMessage("Registration failed. Please try again.");
        }
      } catch (error) {
        setMessage("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="min-h-screen flex flex-col md:flex-row justify-center space-y-10 md:space-y-0 md:space-x-16 items-center my-2 mx-5 md:mx-0 md:my-0"
      >
        <div className="md:w-1/3 flex ">
          <img src={loginGraphic} alt="Sample image" width="500" height="500" />
        </div>

        <div className="md:w-1/3 max-w-sm">
          <h1 className="text-4xl font-serif-bold text-black mb-5">
            Join to start vibeInn
          </h1>
          <p className="text-slate-500 mb-5">
            Make an account & find your place to vibe
          </p>
          <div className="mb-2">
            <label className="font-sans-bold">First Name:</label>
          </div>

          <input
            className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded mb-4"
            type="text"
            placeholder="Enter your first name"
            onChange={handleFirstNameChange}
          />
          <div className="mb-2">
            <label className="font-sans-bold">Last Name:</label>
          </div>
          <input
            className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded mb-4"
            type="text"
            placeholder="Enter your last name"
            onChange={handleLastNameChange}
          />
          <div className="mb-2">
            <label className="font-sans-bold">Email:</label>
          </div>
          <input
            className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded mb-4"
            type="text"
            placeholder="Enter your Email"
            onChange={handleEmailChange}
          />
          {emailError && <p className="text-danger">{emailError}</p>}
          <div className="mb-2">
            <label className="font-sans-bold ">Password:</label>
          </div>

          <input
            className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded"
            type="password"
            placeholder="Enter your Password"
            onChange={handlePasswordChange}
          />
          {passwordError && <p className="text-danger">{passwordError}</p>}
          <div className="text-center md:text-left">
            {message && (
              <Alert
                className="my-4"
                variant="light"
                color="gray"
                title="Registration failed"
                icon={icon}
              >
                {message}
              </Alert>
            )}
            <button
              className="m-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-full shadow-md hover:bg-gray-600 px-4 py-2 text-white uppercase rounded text-xs tracking-wider "
              type="submit"
              onClick={handleSubmit}
            >
              Register
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Register;
