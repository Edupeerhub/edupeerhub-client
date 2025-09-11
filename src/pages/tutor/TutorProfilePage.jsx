import React from "react";
import { ChevronLeft, Star } from "lucide-react";

const TutorProfilePage = () => {
  return (
    <>
      <button className="btn btn-primary rounded-full bg-white text-primary border-none shadow-md hover:bg-primary hover:text-white">
        <ChevronLeft />
        Back
      </button>
      <div className="flex gap-10 items-start">
        <div class="avatar avatar-online mt-8 shrink-0">
          <div class="w-24 rounded-full">
            <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
          </div>
        </div>
        <div className="">
          <h1 className="font-bold">Mr. Daniel Ocholi</h1>
          <p className="text-sm mt-2">Maths. Further maths.</p>
          <p className="text-sm mt-2 text-gray-500">
            Experienced tutor with a passion for helping students succeed
          </p>
          <p className="text-sm mt-2 text-gray-500">
            Today: 4pm-6pm .Usual: Mon-Fri, 4-7pm
          </p>
          <button className="btn btn-primary mt-2 mb-2 rounded-full bg-primary text-white border-none shadow-md hover:bg-white hover:text-primary">
            Book Session
          </button>
        </div>
      </div>

      <div>
        <h1 className="font-bold">About Me</h1>
        <p className="text-sm p-2 text-gray-500">
          I'm a dedicated tutor with 5+ years of experience, specializing in
          Mathematics and Further Math. My goal is to make learning engaging and
          effective, helping students build confidence and achieve their
          academic goals.
        </p>
      </div>
      <h1 className="font-bold mt-4 mb-4">Reviews</h1>
      <div className="bg-background">
        <div className="flex p-5">
          <div className="pl-3">
            <h1 className="font-bold text-4xl">4.8</h1>

            <div className="flex w-1/2 mt-[-10px]">
              <Star
                size={30}
                fill="currentColor"
                className="text-primary"
                stroke="none"
              />
              <Star
                size={30}
                fill="currentColor"
                className="text-primary"
                stroke="none"
              />
              <Star
                size={30}
                fill="currentColor"
                className="text-primary"
                stroke="none"
              />
              <Star
                size={30}
                fill="currentColor"
                className="text-primary"
                stroke="none"
              />
              <Star size={30} fill="white" stroke="lightblue" />
            </div>
            <p className="text-sm">125 reviews</p>
          </div>
          <div className="ml-[-30px] w-full">
            <div className="flex gap-2 mt-1">
              <p>5</p>
              <progress
                className="progress text-primary w-1/3 mt-2"
                value={70}
                max={100}
              ></progress>
              <p>70%</p>
            </div>
            <div className="flex gap-2 mt-1">
              <p>4</p>
              <progress
                className="progress text-primary w-1/3 mt-2"
                value={20}
                max={100}
              ></progress>
              <p>20%</p>
            </div>
            <div className="flex gap-2 mt-1">
              <p>3</p>
              <progress
                className="progress text-primary w-1/3 mt-2"
                value={5}
                max={100}
              ></progress>
              <p>5%</p>
            </div>
            <div className="flex gap-2 mt-1">
              <p>2</p>
              <progress
                className="progress text-primary w-1/3 mt-2"
                value={3}
                max={100}
              ></progress>
              <p>3%</p>
            </div>
            <div className="flex gap-3 mt-1">
              <p>1</p>
              <progress
                className="progress text-primary w-1/3 mt-2"
                value={2}
                max={100}
              ></progress>
              <p>2%</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2 items-start p-5 mt-[-18px]">
          <div class="avatar avatar-online shrink-0">
            <div class="w-12 rounded-full">
              <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
            </div>
          </div>
          <div className="">
            <h1 className="font-bold">Eze Johnson</h1>
            <p className="text-sm mt-1">July 10, 2024</p>
          </div>
        </div>
        <div className="flex w-1/2 mt-[-30px] p-5">
          <Star
            size={15}
            fill="currentColor"
            className="text-primary"
            stroke="none"
          />
          <Star
            size={15}
            fill="currentColor"
            className="text-primary"
            stroke="none"
          />
          <Star
            size={15}
            fill="currentColor"
            className="text-primary"
            stroke="none"
          />
          <Star
            size={15}
            fill="currentColor"
            className="text-primary"
            stroke="none"
          />
          <Star size={15} fill="currentColor" stroke="none" className="text-primary" />
        </div>
        <div>
          <p className="text-sm p-5 mt-[-30px] text-text ">Mr. Daniel is an amazing tutor! He helped me understand complex math concepts with ease. Highly recommend!</p>
        </div>
        <div className="flex gap-2 items-start p-5 mt-[-18px]">
          <div class="avatar avatar-online shrink-0">
            <div class="w-12 rounded-full">
              <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
            </div>
          </div>
          <div className="">
            <h1 className="font-bold">Fatima Aisha</h1>
            <p className="text-sm mt-1">July 25, 2024</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default TutorProfilePage;
