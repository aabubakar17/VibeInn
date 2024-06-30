import React, { useState } from "react";
import { Button, Container, Text, Title, Grid } from "@mantine/core";
import Datepicker from "react-tailwindcss-datepicker";
import { useNavigate } from "react-router-dom";

const Hero = ({ initialLocation, initialEndDate, initialStartDate }) => {
  const [location, setLocation] = useState(initialLocation || "");
  const [value, setValue] = useState({
    startDate: initialStartDate || null,
    endDate: initialEndDate || null,
  });

  const navigate = useNavigate();
  const handleSearch = () => {
    if (!location || !value.startDate || !value.endDate) {
      return;
    } else {
      navigate(
        "/search?location=" +
          location +
          "&checkIn=" +
          value.startDate +
          "&checkOut=" +
          value.endDate +
          "&page=1"
      );
    }
  };

  return (
    <section className="text-black py-8">
      <Container className="text-center">
        <div className="mt-8">
          <div className=" p-4 shadow-2xl rounded-xl md:rounded-xl bg-white">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="flex justify-center md:justify-start">
                <input
                  placeholder="Search destination"
                  value={location}
                  onChange={(event) => setLocation(event.currentTarget.value)}
                  className="w-full md:max-w-none px-4 py-1.5 border border-black rounded-lg"
                />
              </div>
              <div className="flex justify-center">
                <Datepicker
                  primaryColor={"orange"}
                  useRange={false}
                  value={value}
                  onChange={setValue}
                  placeholder="Check-in ~ Check-out"
                  displayFormat={`MMM-DD`}
                  className="w-full e md:max-w-none border-black rounded-lg px-4 py-1.5"
                />
              </div>
              <div className="flex justify-center md:justify-end">
                <Button
                  onClick={handleSearch}
                  className="rounded-full text-black bg-transparent w-48 bg-gradient-to-r hover:from-pink-600 hover:to-orange-400"
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
