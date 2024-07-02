import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Title, Text, Badge, Card, Modal, rem } from "@mantine/core";
import { Carousel } from "react-responsive-carousel";
import { IconStar } from "@tabler/icons-react";
import accommService from "../services/accommodation.service";
import sentimentService from "../services/sentiment.service";
import authService from "../services/auth.service";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { getAverageSentiment } from "./util/getAverageSentiment";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import reviewService from "../services/review.service";

const HotelPage = ({ loggedIn }) => {
  const { id } = useParams();
  const searchParams = new URLSearchParams(window.location.search);
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");

  const [hotelDetails, setHotelDetails] = useState(null);
  const [modalOpened, setModalOpened] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [sentimentScores, setSentimentScores] = useState([]);
  const [averageSentiment, setAverageSentiment] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [loginModal, setLoginModal] = useState(false);
  const [user, setUser] = useState(null); // State for logged-in user
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        const details = await accommService.getHotelDetails(
          id,
          checkIn,
          checkOut
        );
        setHotelDetails(details);
        fetchSentiments(details.reviews.content);
      } catch (error) {
        console.error("Error fetching hotel details:", error);
      }
    };

    fetchHotelDetails();
  }, [id, checkIn, checkOut]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const loggedInUser = await authService.getCurrentUser();
        setUser(loggedInUser);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    if (loggedIn) {
      fetchUser();
    }
  }, [loggedIn]);

  // Fetch sentiment scores for reviews
  const fetchSentiments = async (reviews) => {
    const reviewTexts = reviews.map((review) =>
      review.text.replace(/<[^>]*>?/gm, "")
    );

    try {
      const sentiment = await sentimentService.getSentiment(reviewTexts);
      setSentimentScores(sentiment);
      const average = getAverageSentiment(sentiment);
      setAverageSentiment(average);
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

  // Function to split amenities into columns
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

  // Handle review submission
  const handleSubmitReview = async (e) => {
    console.log(user);
    e.preventDefault();
    if (!loggedIn) {
      setLoginModal(true);
    } else {
      try {
        if (reviewText) {
          const newReview = {
            user: user.user.firstName + user.user.lastName, // Use logged-in user's name
            publishedDate: "Written " + dayjs().format("DD/MM/YY"), // Use current date/time
            text: reviewText,
            userProfile: {
              avatar: {
                urlTemplate: user.avatar, // Use logged-in user's avatar
              },
            },
          };

          // Send the new review to the server
          await reviewService.submitReview(newReview.text, id);

          // Update hotelDetails with the new review
          const updatedReviews = [...hotelDetails.reviews.content, newReview];
          const updatedHotelDetails = {
            ...hotelDetails,
            reviews: {
              ...hotelDetails.reviews,
              content: updatedReviews,
            },
          };

          // Update state
          setHotelDetails(updatedHotelDetails);
          setReviewText(""); // Clear review text after submission
          setReviewSubmitted(true);
        } else {
          console.error("Review submission failed: Review text is empty");
        }
      } catch (error) {
        console.error("Review submission error:", error);
      }
    }
  };

  // Navigate to login page when "Login" button is clicked
  const handleLoginModal = () => {
    navigate("/login");
    setLoginModal(false); // Close modal after navigation
  };

  return (
    <div className="p-6 lg:mx-24">
      <div className="flex flex-col md:flex-row md:items-center mb-4">
        <Title className="text-4xl mr-4 font-bold">{hotelDetails.title}</Title>
        {averageSentiment && (
          <Badge className="bg-blue-500 py-8 px-2 md:py-8 md:px-4 rounded-md text-xs md:text-sm text-white text-center mt-4 md:mt-0">
            Vibe Score <br /> {averageSentiment}
          </Badge>
        )}
      </div>

      <div className="mb-6 flex items-center">
        <IconStar style={{ width: rem(24), height: rem(24) }} />
        <Text className="text-xl font-bold ml-2">
          {hotelDetails.rating} ({hotelDetails.numberReviews} reviews)
        </Text>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
        <div
          className="md:col-span-1"
          onClick={() => openModal(hotelDetails.photos[0])}
        >
          <img
            src={hotelDetails.photos[0].urlTemplate
              .replace("{width}", 1000)
              .replace("{height}", -1)}
            alt={`Slide 0`}
            className="rounded-xl w-full h-auto md:h-full object-cover cursor-pointer"
          />
        </div>
        <div className="hidden md:grid md:grid-cols-2 gap-4">
          {hotelDetails.photos.slice(1, 5).map((photo, index) => (
            <div key={index} onClick={() => openModal(photo)}>
              <img
                src={photo.urlTemplate
                  .replace("{width}", 500)
                  .replace("{height}", -1)}
                alt={`Slide ${index + 1}`}
                className="rounded-xl w-full h-auto md:h-full object-cover cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <Title className="text-2xl font-bold mb-2">Tags</Title>
        <div className="flex flex-wrap gap-2">
          {hotelDetails.about.tags?.map((tag, index) => (
            <Badge key={index} className="bg-gray-300 text-white text-center">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <Title className="text-2xl font-bold mb-2">Amenities</Title>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {splitAmenitiesIntoColumns(hotelDetails.amenities, 3).map(
            (column, colIndex) => (
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
            )
          )}
        </div>
      </div>

      {!reviewSubmitted && (
        <div className="mt-6">
          <form onSubmit={handleSubmitReview}>
            <Title className="text-2xl font-bold mb-2">Leave a Review</Title>
            <textarea
              className="w-full h-24 px-4 py-2 border border-solid border-gray-300 rounded"
              placeholder="Write your review here..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
            <button
              type="submit"
              className="mt-4 bg-slate-800 text-white font-semibold rounded-full shadow-md hover:bg-gray-600 px-4 py-2 text-white uppercase rounded text-xs tracking-wider"
            >
              Submit Review
            </button>
          </form>
        </div>
      )}

      {/* Modal for login prompt */}
      <Modal
        opened={loginModal}
        onClose={() => setLoginModal(false)}
        size="lg"
        className="bg-transparent text-center"
      >
        Please login or register to leave a review
        <br />
        <button
          className="mt-4 bg-slate-800 text-white font-semibold rounded-full shadow-md hover:bg-gray-600 px-4 py-2 text-white uppercase rounded text-xs tracking-wider"
          onClick={handleLoginModal} // Fixed: Corrected onClick handler
        >
          Login
        </button>
      </Modal>

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
                <Title className="text-base mb-1">{review.user}</Title>
                <Text className="text-sm text-gray-500">
                  {review.publishedDate}
                </Text>
                {sentimentScores.length > 0 && (
                  <Badge className="font-bold py-2 text-white-500">
                    Vibe Score: {sentimentScores[index]}
                  </Badge>
                )}
              </div>
            </div>
            <Text>{review.text.replace(/<[^>]*>?/gm, "")}</Text>
          </Card>
        ))}
      </div>

      {/* Modal for carousel view */}
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        size="lg"
        className="bg-transparent"
      >
        {selectedPhoto && (
          <Carousel showThumbs={false} showStatus={false} infiniteLoop>
            {hotelDetails.photos.map((photo, index) => (
              <div key={index}>
                <img
                  src={photo.urlTemplate
                    .replace("{width}", 1000)
                    .replace("{height}", -1)}
                  alt={`Slide ${index}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </Carousel>
        )}
      </Modal>
    </div>
  );
};

export default HotelPage;
