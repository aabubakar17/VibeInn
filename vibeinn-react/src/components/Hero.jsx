import React, { useState } from "react";
import { Button, Container, Text, Title, Grid } from "@mantine/core";
import Datepicker from "react-tailwindcss-datepicker";

const Hero = () => {
  const [location, setLocation] = useState("");
  const [value, setValue] = useState({
    startDate: null,
    endDate: null,
  });

  const handleSearch = () => {
    console.log({ location, value });
  };

  return (
    <section className="text-black py-20">
      <Container className="text-center">
        <Title className="text-4xl font-bold">
          Discover the Vibe of Your Next Stay
        </Title>
        <Text className="mt-4 text-xl">
          Find the perfect accommodation with insights from real user reviews.
        </Text>
        <div className="mt-24">
          <div className="bg-white p-4 rounded-xl md:rounded-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="flex justify-center md:justify-start">
                <input
                  placeholder="Search destination"
                  value={location}
                  onChange={(event) => setLocation(event.currentTarget.value)}
                  className="w-full md:max-w-none px-4 py-1.5 border border-white rounded-lg"
                />
              </div>
              <div className="flex justify-center">
                <Datepicker
                  primaryColor={"orange"}
                  value={value}
                  onChange={setValue}
                  placeholder="Check-in ~ Check-out"
                  className="w-full md:max-w-none"
                />
              </div>
              <div className="flex justify-center md:justify-end">
                <Button
                  onClick={handleSearch}
                  className="rounded-full text-black bg-transparent w-48 bg-gradient-to-r hover:from-pink-600 hover:to-yellow-400"
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
