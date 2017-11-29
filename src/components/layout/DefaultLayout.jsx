import React from "react";
import Header from ".Header";
import Footer from ".Footer";
import './assets/css/index.css';

const DefaultLayout = ({component: Component, ...rest}) => {
  return (
    <div className="main">
        <Header />
        <Component {...rest} />
        <Footer />
    </div>
  )
};

export default DefaultLayout;
