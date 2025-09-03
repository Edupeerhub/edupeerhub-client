import { useState, useEffect } from "react";
import slide1 from "../../assets/images/auth/slide-1.svg";
import slide2 from "../../assets/images/auth/slide-2.svg";
import slide3 from "../../assets/images/auth/slide-3.svg";
import slide4 from "../../assets/images/auth/slide-4.svg";
import slide5 from "../../assets/images/auth/slide-5.svg";

export default function ImageSlider() {
  const images = [slide1, slide2, slide3, slide4, slide5];

  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false); // start fade-out
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % images.length);
        setFade(true); // fade-in next image
      }, 500); // matches fade-out duration
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setCurrent((prev) => (prev + 1) % images.length);
  //   }, 4000); // change every 4s
  //   return () => clearInterval(timer);
  // }, [images.length]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <img
        src={images[current]}
        alt={`Slide ${current + 1}`}
        className={`w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
          fade ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Dots */}
      {/* <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <span
            key={index}
            className={`h-2 w-2 rounded-full cursor-pointer ${
              current === index ? "bg-blue-800" : "bg-blue-400"
            }`}
            onClick={() => setCurrent(index)}
          />
        ))}
      </div> */}
    </div>
  );
}
