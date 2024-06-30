import React, { useState } from "react";
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

import Features from "./Features";
import Hero from "./Hero";
import HowItWorks from "./HowItWorks";
import CallToActions from "./CallToActions";
import Testimonials from "./Testimonials";

const LandingPage = () => {
  return (
    <div className="relative bg-gray-100 overflow-hidden">
      {/* Blurred Circle Background */}
      <div className="absolute inset-0 flex justify-start place-items-start z-0">
        <div className="w-2/3 h-2/3 bg-gradient-to-r from-pink-500 to-yellow-500 rounded-full blur-3xl opacity-30"></div>
      </div>
      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section */}

        <Container className="text-center mt-24">
          <Title className="text-4xl font-bold">
            Discover the Vibe of Your Next Stay
          </Title>
          <Text className="mt-4 text-xl">
            Find the perfect accommodation with insights from real user reviews.
          </Text>
          <Hero />
        </Container>
        {/* Features Section */}
        <Features />
        {/* How It Works Section */}
        <HowItWorks />
        {/* Testimonials Section */}
        <Testimonials />
        {/* Call-to-Action Section */}
        <CallToActions />
      </div>
    </div>
  );
};

export default LandingPage;
