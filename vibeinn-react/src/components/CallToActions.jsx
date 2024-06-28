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

const CallToActions = () => {
  return (
    <section className=" text-black py-20">
      <Container className="text-center">
        <Title className="text-3xl font-bold">Join VibeInn Today</Title>
        <Text className="m-4 text-xl">
          Sign up now and start exploring the best accommodations with
          comprehensive insights.
        </Text>
        <a
          href="/register"
          size="lg"
          className="mt-8 bg-gradient-to-r from-pink-500 to-yellow-500 text-white font-semibold rounded-full shadow-md hover:bg-gray-600 px-4 py-2 text-white uppercase rounded text-xs tracking-wider md:mt-0 md:ml-4"
        >
          Join Now
        </a>
      </Container>
    </section>
  );
};

export default CallToActions;
