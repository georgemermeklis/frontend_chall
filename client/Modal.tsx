import React, { useState, useEffect } from "react";
import { Comment } from "./Interfaces";

interface FeedItemProps {
  brand: Brand;
  feed_title: string;
  banner_image: string;
  banner_text: string;
  ad_1_image: string;
  ad_2_image: string;
  starts_on: string;
  description: string;
  onImageClick: (imageSrc: string) => void;
}

interface Brand {
  logo: string;
  name: string;
}

interface ModalProps {
  selectedFeed: FeedItemProps;
  brand: Brand;
  comments: Comment[];
  onClose: () => void;
  onArrowClick: (direction: "up" | "down") => void;
}

const Modal: React.FC<ModalProps> = ({
  selectedFeed,
  brand,
  comments,
  onClose,
  onArrowClick,
}) => {
  const [atBannerSection, setAtBannerSection] = useState(true);

  const handleScroll = () => {
    const detailsSection = document.querySelector(".details-section");

    // Check if detailsSection is not null before accessing its properties
    if (detailsSection) {
      const detailsTop = detailsSection.getBoundingClientRect().top;
      setAtBannerSection(detailsTop > 0);
    }
  };

  useEffect(() => {
    const leftColumn = document.querySelector(".left-column");

    if (leftColumn) {
      leftColumn.addEventListener("scroll", handleScroll);

      return () => {
        leftColumn.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  return (
    <div className="custom-modal">
      <div className="modal-content">
        {/* Left Column */}
        <div className="left-column">
          <div className="left-content-container">
            <div className="arrow-container">
              <button
                className="arrow-button"
                disabled={atBannerSection}
                onClick={() => onArrowClick("up")}
              >
                <img
                  src="/switch-down.svg"
                  alt="Up Arrow"
                  className="arrow up"
                />
              </button>
              <button
                className="arrow-button"
                disabled={!atBannerSection}
                onClick={() => onArrowClick("down")}
              >
                <img
                  src="/switch-down.svg"
                  alt="Down Arrow"
                  className="arrow down"
                />
              </button>
            </div>
            <img
              src="/close-dialog.svg"
              alt="Close"
              className="close-button"
              onClick={onClose}
            />

            {/* Media View */}
            <div className="banner-section">
              {selectedFeed && (
                <div className="media-view">
                  <img
                    src={selectedFeed.banner_image}
                    alt="Media Banner"
                    className="modal-banner"
                  />
                </div>
              )}
            </div>
            {/* Feed Details View */}
            <div className="details-section">
              {selectedFeed && (
                <div className="feed-details-view">
                  <div className="brand-logo-container">
                    <img
                      src={selectedFeed.brand?.logo}
                      alt="Brand Logo"
                      className="brand-logo"
                    />
                  </div>

                  <div className="feed-details">
                    <h2>{selectedFeed.brand?.name}</h2>
                    <p>Starts on: {selectedFeed.starts_on}</p>

                    <p>{selectedFeed.banner_text}</p>
                    <img
                      src={selectedFeed?.ad_1_image}
                      alt="Advertisement 1"
                      className="ad-image"
                    />
                    <p>{selectedFeed.description}</p>
                    <img
                      src={selectedFeed.ad_2_image}
                      alt="Advertisement 2"
                      className="ad-image"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="right-column">
          <div className="brand-info">
            <img src={brand?.logo} alt="Brand Logo" className="brand-logo" />
            <span className="brand-name">{brand?.name}</span>
          </div>
          <div className="comments-section">
            <ul>
              {comments.map((comment, index) => (
                <li
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <img
                    src={comment.user.avatar}
                    alt={`${comment.user.name}'s avatar`}
                  />
                  <div>
                    <h3 style={{ margin: 0 }}>{comment.user.name}</h3>
                    <p style={{ margin: 0 }}>{comment.comment}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
