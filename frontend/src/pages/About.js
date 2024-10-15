import React from 'react'
import Layout from '../components/Layout/Layout'
import aboutUs from '../components/Layout/images/aboutUs.jpg'

const About = () => {
  return (
    <Layout title={"Abous Us-The Nikki Fashionista Hub"}>
      <div className="row contactus ">
        <div className="col-md-6 ">
          <img
            src={aboutUs}
            alt="contactus"
            style={{ width: "100%" }}
          />
        </div>
        <div className="col-md-4">
          <p className="text-justify mt-2">
          Welcome to Women's Fashion Hub! We're your go-to destination for chic, trendy, and timeless fashion pieces that empower and inspire women everywhere. From stylish basics to statement pieces, we curate a diverse collection that celebrates individuality and self-expression. Join our community of fashion enthusiasts and discover your unique style with Women's Fashion Hub today!
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default About;