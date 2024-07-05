import {
  Title,
  SimpleGrid,
  Text,
  Button,
  ThemeIcon,
  Grid,
  rem,
} from "@mantine/core";

import {
  MdOutlineEmojiEmotions,
  MdOutlineRateReview,
  MdLocalHotel,
  MdOutlineScreenSearchDesktop,
} from "react-icons/md";
import { TbDeviceDesktopSearch } from "react-icons/tb";
import classes from "./Features.module.css";

const features = [
  {
    icon: MdOutlineEmojiEmotions,
    title: "Sentiment Analysis of Reviews",
    description:
      "Understand the general sentiment of reviews for any accommodation.",
  },
  {
    icon: MdOutlineScreenSearchDesktop,
    title: "Search and Compare Accommodations",
    description: "Easily search for and compare different accommodations.",
  },
  {
    icon: MdLocalHotel,
    title: "User Reviews and sentiment Scores",
    description:
      "Read reviews and ratings from real users to make informed decisions",
  },
  {
    icon: MdOutlineRateReview,
    title: "Post Your Own Reviews",
    description:
      "Share your experiences with other users by posting your own reviews and receive sentiment scores on them.",
  },
];

const Features = () => {
  const items = features.map((feature) => (
    <div key={feature.title}>
      <ThemeIcon
        size={44}
        radius="md"
        variant="gradient"
        gradient={{ deg: 133, from: "blue", to: "cyan" }}
      >
        <feature.icon
          style={{ width: rem(26), height: rem(26) }}
          stroke={1.5}
        />
      </ThemeIcon>
      <Text fz="lg" mt="sm" fw={500}>
        {feature.title}
      </Text>
      <Text c="dimmed" fz="sm">
        {feature.description}
      </Text>
    </div>
  ));

  return (
    <div className="mt-44 xl:mx-4 lg:mx-4 sm:mx-4 xl:mx-80 mt-36 ">
      <Grid gutter={80}>
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Title className={classes.title} order={2}>
            Start VibeInn your way to the perfect stay
          </Title>
          <Text c="dimmed">
            See vibe scores and reviews from real users to make informed
            decisions on your next stay. Make an account to start exploring
            today!
          </Text>

          <Button
            variant="gradient"
            gradient={{ deg: 133, from: "blue", to: "cyan" }}
            size="lg"
            radius="md"
            mt="xl"
            onClick={() => window.open("/register", "_self")}
            className="hover: bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
          >
            Get started
          </Button>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 7 }}>
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing={30}>
            {items}
          </SimpleGrid>
        </Grid.Col>
      </Grid>
    </div>
  );
};
export default Features;
