import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Title, Card, Text, Button, rem, Modal } from "@mantine/core";
import Hero from "./Hero";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { IconStar } from "@tabler/icons-react";
import accommService from "../services/accommodation.service";
import MapContainer from "./MapContainer";
import { Carousel } from "react-responsive-carousel";
import APIProviderWrapper from "./APIProviderWrapper";
import getAverageSentiment from "./util/getAverageSentiment";

const SearchResults = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchLocation = searchParams.get("location");
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [hotels, setHotels] = useState([]);
  const [hoveredHotelId, setHoveredHotelId] = useState(null);
  const [modalOpened, setModalOpened] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [averageSentiments, setAverageSentiments] = useState([]);

  useEffect(() => {
    fetchHotels();
  }, [searchLocation, checkIn, checkOut]);

  useEffect(() => {
    if (hotels.length > 0) {
      getAverageSentiment(hotels, checkIn, checkOut)
        .then((sentiments) => {
          setAverageSentiments(sentiments);
        })
        .catch((error) => {
          console.error("Error getting sentiments:", error);
        });
    }
  }, [hotels, checkIn, checkOut]);

  const fetchHotels = () => {
    accommService
      .getHotels(searchLocation, checkIn, checkOut)
      .then(({ data }) => {
        const uniqueHotels = Array.from(
          new Map(data.map((hotel) => [hotel.id, hotel])).values()
        );

        const limitedHotels = uniqueHotels.slice(0, 15);

        setHotels(limitedHotels);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleMarkerClick = (marker) => {
    setSelectedHotel(marker);
    setModalOpened(true);
  };

  const openSearchModal = () => {
    setSearchModalOpen(true);
  };

  const closeSearchModal = () => {
    setSearchModalOpen(false);
  };

  return (
    <div className="h-screen flex flex-col col-span-1">
      <Title className="text-2xl text-center lg:mt-12 font-bold sm: mt-1 mb-2">
        Find your place to vibe in {searchLocation}
      </Title>
      {/* Button for mobile view to open modal */}
      <div className="text-center lg:hidden">
        <Button onClick={openSearchModal}>open search</Button>
      </div>
      <div className="text-center lg:block hidden">
        <Hero
          initialLocation={searchLocation}
          initialStartDate={checkIn}
          initialEndDate={checkOut}
        />
      </div>

      {/* Modal for search form */}
      <Modal
        opened={searchModalOpen}
        onClose={closeSearchModal}
        size="lg"
        padding="sm"
      >
        <div className="text-center">
          <Hero
            initialLocation={searchLocation}
            initialStartDate={checkIn}
            initialEndDate={checkOut}
          />
        </div>
      </Modal>

      <Title className="text-2xl font-bold m-6 sm:mt-0">
        Search Results for {searchLocation}
      </Title>

      {/* Flex container for responsive layout */}
      <div className="flex-1 flex flex-col overflow-y-auto lg:flex-row overflow-hidden">
        {/* Map section */}
        <div className="flex-1 min-h-[100px] lg:min-w-[500px] p-2 order-2 lg:order-1">
          <APIProviderWrapper>
            <MapContainer
              hotels={hotels}
              hoveredHotelId={hoveredHotelId}
              onMarkerClick={handleMarkerClick}
            />
          </APIProviderWrapper>
        </div>

        {/* Scrollable cards section */}
        <div className="flex-1 overflow-y-auto p-4 min  order-2 lg:order-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {hotels.map((hotel, index) => (
              <Card
                key={hotel.id}
                radius="md"
                padding="0"
                className="rounded-xl bg-gray-100 transition ease-in-out duration-75 w-full hover:scale-105"
                onMouseEnter={() => setHoveredHotelId(hotel.id)}
                onMouseLeave={() => setHoveredHotelId(null)}
              >
                <Carousel
                  showThumbs={false}
                  showStatus={false}
                  infiniteLoop
                  className="carousel"
                  renderArrowPrev={(onClickHandler, hasPrev, label) =>
                    hasPrev && (
                      <button
                        type="button"
                        onClick={onClickHandler}
                        title={label}
                        className="control-arrow left-0 ml-2"
                      >
                        ❮
                      </button>
                    )
                  }
                  renderArrowNext={(onClickHandler, hasNext, label) =>
                    hasNext && (
                      <button
                        type="button"
                        onClick={onClickHandler}
                        title={label}
                        className="control-arrow right-0 mr-3"
                      >
                        ❯
                      </button>
                    )
                  }
                >
                  {hotel.cardPhotos?.map((photo, index) => (
                    <div key={index}>
                      <img
                        src={photo.sizes.urlTemplate
                          .replace("{width}", 1000)
                          .replace("{height}", -1)}
                        alt={`Slide ${index}`}
                        className="rounded-xl w-full h-96 object-cover"
                      />
                    </div>
                  ))}
                </Carousel>

                <div className="mt-1 p-6">
                  <Text className="font-bold text-xl">
                    {hotel.title?.trim().replace(/^\d+\.\s+/, "")}
                  </Text>
                  <div className="flex items-center mt-2">
                    <IconStar style={{ width: rem(16), height: rem(16) }} />
                    <Text className="text-xs font-bold ml-1">
                      {hotel.bubbleRating?.rating} ({hotel.bubbleRating?.count}{" "}
                      reviews)
                    </Text>
                  </div>
                  {hotel.secondaryInfo && (
                    <Text className="text-sm text-gray-500 mt-2">
                      {hotel.secondaryInfo}
                    </Text>
                  )}
                  {/* Display Average Sentiment */}
                  {averageSentiments[index] !== undefined && (
                    <Text className="text-sm mt-2 w-22 text ">
                      <span className="inline-block bg-blue-500 text-white text-center font-bold py-1 px-3 rounded-lg float-right">
                        Vibe Score:
                        <br />
                        {averageSentiments[index]}
                      </span>
                    </Text>
                  )}
                  <div className="flex justify-between items-center mt-4">
                    <div className="text-xl font-bold">
                      {hotel.priceForDisplay?.replace("$", "£")}{" "}
                      <span className="text-sm text-gray-500">/ night</span>
                    </div>
                    {/* <Button radius="md">Book now</Button> */}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Modal for hotel details */}
      {selectedHotel && (
        <Modal opened={modalOpened} onClose={() => setModalOpened(false)}>
          <Carousel
            showThumbs={false}
            showStatus={false}
            infiniteLoop
            className="carousel"
          >
            {selectedHotel.cardPhotos.map((photo, index) => (
              <div key={index}>
                <img
                  src={photo.sizes.urlTemplate
                    .replace("{width}", 1000)
                    .replace("{height}", -1)}
                  alt={`Slide ${index}`}
                  className="rounded-xl w-full h-96 object-cover"
                />
              </div>
            ))}
          </Carousel>

          <div className="mt-1 p-6">
            <Text className="font-bold text-xl">
              {selectedHotel.title.trim().replace(/^\d+\.\s+/, "")}
            </Text>
            <div className="flex items-center mt-2">
              <IconStar style={{ width: rem(16), height: rem(16) }} />
              <Text className="text-xs font-bold ml-1">
                {selectedHotel.bubbleRating.rating} (
                {selectedHotel.bubbleRating.count} reviews)
              </Text>
            </div>
            {selectedHotel.secondaryInfo && (
              <Text className="text-sm text-gray-500 mt-2">
                {selectedHotel.secondaryInfo}
              </Text>
            )}
            <div className="flex justify-between items-center mt-4">
              <div className="text-xl font-bold">
                {selectedHotel.priceForDisplay.replace("$", "£")}{" "}
                <span className="text-sm text-gray-500">/ night</span>
              </div>
              <Button radius="md">Book now</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SearchResults;
