import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Title,
  Text,
  Card,
  Badge,
  Paper,
  Avatar,
  Group,
  Button,
  Textarea,
  Modal,
} from "@mantine/core";
import { Carousel } from "react-responsive-carousel";
import { FaEdit, FaTrash } from "react-icons/fa"; // Importing Font Awesome icons
import reviewService from "../services/review.service";
import authService from "../services/auth.service";
import dayjs from "dayjs";
import sentimentService from "../services/sentiment.service";
import accommService from "../services/accommodation.service"; // Updated to import accommService
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel styles

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [hotelDetails, setHotelDetails] = useState({});
  const [sentimentScores, setSentimentScores] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentReview, setCurrentReview] = useState(null);
  const [updatedText, setUpdatedText] = useState("");
  const navigate = useNavigate();

  const fetchHotelDetails = async (userReviews) => {
    try {
      const hotelDetailsPromises = userReviews.map((review) =>
        accommService.getHotelDetails(
          review.accommodationId,
          "2024-08-08",
          "2024-08-12"
        )
      );
      const hotelDetailsArray = await Promise.all(hotelDetailsPromises);
      const hotelDetailsMap = hotelDetailsArray.reduce((acc, hotelDetail) => {
        acc[hotelDetail.hotelId] = hotelDetail;
        return acc;
      }, {});
      setHotelDetails(hotelDetailsMap);
    } catch (error) {
      console.error("Error fetching hotel details:", error);
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
    };

    const fetchUserReviews = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          const userReviews = await reviewService.getReviewsByUserId(
            currentUser.user.id
          );
          setReviews(userReviews);
        }
      } catch (error) {
        console.error("Error fetching user reviews:", error);
      }
    };

    const fetchSentiments = async (userReviews) => {
      if (!userReviews.length) {
        return;
      }
      try {
        const sentimentScores = await sentimentService.getSentiment(
          userReviews.map((review) => review?.text)
        );

        const updatedReviews = userReviews.map((review, index) => {
          return {
            ...review,
            sentimentScore: sentimentScores[index],
          };
        });
        setReviews(updatedReviews);
      } catch (error) {
        console.error("Error fetching sentiment scores:", error);
      }
    };

    const fetchData = async () => {
      await fetchUserProfile();
      await fetchUserReviews();
    };

    fetchData().then(() => {
      if (reviews.length > 0) {
        fetchSentiments(reviews);
        fetchHotelDetails(reviews);
      }
    });
  }, [reviews.length]);

  useEffect(() => {
    fetchHotelDetails(reviews);
  }, [reviews]);

  // Redirect to login if not logged in
  useEffect(() => {
    if (!authService.isLoggedIn()) {
      navigate("/login");
    }
  }, [navigate]);

  const handleDeleteReview = async (reviewId) => {
    try {
      console.log(reviewId);
      setReviews(reviews.filter((review) => review._id !== reviewId));
      await reviewService.deleteReview(reviewId);
      console.log("Review deleted successfully!");
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const handleUpdateReview = async (reviewText, reviewId) => {
    console.log(reviewText, reviewId);
    try {
      // Optimistically update the review
      const updatedReviews = reviews.map((review) =>
        review._id === reviewId ? { ...review, text: reviewText } : review
      );
      setReviews(updatedReviews);

      await reviewService.updateReview(reviewText, reviewId);
      console.log("Review updated successfully!");
      closeModal();
    } catch (error) {
      console.error("Error updating review:", error);
      // Revert back to the original review in case of an error
      const originalReviews = reviews.map((review) =>
        review._id === reviewId ? { ...review, text: review.text } : review
      );
      setReviews(originalReviews);
    }
  };

  const openModal = (review) => {
    console.log(review);
    setCurrentReview(review);
    setUpdatedText(review.text);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentReview(null);
    setUpdatedText("");
  };

  const handleTextChange = (event) => {
    setUpdatedText(event.target.value);
  };

  const handleSubmitUpdate = () => {
    if (currentReview) {
      handleUpdateReview(updatedText, currentReview._id);
    }
  };

  const handleCardClick = (hotelId) => {
    navigate(`/hotelpage/${hotelId}?checkIn=2024-08-08&checkOut=2024-08-12`);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 lg:mx-80">
      <div className="mb-6">
        <div className="mb-4 flex justify-center">
          <Paper
            className="w-96"
            radius="md"
            withBorder
            p="lg"
            bg="var(--mantine-color-body)"
          >
            <Avatar
              src="https://as1.ftcdn.net/v2/jpg/05/90/59/88/1000_F_590598870_TOcGd4cUZzPoEMlxSc7XYwcupHOE0vLM.jpg"
              size={120}
              radius={120}
              mx="auto"
            />
            <Text ta="center" fz="lg" fw={500} mt="md">
              {user.user.firstName} {user.user.lastName}
            </Text>
            <Text ta="center" c="dimmed" fz="sm">
              {user.user.email}
            </Text>

            <Text ta="center" c="dimmed" fz="sm">
              {reviews.length} reviews
            </Text>
          </Paper>
        </div>
      </div>

      <div className="mt-6 md:mx-24">
        <Title className="text-2xl font-bold mb-2">My Reviews</Title>
        {reviews.length === 0 ? (
          <Text>No reviews found.</Text>
        ) : (
          reviews.map((review, index) => {
            const hotelDetail = hotelDetails[review.accommodationId] || {};

            return (
              <Card withBorder radius="md" p={0} className="py-4" key={index}>
                <Group wrap="nowrap" gap={0}>
                  {hotelDetail.photos && (
                    <div className="w-80">
                      <Carousel
                        showThumbs={false}
                        showStatus={false}
                        infiniteLoop
                      >
                        {hotelDetail.photos.map((photo, index) => (
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
                    </div>
                  )}
                  <div className="m-4">
                    <Text
                      tt="uppercase"
                      c="dimmed"
                      className="w-56"
                      fw={700}
                      size="xs"
                    >
                      {hotelDetail.location}
                    </Text>
                    <a onClick={() => handleCardClick(review.accommodationId)}>
                      <Text className="font-bold text-2xl mb-2" mt="xs" mb="md">
                        {hotelDetail.title}
                      </Text>
                    </a>
                    <Text className="-mt-4">
                      "{review.text.replace(/<[^>]*>?/gm, "")}"
                    </Text>
                    <Group wrap="nowrap" gap="xs">
                      <Group gap="xs" wrap="nowrap">
                        <Badge className="font-bold py-2 text-white-500">
                          Vibe Score: {review.sentimentScore}
                        </Badge>
                      </Group>
                      <Text size="xs" c="dimmed">
                        •
                      </Text>
                      <Text size="xs" c="dimmed">
                        Posted{" "}
                        {dayjs(review.publishedDate).format("DD/MM/YYYY")}
                      </Text>
                    </Group>
                    <div className="mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openModal(review)}
                        className="mr-2"
                      >
                        <FaEdit className="mr-1" /> Update
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteReview(review._id)}
                      >
                        <FaTrash className="mr-1" /> Delete
                      </Button>
                    </div>
                  </div>
                </Group>
              </Card>
            );
          })
        )}
      </div>

      {currentReview && (
        <Modal opened={isModalOpen} onClose={closeModal} title="Update Review">
          <Textarea
            value={updatedText}
            onChange={handleTextChange}
            placeholder="Update your review"
            minRows={4}
          />
          <Group position="right" mt="md">
            <Button onClick={handleSubmitUpdate}>Submit</Button>
            <Button variant="outline" onClick={closeModal}>
              Cancel
            </Button>
          </Group>
        </Modal>
      )}
    </div>
  );
};

export default Dashboard;
