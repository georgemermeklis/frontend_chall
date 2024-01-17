import React, { useEffect, useState, useRef } from "react";
import FeedItem from "./FeedItem";

interface Feed {
  briefref: string;
  brand: {
    name: string;
    logo: string;
  };
  feed_title: string;
  banner_text: string;
  banner_image: string;
  ad_1_image: string;
  ad_2_image: string;
  starts_on: string;
  description: string;
}

const App: React.FC = () => {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/api/feed?page=${page}`
        );
        if (!response.ok) {
          throw new Error(
            `Server returned ${response.status} - ${response.statusText}`
          );
        }

        const data = await response.json();
        setFeeds((prevFeeds) => {
          // Filter out duplicates based on the 'briefref'
          const newFeeds = data.filter(
            (newFeed) =>
              !prevFeeds.some(
                (prevFeed) => prevFeed.briefref === newFeed.briefref
              )
          );
          return [...prevFeeds, ...newFeeds];
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [page]);

  const handleImageClick = (imageSrc: string) => {
    setFullscreenImage(imageSrc);
  };

  const handleScroll = () => {
    if (
      containerRef.current &&
      containerRef.current.scrollHeight - containerRef.current.scrollTop <=
        containerRef.current.clientHeight + 50
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div
      className="app"
      ref={containerRef}
      onScroll={handleScroll}
      style={{ overflowY: "scroll", height: "100vh" }}
    >
      {feeds.map((feed, index) => (
        <FeedItem
          {...feed}
          key={index}
          brand={feed.brand}
          feed_title={feed.feed_title}
          ad_1_image={feed.ad_1_image}
          banner_image={feed.banner_image}
          onImageClick={() => handleImageClick(feed.banner_image)}
        />
      ))}
    </div>
  );
};

export default App;
