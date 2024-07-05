import React, { useState } from "react";
import { Button, Container, List } from "@mantine/core";
import Datepicker from "react-tailwindcss-datepicker";
import { useNavigate, useParams } from "react-router-dom";
import { fetchSuggestions } from "../services/suggestions.service";
import { PiCity } from "react-icons/pi"; // Import the PiCity icon

const Hero = ({ initialLocation, initialEndDate, initialStartDate }) => {
  console.log(initialLocation);
  const [location, setLocation] = useState(initialLocation || "");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [input, setInput] = useState(initialLocation || "");
  const [value, setValue] = useState({
    startDate: initialStartDate || null,
    endDate: initialEndDate || null,
  });

  const navigate = useNavigate();

  const handleSearch = () => {
    if (selectedSuggestion && !location) {
      setLocation(selectedSuggestion.address.freeformAddress);
    }

    if (!location || !value.startDate || !value.endDate) {
      return;
    } else {
      console.log(location);
      navigate(
        "/search?location=" +
          encodeURIComponent(location) +
          "&checkIn=" +
          value.startDate +
          "&checkOut=" +
          value.endDate +
          "&page=1"
      );
    }
  };

  const handleSuggestionClick = (suggestion) => {
    console.log(suggestion.address.freeformAddress);
    setInput(suggestion.address.freeformAddress);
    setSelectedSuggestion(suggestion);
    setLocation(suggestion.address.freeformAddress);
    setSuggestions([]);
  };

  const handleInputChange = (event) => {
    const { value } = event.target;
    setInput(value);
    if (value.trim()) {
      fetchSuggestions(value)
        .then((response) => {
          setSuggestions(response);
        })
        .catch(() => {
          setSuggestions([]);
        });
    } else {
      setSuggestions([]);
    }
  };
  const renderSuggestions = (suggestions, handleSuggestionClick) => {
    if (suggestions.length === 0) return null;

    return (
      <List className="absolute w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10 mt-1">
        {suggestions.map((suggestion, index) => (
          <List.Item
            key={index}
            onClick={() => handleSuggestionClick(suggestion)}
            className="cursor-pointer px-4 py-2 hover:bg-gray-200 flex items-center"
            style={{ width: "100%" }}
          >
            <div className="flex items-center w-full">
              <PiCity className="mr-2 text-black-500" />{" "}
              {/* Adjust icon size and color */}
              <span className="text-black truncate">
                {suggestion.address.freeformAddress}
              </span>{" "}
              {/* Adjust text color */}
            </div>
          </List.Item>
        ))}
      </List>
    );
  };

  return (
    <section className="text-black py-8">
      <Container className="text-center">
        <div className="mt-8">
          <div className="p-4 shadow-2xl rounded-xl bg-transparent">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="relative flex justify-center md:justify-start">
                <div className="w-full relative">
                  <input
                    placeholder="Search destination"
                    value={input}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-none md:max-w-none px-4 py-1.5 border border-gray-300 rounded-lg"
                  />

                  {renderSuggestions(suggestions, handleSuggestionClick)}
                </div>
              </div>
              <div className="flex justify-center">
                <Datepicker
                  primaryColor={"sky"}
                  inputContai
                  useRange={true}
                  value={value}
                  onChange={setValue}
                  popoverDirection="down"
                  placeholder="Check-in ~ Check-out"
                  displayFormat={`MMM-DD`}
                  inputClassName="w-full bg-transparent md:max-w-none border-black rounded-lg px-4 py-1.5"
                />
              </div>
              <div className="flex justify-center">
                <Button
                  onClick={handleSearch}
                  variant="gradient"
                  gradient={{ deg: 133, from: "blue", to: "cyan" }}
                  size="sm"
                  radius="md"
                  className="w-full md:max-w-none bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                >
                  Discover ➔
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Hero;
