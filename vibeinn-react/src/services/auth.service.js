import axios from "axios";

const API_URL_AUTH = import.meta.env.VITE_REACT_APP_API_URL_AUTH;

const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL_AUTH}/login`, {
      email,
      password,
    });

    if (response.data.token) {
      localStorage.setItem(`user`, JSON.stringify(response.data));
    }

    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};

const isLoggedIn = () => {
  // Check if token exists in localStorage
  return !!localStorage.getItem(`user`);
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem(`user`));
};

const register = async (firstName, lastName, email, password) => {
  try {
    const response = await axios.post(`${API_URL_AUTH}/register`, {
      firstName,
      lastName,
      email,
      password,
    });

    if (response.data.token) {
      localStorage.setItem(`user`, JSON.stringify(response.data));
    }

    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};

const logout = () => {
  localStorage.removeItem(`user`);
};

const authService = {
  login,
  register,
  logout,
  isLoggedIn,
  getCurrentUser,
};

export default authService;
