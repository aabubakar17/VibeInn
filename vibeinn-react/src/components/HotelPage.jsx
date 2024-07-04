import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Title, Text, Badge, Card, Modal, rem, Loader } from "@mantine/core";
import { Carousel } from "react-responsive-carousel";
import { IconStar } from "@tabler/icons-react";
import accommService from "../services/accommodation.service";
import sentimentService from "../services/sentiment.service";
import authService from "../services/auth.service";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { getAverageSentiment } from "./util/getAverageSentiment";
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
  const [reviewText, setReviewText] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [loginModal, setLoginModal] = useState(false);
  const [user, setUser] = useState(null);
  const [sentimentScoreUser, setSentimentScoreUser] = useState([]);
  const [sentimentScore, setSentimentScore] = useState([]);
  const [averageSentiment, setAverageSentiment] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Function to fetch sentiments
  const fetchSentiments = async (hotelDetails) => {
    console.log("Fetching sentiments...");
    try {
      /* setLoading(true); // Start loading */

      const hotelReviewsText = hotelDetails?.reviews?.content.map((review) =>
        review.text.replace(/<[^>]*>?/gm, "")
      );

      const userReviewsText = hotelDetails?.userReviews?.map((review) =>
        review.text.replace(/<[^>]*>?/gm, "")
      );

      // If either reviews are not available, set them to empty array to avoid null errors
      const hotelReviews = hotelReviewsText || [];
      const userReviews = userReviewsText || [];

      const combinedReviewText = [...hotelReviews, ...userReviews];

      const sentiment = await sentimentService.getSentiment(combinedReviewText);
      const average = getAverageSentiment(sentiment);

      setSentimentScore(sentiment);
      setSentimentScoreUser(sentiment.slice(3, sentiment.length));
      setAverageSentiment(average);

      console.log("Sentiments fetched:", sentiment, average);
    } catch (error) {
      console.error("Error fetching sentiment:", error);
    } finally {
      if (hotelDetails) {
        setLoading(false); // Stop loading, whether successful or failed
      }
    }
  };

  // Fetch hotel details on initial mount and when id, checkIn, or checkOut change
  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        const cachedHotelDetails = JSON.parse(
          localStorage.getItem("hotelDetails")
        );

        if (cachedHotelDetails && cachedHotelDetails.hotelId === id) {
          setHotelDetails(cachedHotelDetails);
          await fetchSentiments(cachedHotelDetails); // Ensure sentiments are fetched
        } else {
          const details = await accommService.getHotelDetails(
            id,
            checkIn,
            checkOut
          );

          if (details) {
            setHotelDetails(details);
            // Ensure sentiments are fetched
          }

          localStorage.setItem("hotelDetails", JSON.stringify(details));
        }
      } catch (error) {
        console.error("Error fetching hotel details:", error);
      }
    };
    fetchHotelDetails();
  }, [id, checkIn, checkOut]);

  // Fetch user details on initial mount if loggedIn
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

  useEffect(() => {
    if (setHotelDetails) {
      fetchSentiments(hotelDetails);
    }
  }, [hotelDetails]);
  // Fetch reviews by user ID when user state changes
  useEffect(() => {
    const fetchReviewsByUserId = async () => {
      try {
        if (user) {
          const updatedReviews = await reviewService.getReviewsByUserId(
            user.user.id
          );

          setHotelDetails((prevHotelDetails) => {
            const updatedDetails = {
              ...prevHotelDetails,
              userReviews: updatedReviews.filter(
                (review) => review.accommodationId === id
              ),
            };
            fetchSentiments(updatedDetails);
            return updatedDetails;
          });
        }
      } catch (error) {
        console.error("Error fetching reviews by user ID:", error);
      }
    };

    fetchReviewsByUserId();
  }, [user, id]);

  // Handle review submission
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!loggedIn) {
      setLoginModal(true);
    } else {
      try {
        if (reviewText) {
          const newReview = {
            user: `${user.user.firstName} ${user.user.lastName}`,
            publishedDate: "Written " + dayjs().format("DD/MM/YY"),
            text: reviewText,
            userProfile: {
              avatar: {
                urlTemplate:
                  "https://as1.ftcdn.net/v2/jpg/05/90/59/88/1000_F_590598870_TOcGd4cUZzPoEMlxSc7XYwcupHOE0vLM.jpg",
              },
            },
            image:
              "https://as1.ftcdn.net/v2/jpg/05/90/59/88/1000_F_590598870_TOcGd4cUZzPoEMlxSc7XYwcupHOE0vLM.jpg",
          };

          await reviewService.submitReview(newReview.text, id);

          const updatedReviews = await reviewService.getReviewsByUserId(
            user.user.id
          );

          setHotelDetails((prevHotelDetails) => {
            const updatedDetails = {
              ...prevHotelDetails,
              userReviews: updatedReviews.filter(
                (review) => review.accommodationId === id
              ),
            };
            fetchSentiments(updatedDetails);
            return updatedDetails;
          });

          setReviewText("");
          setReviewSubmitted(true);
        } else {
          console.error("Review submission failed: Review text is empty");
        }
      } catch (error) {
        console.error("Review submission error:", error);
      }
    }
  };

  // Open modal for login prompt
  const handleLoginModal = () => {
    navigate("/login");
    setLoginModal(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <div className="mb-10">
          <Title>Calculating the vibe....</Title>
        </div>
        <div>
          <Loader size={80} />
        </div>
      </div>
    );
  }

  // Function to open modal with selected photo
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

  console.log(hotelDetails);

  // Render the component
  return (
    <div className="min-h-screen p-6 lg:mx-24">
      {hotelDetails && (
        <>
          <div className="flex flex-col md:flex-row md:items-center mb-4">
            <Title className="text-4xl mr-4 font-bold">
              {hotelDetails.title}
            </Title>
            {averageSentiment && (
              <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 py-8 px-2 md:py-8 md:px-4 rounded-md text-xs md:text-sm text-white text-center mt-4 md:mt-0">
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
              {hotelDetails?.photos?.[0] && (
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
              )}
            </div>
            <div className="hidden md:grid md:grid-cols-2 gap-4">
              {hotelDetails?.photos?.slice(1, 5).map((photo, index) => (
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
              {hotelDetails?.about?.tags?.map((tag, index) => (
                <Badge
                  key={index}
                  className="bg-gray-300 text-white text-center"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <Title className="text-2xl font-bold mb-2">Amenities</Title>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {hotelDetails?.amenities &&
                splitAmenitiesIntoColumns(hotelDetails.amenities, 3).map(
                  (column, colIndex) => (
                    <div key={colIndex}>
                      {column.map((amenity, index) => (
                        <div key={index} className="mb-4">
                          <Text className="font-bold text-lg">
                            {amenity.title}
                          </Text>
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
                <Title className="text-2xl font-bold mb-2">
                  Leave a Review
                </Title>
                <textarea
                  className="w-full h-24 px-4 py-2 border border-solid border-gray-300 rounded"
                  placeholder="Write your review here..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                />
                <button
                  type="submit"
                  className="mt-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-full shadow-md hover:bg-gray-600 px-4 py-2 text-white uppercase rounded text-xs tracking-wider"
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
              onClick={handleLoginModal}
            >
              Login
            </button>
          </Modal>

          <div className="mt-6">
            <Title className="text-2xl font-bold mb-2">Reviews</Title>
            {/* Display reviews fetched from hotel details */}
            {hotelDetails?.reviews?.content &&
              hotelDetails.reviews.content.map((review, index) => (
                <Card key={index} className="mb-4 p-4">
                  <div className="flex items-center mb-2">
                    {review.userProfile?.avatar.urlTemplate ? (
                      <img
                        src={review.userProfile.avatar.urlTemplate
                          .replace("{width}", 300)
                          .replace("{height}", -1)}
                        alt="User avatar"
                        className="rounded-full w-12 h-12 mr-4"
                      />
                    ) : (
                      <img
                        src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                        alt="User avatar"
                        className="rounded-full w-12 h-12 mr-4"
                      />
                    )}
                    <div>
                      <Title className="text-base mb-1">Anonymous User</Title>
                      <Text className="text-sm text-gray-500">
                        {review.publishedDate}
                      </Text>
                      {sentimentScore && (
                        <Badge className="font-bold  bg-gradient-to-r from-blue-600 to-cyan-500 py-2 text-white-500">
                          Vibe Score: {sentimentScore[index]}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Text>{review.text.replace(/<[^>]*>?/gm, "")}</Text>
                </Card>
              ))}
            {/* Display reviews fetched by userId */}
            {hotelDetails?.userReviews &&
              hotelDetails.userReviews.length > 0 && (
                <div>
                  {hotelDetails.userReviews.map((review, index) => (
                    <Card key={index} className="mb-4 p-4">
                      <div className="flex items-center mb-2">
                        <div className="mt-4">
                          <img
                            src="https://as1.ftcdn.net/v2/jpg/05/90/59/88/1000_F_590598870_TOcGd4cUZzPoEMlxSc7XYwcupHOE0vLM.jpg"
                            alt="Review image"
                            className="rounded-full w-12 h-12 mr-4"
                          />
                        </div>
                        {review.userProfile?.avatar && (
                          <img
                            src={review.userProfile.avatar.urlTemplate
                              .replace("{width}", 300)
                              .replace("{height}", -1)}
                            alt="User avatar"
                            className="rounded-full w-12 h-12 mr-4"
                          />
                        )}
                        <div>
                          <Title className="text-base mb-1">
                            {`${user.user.firstName} ${user.user.lastName}`}
                          </Title>
                          <Text className="text-sm text-gray-500">
                            Written{" "}
                            {dayjs(review.publishedDate).format("DD/MM/YY")}
                          </Text>
                          {sentimentScoreUser && (
                            <Badge className="font-bold py-2 text-white-500">
                              Vibe Score: {sentimentScoreUser[index]}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Text>{review.text.replace(/<[^>]*>?/gm, "")}</Text>
                    </Card>
                  ))}
                </div>
              )}
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
        </>
      )}
    </div>
  );
};

export default HotelPage;
