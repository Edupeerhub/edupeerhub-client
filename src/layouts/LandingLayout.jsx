import React from "react";
import Header from "../components/landing/Header";
import Footer from "../components/landing/Footer";

const LandingLayout = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default LandingLayout;
