# VibeInn - Sentiment Analysis for TripAdvisor Reviews

## Deployed App

[VibeInn App](https://vibeinn.netlify.app/)

## Description

VibeInn is a web application that provides insights into the sentiment of accommodation reviews on TripAdvisor, helping users make informed decisions. By analysing the sentiments expressed in reviews, users can quickly understand the overall feeling towards accommodations and make better choices.

## Why This Application is Needed

Travelers often struggle to quickly gauge the overall sentiment of accommodation reviews, leading to time-consuming and sometimes ineffective decision-making processes. VibeInn solves this problem by providing a summarized sentiment analysis of reviews, allowing users to easily understand the general sentiment and make more informed choices.

## Features

- **Sentiment Analysis:** Analyze and display the sentiment of reviews from TripAdvisor.
- **CRUD Operations:**
  - **Create:** Users can add their reviews.
  - **Read:** Users can view accommodation details, including reviews and their sentiment score.
  - **Update:** Users can update their own reviews.
  - **Delete:** Users can delete their own reviews.
- **User Authentication and Authorization:**
  - Sign up, log in, and log out functionality.
  - Role-based restriction access control.

## User Interface

- **Home Page:** Overview of the application with a search bar to find accommodations.
- **Search Result Page:** Displays a list of hotels with a map feature.
- **Accommodation Page:** Displays sentiment score of reviews for a selected accommodation.
- **User Profile:** Allows users to manage their profiles and reviews.

## Technologies

**Frontend:**

- React
- Tailwind CSS

**Backend:**

- Node.js
- Express.js
- JWT (JSON Web Token)
- 
**Sentiment Analysis Model:**
- [distilbert-base-uncased](https://huggingface.co/Xenova/distilbert-base-uncased-finetuned-sst-2-english)

**Testing:**

- **Frontend:** React Testing Library, Vitest
- **Backend:** Sinon, Mocha

## Deployment

- **Frontend Deployment:** [Netlify](https://vibeinn.netlify.app/)
- **Backend Deployment:** Render
- **Database Deployment:** MongoDB Atlas

## How to Run the Project

### Prerequisites

- Node.js
- npm (Node Package Manager)

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/your-username/vibeinn.git
   cd vibeinn
   ```

2. Install the dependencies for both frontend and backend:
   ```
   cd vibeinn-service
   npm install
   cd vibeinn-react
   npm install
   ```

## Running Application

1. Start the backend server:

   ```
   cd vibeinn-service
   npm start
   ```

2. Start the frontend development server:

   ```
   cd vibeinn-react
   npm start
   ```

## Testing

To run the tests, navigate to the frontend and backend directory and run:

```
npm test
```
