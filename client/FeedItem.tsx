import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { Comment } from "./Interfaces";

interface Brand {
  logo: string;
  name: string;
}

interface Feed {
  brand: Brand;
  feed_title: string;
  banner_image: string;
  banner_text: string;
  ad_1_image: string;
  ad_2_image: string;
  starts_on: string;
  description: string;
}

interface FeedItemProps extends Feed {
  briefref: string;
  onImageClick: (imageSrc: string) => void;
}

const FeedItem: React.FC<FeedItemProps> = ({
  brand,
  feed_title,
  banner_image,
  banner_text,
  ad_1_image,
  ad_2_image,
  starts_on,
  description,
  onImageClick,
  briefref,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedFeed, setSelectedFeed] = useState<FeedItemProps | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/api/comments/${selectedFeed?.briefref}`
        );
        if (!response.ok) {
          throw new Error(
            `Server returned ${response.status} - ${response.statusText}`
          );
        }

        const commentsData = await response.json();
        setComments(commentsData);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    if (isModalOpen && selectedFeed) {
      fetchComments();
    }
  }, [isModalOpen, selectedFeed]);

  const handleArrowClick = (direction) => {
    const leftColumn = document.querySelector(".left-column");
    const bannerSection = document.querySelector(".banner-section");
    const detailsSection = document.querySelector(".details-section");

    const smoothScroll = (target) => {
      // Ensure that 'target' and 'leftColumn' are not null
      if (!target || !leftColumn) return;

      const targetPosition = target.getBoundingClientRect().top;
      const startPosition = leftColumn.scrollTop;
      const distance = targetPosition - leftColumn.getBoundingClientRect().top;
      const duration = 500;
      let startTime: number | null = null;

      const animation = (currentTime: number) => {
        // Set startTime to the current time if it's null
        if (startTime === null) {
          startTime = currentTime;
        }

        // Since we've already set startTime above, it's guaranteed not to be null here
        const timeElapsed = currentTime - startTime;
        const run = easeInOut(timeElapsed, startPosition, distance, duration);
        if (leftColumn) leftColumn.scrollTop = run;
        if (timeElapsed < duration) requestAnimationFrame(animation);
      };

      const easeInOut = (t, b, c, d) => {
        t /= d / 2;
        if (t < 1) return (c / 2) * t * t + b;
        t--;
        return (-c / 2) * (t * (t - 2) - 1) + b;
      };

      requestAnimationFrame(animation);
    };

    if (direction === "down" && bannerSection && detailsSection) {
      smoothScroll(detailsSection);
    } else if (direction === "up" && detailsSection && bannerSection) {
      smoothScroll(bannerSection);
    }
  };

  const handleModalOpen = () => {
    setSelectedFeed({
      brand,
      feed_title,
      banner_image,
      banner_text,
      ad_1_image,
      ad_2_image,
      description,
      starts_on,
      onImageClick,
      briefref,
    });
    setIsModalOpen(true);
  };

  return (
    <div className="feed-item">
      <div className="header">
        <div className="brand-info">
          <img src={brand?.logo} alt="Brand Logo" className="brand-logo" />
          <span className="brand-name">{brand?.name}</span>
        </div>
        <a href="#" className="join-link">
          Join this brief!!
        </a>
      </div>

      <div className="banner-container">
        <img
          src={banner_image}
          alt="Feed Banner"
          className="banner-image"
          onClick={() => {
            handleModalOpen();
            onImageClick(banner_image);
          }}
        />
        <div className="feed-title">{feed_title}</div>
      </div>

      {isModalOpen && selectedFeed && (
        <Modal
          selectedFeed={selectedFeed}
          brand={brand}
          comments={comments}
          onClose={() => setIsModalOpen(false)}
          onArrowClick={handleArrowClick}
        />
      )}
    </div>
  );
};

export default FeedItem;
