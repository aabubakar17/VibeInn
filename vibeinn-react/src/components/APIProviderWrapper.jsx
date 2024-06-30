import React from "react";
import { APIProvider } from "@vis.gl/react-google-maps";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY;

const APIProviderWrapper = ({ children }) => (
  <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>{children}</APIProvider>
);

export default APIProviderWrapper;
