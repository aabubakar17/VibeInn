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
const Features = () => {
  return (
    <section className="py-20">
      <Container>
        <Title className="text-center text-3xl font-bold">Features</Title>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
          <Card className="p-6 bg-glass-white backdrop-blur-md rounded-lg shadow-glass">
            {/* <Image
                  src="/images/sentiment-analysis.png"
                  alt="Sentiment Analysis"
                /> */}
            <Text className="text-center mt-4 font-semibold">
              Sentiment Analysis of Reviews
            </Text>
            <Text className="text-center mt-2">
              Understand the general sentiment of reviews for any accommodation.
            </Text>
          </Card>
          <Card className="p-6 bg-glass-white backdrop-blur-md rounded-lg shadow-glass">
            <Image src="/images/search-compare.png" alt="Search and Compare" />
            <Text className="text-center mt-4 font-semibold">
              Search and Compare Accommodations
            </Text>
            <Text className="text-center mt-2">
              Easily search for and compare different accommodations.
            </Text>
          </Card>
          <Card className="p-6 bg-glass-white backdrop-blur-md rounded-lg shadow-glass">
            <Image src="/images/user-reviews.png" alt="User Reviews" />
            <Text className="text-center mt-4 font-semibold">
              User Reviews and Ratings
            </Text>
            <Text className="text-center mt-2">
              Read reviews and ratings from real users to make informed
              decisions.
            </Text>
          </Card>
          <Card className="p-6 bg-glass-white backdrop-blur-md rounded-lg shadow-glass">
            <Image
              src="/images/personalized-recommendations.png"
              alt="Personalized Recommendations"
            />
            <Text className="text-center mt-4 font-semibold">
              Personalized Recommendations
            </Text>
            <Text className="text-center mt-2">
              Get recommendations tailored to your preferences.
            </Text>
          </Card>
        </div>
      </Container>
    </section>
  );
};

export default Features;
