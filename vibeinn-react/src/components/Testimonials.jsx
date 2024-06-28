import React from "react";
import {
  Button,
  Container,
  Text,
  Title,
  Card,
  Image,
  Group,
  Input,
  Grid,
} from "@mantine/core";
import { FaStar } from "react-icons/fa";
const Testimonials = () => {
  return (
    <section className="py-20">
      <Container>
        <Title className="text-center text-3xl font-bold">
          What Our Users Say
        </Title>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          <Card className="p-6 bg-glass-white backdrop-blur-md rounded-lg shadow-glass">
            <Text className="text-center font-semibold">Jane Doe</Text>
            <Text className="text-center mt-2">
              "VibeInn helped me find the perfect hotel for my vacation. The
              sentiment analysis is spot on!"
            </Text>
            <div className="flex justify-center mt-4">
              <FaStar className="text-yellow-500" />
              <FaStar className="text-yellow-500" />
              <FaStar className="text-yellow-500" />
              <FaStar className="text-yellow-500" />
              <FaStar className="text-yellow-500" />
            </div>
          </Card>
          <Card className="p-6 bg-glass-white backdrop-blur-md rounded-lg shadow-glass">
            <Text className="text-center font-semibold">John Smith</Text>
            <Text className="text-center mt-2">
              "I love how easy it is to compare different accommodations.
              VibeInn is my go-to app for booking stays."
            </Text>
            <div className="flex justify-center mt-4">
              <FaStar className="text-yellow-500" />
              <FaStar className="text-yellow-500" />
              <FaStar className="text-yellow-500" />
              <FaStar className="text-yellow-500" />
              <FaStar className="text-yellow-500" />
            </div>
          </Card>
          <Card className="p-6 bg-glass-white backdrop-blur-md rounded-lg shadow-glass">
            <Text className="text-center font-semibold">Alice Johnson</Text>
            <Text className="text-center mt-2">
              "Writing and reading reviews on VibeInn has made my travel
              planning so much easier!"
            </Text>
            <div className="flex justify-center mt-4">
              <FaStar className="text-yellow-500" />
              <FaStar className="text-yellow-500" />
              <FaStar className="text-yellow-500" />
              <FaStar className="text-yellow-500" />
              <FaStar className="text-yellow-500" />
            </div>
          </Card>
        </div>
      </Container>
    </section>
  );
};

export default Testimonials;
