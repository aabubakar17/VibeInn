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
    /*  <section classNameName="py-20 min-w-full">
      <Container classNameName="min-w-2/3">
        <Title classNameName="text-center text-3xl font-bold">How It Works</Title>
        <div classNameName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
          <Card classNameName="p-6 bg-transparent backdrop-blur-md rounded-lg shadow-glass">
            <Text classNameName="text-center font-semibold">
              Step 1: Search for Accommodations
            </Text>
            <Text classNameName="text-center mt-2">
              Enter your desired location and dates to find available
              accommodations.
            </Text>
          </Card>
          <Card classNameName="p-6 bg-glass-white backdrop-blur-md rounded-lg shadow-glass">
            <Text classNameName="text-center font-semibold">
              Step 2: View Sentiment Analysis
            </Text>
            <Text classNameName="text-center mt-2">
              See the overall sentiment of user reviews for each accommodation.
            </Text>
          </Card>
          <Card classNameName="p-6 bg-glass-white backdrop-blur-md rounded-lg shadow-glass">
            <Text classNameName="text-center font-semibold">
              Step 3: Read and Write Reviews
            </Text>
            <Text classNameName="text-center mt-2">
              Read detailed reviews from other users and share your own
              experiences.
            </Text>
          </Card>
          <Card classNameName="p-6 bg-glass-white backdrop-blur-md rounded-lg shadow-glass">
            <Text classNameName="text-center font-semibold">
              Step 4: Make an Informed Decision
            </Text>
            <Text classNameName="text-center mt-2">
              Choose the best accommodation based on comprehensive insights.
            </Text>
          </Card>
        </div>
      </Container>
    </section> */
    <section className="py-10 bg-transparent md:-mt-16 sm:py-16 lg:py-24">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">
            How does it work?
          </h2>
          <p className="max-w-lg mx-auto mt-4 text-base leading-relaxed text-gray-600">
            Get started with VibeInn in just 3 simple steps.
          </p>
        </div>

        <div className="relative mt-12 lg:mt-20">
          <div className="absolute inset-x-0 hidden xl:px-44 top-2 md:block md:px-20 lg:px-28">
            <img
              className="w-full"
              src="https://cdn.rareblocks.xyz/collection/celebration/images/steps/2/curved-dotted-line.svg"
              alt=""
            />
          </div>

          <div className="relative grid grid-cols-1 text-center gap-y-12 md:grid-cols-3 gap-x-12">
            <div>
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-white border-2 border-gray-200 rounded-full shadow">
                <span className="text-xl font-semibold text-gray-700"> 1 </span>
              </div>
              <h3 className="mt-6 text-xl font-semibold leading-tight text-black md:mt-10">
                Create a free account
              </h3>
              <p className="mt-4 text-base text-gray-600">
                register an account to start exploring the best accommodations
                with the best vibes and share own experiences.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-white border-2 border-gray-200 rounded-full shadow">
                <span className="text-xl font-semibold text-gray-700"> 2 </span>
              </div>
              <h3 className="mt-6 text-xl font-semibold leading-tight text-black md:mt-10">
                Search for Accommodations
              </h3>
              <p className="mt-4 text-base text-gray-600">
                Enter your desired location and dates to find available
                accommodations.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-white border-2 border-gray-200 rounded-full shadow">
                <span className="text-xl font-semibold text-gray-700"> 3 </span>
              </div>
              <h3 className="mt-6 text-xl font-semibold leading-tight text-black md:mt-10">
                View Sentiment Analysis
              </h3>
              <p className="mt-4 text-base text-gray-600">
                See the overall vibe scores from 1 - 10 of user reviews for each
                accommodation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
