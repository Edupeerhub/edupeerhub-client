import { useRef, useState, useEffect } from "react";
import TutorSearchCard from "./TutorSearchCard";

const HorizontalScrollTutors = ({ tutors }) => {
  const containerRef = useRef(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(false);

  const CARD_WIDTH = 320;
  const GAP = 16;

  const checkScrollButtons = () => {
    if (!containerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    setShowLeftButton(scrollLeft > 10);
    setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (direction) => {
    if (!containerRef.current) return;
    containerRef.current.scrollBy({
      left: direction === "left" ? -CARD_WIDTH - GAP : CARD_WIDTH + GAP,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    checkScrollButtons();
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollButtons);
      return () => container.removeEventListener("scroll", checkScrollButtons);
    }
  }, [tutors]);

  useEffect(() => {
    window.addEventListener("resize", checkScrollButtons);
    return () => window.removeEventListener("resize", checkScrollButtons);
  }, []);

  return (
    <div className="relative overflow-hidden group">
      {showLeftButton && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 
                     bg-white border border-gray-300 rounded-full p-2 shadow-lg
                     hover:bg-gray-50 hover:shadow-xl transition-opacity duration-200
                     opacity-0 group-hover:opacity-100"
          aria-label="Scroll left"
        >
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}

      <div
        ref={containerRef}
        className="flex gap-4 overflow-x-auto py-4 px-2 scroll-smooth w-full flex-nowrap scrollbar-hide"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {tutors.map((tutor, index) => (
          <div key={tutor.userId || index} className="flex-shrink-0 w-80">
            <TutorSearchCard tutor={tutor} />
          </div>
        ))}
      </div>

      {showRightButton && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 
                     bg-white border border-gray-300 rounded-full p-2 shadow-lg
                     hover:bg-gray-50 hover:shadow-xl transition-opacity duration-200
                     opacity-0 group-hover:opacity-100"
          aria-label="Scroll right"
        >
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      )}

      <style>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default HorizontalScrollTutors;
