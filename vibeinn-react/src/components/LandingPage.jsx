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

import Features from "./Features";
import Hero from "./Hero";
import HowItWorks from "./HowItWorks";
import CallToActions from "./CallToActions";
import Testimonials from "./Testimonials";
import Footer from "./Footer";
import Navbar from "./Navbar";
const LandingPage = ({ loggedIn, setLoggedIn }) => {
  return (
    <div className="relative bg-white overflow-hidden">
      {/* Blurred Circle Background */}
      {/* <div className="absolute inset-0 flex justify-start items-start z-0">
        <div className="w-full h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-4xl blur-2xl opacity-30"></div>
      </div> */}
      <div className="absolute inset-0 flex justify-end items-end  z-0">
        <div className="size-1/2 bg-gradient-to-r from-violet-200 to-pink-200 rounded-4xl blur-2xl opacity-30"></div>
      </div>
      <div className="absolute inset-0 flex justify-start items-start  z-0">
        <div className="size-2/3 bg-gradient-to-r from-violet-200 to-pink-200 rounded-r-full blur-2xl opacity-30"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <Container className="text-center mt-24">
          <Title className="text-4xl font-bold">
            Discover the Vibe of Your Next Stay
          </Title>
          <Text className="mt-4 text-xl">
            Uncover the best stays and experiences. Begin your journey with
            VibeInn now.
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
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;
