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
const HowItWorks = () => {
  return (
    <section className="py-20">
      <Container>
        <Title className="text-center text-3xl font-bold">How It Works</Title>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
          <Card className="p-6 bg-glass-white backdrop-blur-md rounded-lg shadow-glass">
            <Text className="text-center font-semibold">
              Step 1: Search for Accommodations
            </Text>
            <Text className="text-center mt-2">
              Enter your desired location and dates to find available
              accommodations.
            </Text>
          </Card>
          <Card className="p-6 bg-glass-white backdrop-blur-md rounded-lg shadow-glass">
            <Text className="text-center font-semibold">
              Step 2: View Sentiment Analysis
            </Text>
            <Text className="text-center mt-2">
              See the overall sentiment of user reviews for each accommodation.
            </Text>
          </Card>
          <Card className="p-6 bg-glass-white backdrop-blur-md rounded-lg shadow-glass">
            <Text className="text-center font-semibold">
              Step 3: Read and Write Reviews
            </Text>
            <Text className="text-center mt-2">
              Read detailed reviews from other users and share your own
              experiences.
            </Text>
          </Card>
          <Card className="p-6 bg-glass-white backdrop-blur-md rounded-lg shadow-glass">
            <Text className="text-center font-semibold">
              Step 4: Make an Informed Decision
            </Text>
            <Text className="text-center mt-2">
              Choose the best accommodation based on comprehensive insights.
            </Text>
          </Card>
        </div>
      </Container>
    </section>
  );
};

export default HowItWorks;
