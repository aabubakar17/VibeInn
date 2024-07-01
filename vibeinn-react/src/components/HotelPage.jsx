import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Title, Text, Badge, Card, Modal, rem } from "@mantine/core";
import { Carousel } from "react-responsive-carousel";
import { IconStar } from "@tabler/icons-react";
import accommService from "../services/accommodation.service";
import sentimentService from "../services/sentiment.service"; // Import sentiment service
import "react-responsive-carousel/lib/styles/carousel.min.css";

const HotelPage = () => {
  const { id } = useParams();
  const searchParams = new URLSearchParams(window.location.search);
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");

  const [hotelDetails, setHotelDetails] = useState(null);
  const [modalOpened, setModalOpened] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [sentimentScores, setSentimentScores] = useState({});

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        const details = await accommService.getHotelDetails(
          id,
          checkIn,
          checkOut
        );
        setHotelDetails(details);
        console.log(details.reviews.content);
        fetchSentiments(details.reviews.content);
      } catch (error) {
        console.error("Error fetching hotel details:", error);
      }
    };

    fetchHotelDetails();
  }, [id, checkIn, checkOut]);

  // Function to fetch sentiment for each review
  const fetchSentiments = async (reviews) => {
    try {
      const sentimentMap = {};
      for (const review of reviews) {
        console.log(review.text);
        const sentiment = await sentimentService.getSentiment(review.text);
        sentimentMap[review.id] = sentiment;
      }
      setSentimentScores(sentimentMap);
    } catch (error) {
      console.error("Error fetching sentiment:", error);
    }
  };

  if (!hotelDetails) {
    return <div>Loading...</div>;
  }

  const openModal = (photo) => {
    setSelectedPhoto(photo);
    setModalOpened(true);
  };

  const splitAmenitiesIntoColumns = (amenities, columns) => {
    const itemsPerColumn = Math.ceil(amenities.length / columns);
    const result = [];
    for (let i = 0; i < columns; i++) {
      result.push(
        amenities.slice(i * itemsPerColumn, (i + 1) * itemsPerColumn)
      );
    }
    return result;
  };

  // Splitting amenities into 3 columns
  const amenitiesColumns = splitAmenitiesIntoColumns(hotelDetails.amenities, 3);

  // Realistic names array
  const realisticNames = [
    "Michael Johnson",
    "Jennifer Brown",
    "David Smith",
    "Lisa Williams",
    "James Jones",
    "Maria Garcia",
    "John Davis",
    "Jessica Rodriguez",
    "Robert Martinez",
    "Sarah Miller",
  ];

  // Function to pick a random name
  const getRandomName = () => {
    const randomIndex = Math.floor(Math.random() * realisticNames.length);
    return realisticNames[randomIndex];
  };

  return (
    <div className="p-6">
      <Title className="text-4xl font-bold mb-4">{hotelDetails.title}</Title>
      <div className="mb-6">
        <div className="flex items-center">
          <IconStar style={{ width: rem(24), height: rem(24) }} />
          <Text className="text-xl font-bold ml-2">
            {hotelDetails.rating} ({hotelDetails.numberReviews} reviews)
          </Text>
        </div>
      </div>

      <Carousel showThumbs={false} showStatus={false} infiniteLoop>
        {hotelDetails.photos.map((photo, index) => (
          <div key={index} onClick={() => openModal(photo)}>
            <img
              src={photo.urlTemplate
                .replace("{width}", 1000)
                .replace("{height}", -1)}
              alt={`Slide ${index}`}
              className="rounded-xl w-full h-96 object-cover cursor-pointer"
            />
          </div>
        ))}
      </Carousel>

      <div className="mt-6">
        <Title className="text-2xl font-bold mb-2">Tags</Title>
        <div className="flex flex-wrap gap-2">
          {hotelDetails.tags?.map((tag, index) => (
            <Badge key={index} className="bg-blue-500 text-white">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <Title className="text-2xl font-bold mb-2">Amenities</Title>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {amenitiesColumns.map((column, colIndex) => (
            <div key={colIndex}>
              {column.map((amenity, index) => (
                <div key={index} className="mb-4">
                  <Text className="font-bold text-lg">{amenity.title}</Text>
                  <ul className="list-disc ml-6">
                    {amenity.content.map((item, idx) => (
                      <li key={idx} className="text-sm text-gray-700">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <Title className="text-2xl font-bold mb-2">Reviews</Title>
        {hotelDetails.reviews.content.map((review, index) => (
          <Card key={index} className="mb-4 p-4">
            <div className="flex items-center mb-2">
              <img
                src={review.userProfile.avatar.urlTemplate
                  .replace("{width}", 300)
                  .replace("{height}", -1)}
                alt="User avatar"
                className="rounded-full w-12 h-12 mr-4"
              />
              <div>
                <Text className="text-sm text-gray-500">
                  {review.publishedDate}
                </Text>
                <Title className="text-base mb-1">{getRandomName()}</Title>
                {sentimentScores[review.id] && (
                  <div>
                    <Text className="font-bold text-green-500">
                      Sentiment: {sentimentScores[review.id].score.toFixed(2)}
                    </Text>
                  </div>
                )}
              </div>
            </div>
            <Text>{review.text.replace(/<[^>]*>?/gm, "")}</Text>
          </Card>
        ))}
      </div>

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        size="lg"
        className="bg-transparent"
      >
        {selectedPhoto && (
          <img
            src={selectedPhoto.urlTemplate
              .replace("{width}", 1000)
              .replace("{height}", -1)}
            alt="Selected"
            className="w-full h-full object-cover"
          />
        )}
      </Modal>
    </div>
  );
};

export default HotelPage;
