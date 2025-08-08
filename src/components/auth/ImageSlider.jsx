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
    <div className="w-full max-w-xl mx-auto relative">
      <img
        src={images[current]}
        alt={`Slide ${current + 1}`}
        className={`w-full rounded-xl transition-opacity duration-500 ease-in-out ${
          fade ? "opacity-100" : "opacity-5"
        }`}
      />

      <div>
        <h1 className="text-center text-[#2C3A47] text-2xl font-bold mt-4">
          Where learning connects
        </h1>
        <p className="text-center text-[#727C84] mt-1">
          Get the tools and guidance you need to pass with confidence.
        </p>
      </div>

      {/* Dots */}
      <div className="flex justify-center mt-3 space-x-2">
        {images.map((_, index) => (
          <span
            key={index}
            className={`h-2 w-2 rounded-full cursor-pointer ${
              current === index ? "bg-blue-800" : "bg-blue-400"
            }`}
            onClick={() => setCurrent(index)}
          ></span>
        ))}
      </div>
    </div>
  );
}
