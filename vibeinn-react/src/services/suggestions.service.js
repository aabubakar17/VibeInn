import ttServices from "@tomtom-international/web-sdk-services";
const TOMTOM_API_KEY = import.meta.env.VITE_REACT_APP_TOMTOM_API_KEY;

export const fetchSuggestions = async (query) => {
  try {
    const response = await ttServices.services.fuzzySearch({
      key: TOMTOM_API_KEY,
      query: query,
      language: "en-GB",
      limit: 5,
    });

    return response.results;
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    throw error;
  }
};
