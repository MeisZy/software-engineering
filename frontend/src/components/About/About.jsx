import React, { useRef, useEffect, useNavigate } from "react";
import "./About.css";
import Navbar from "../Navbar.jsx";
import "./MultiContainerSlider.css";

// Importing images for the carousel Board Members
import boehm from '../images/boehm.png';
import christina from '../images/Christina.jpg';
import erikson from '../images/erikson.png';
import ivarb from '../images/ivarb.png';
import kent from '../images/kent.jpg';
import sardal from '../images/sardal.png';
import veres from '../images/veres.png';

// C-level team
import eriskon_light from '../images/erikson_light.png';
import kian from '../images/Kian.jpg';
import ivarb_light from '../images/ivar_light.png';
import ashley from '../images/ashley.png';
import dason from '../images/Dason.jpg';
import denys from '../images/Denys.jpg';
import carrie from '../images/Carrie.jpg';
import pham from '../images/Pham.jpg';
import ayu from '../images/ayu.jpg';
import maxime from '../images/Maxime.jpg';

// Managing directors
import sangar from '../images/sangar.png';
import meng from '../images/meng.png';
import alexise from '../images/Alexise.jpg';
import prasanth from '../images/prasanth.png';
import lieu from '../images/lieu.png';
import adriany from '../images/adriany.png';

const journey = [
  {
    title: "Enters Vietnam",
    description: "Collectius’ secured more than US$800 million of non-performing loans (NPLs) from a Vietnam-based commercial bank.",
  },
  {
    title: "Acquires first secured mortgage loan portfolio",
    description: "Collectius' acquires its first secured mortgage loan portfolio from a global bank in Malaysia.",
  },
  {
    title: "Opening of two new offices",
    description: "Collectius' opened 2 new offices in the 2nd half of 2022. One in Hyderabad, India and one in Ho Chi Minh City, Vietnam.",
  },
];

const carouselItems = [
  {
    title: "Gustav A. Eriksson",
    img: erikson,
    description: "Working Chairman, Co-Founder",
  },
  {
    title: "Tibor Veres",
    img: veres,
    description: "Board Member",
  },
  {
    title: "Pontus Sardal",
    img: sardal,
    description: "Board Member",
  },
  {
    title: "Andy Boehm",
    img: boehm,
    description: "Board Member, Stena Representative",
  },
  {
    title: "Ivar Bjorklund",
    img: ivarb,
    description: "Board Member, Co-Funder",
  },
  {
    title: "Christina Ongoma",
    img: christina,
    description: "Board Member, IFC Representative",
  },

  {
    title: "Kent Hansson",
    img: kent,
    description: "Board Member",
  },

];

const CLevelTeam = [
  {
    title: "Gustav A. Eriksson",
    img: eriskon_light,
    description: "Co-Founder & Working Chairman",
  },
  {
    title: "Kian Foh Then",
    img: kian ,
    description: "GRou CEO CMS",
  },
  {
    title: "Ivar Bjorklund",
    img: ivarb_light,
    description: "Co-Founder",
  },

    {
    title: "Ashley Yew",
    img: ashley,
    description: "Group Chief Finance Officer",
  },


    {
    title: "Maxine Chaussignand",
    img: maxime,
    description: "Group Head of Investment",
  },

      {
    title: "Denys Kravchuk",
    img: denys,
    description: "Group Chief Finance Officer",
  },

      {
    title: "Dinesh Barthy Dason",
    img: dason,
    description: "Group Chief Technology Officer",
  },

      {
    title: "Carrie Choo",
    img: carrie,
    description: "Group Chief Legal Counsel",
  },

      {
    title: "Pham Viet Thai",
    img: pham,
    description: "Regional Head of Data Analytics",
  },

      {
    title: "Yosephin Ayu",
    img: ayu,
    description: "Regional Head of Human Resources",
  },

];


const directors= [
  {
    title: "Nidhi Sangar",
    img: sangar,
    description: "Managing Director, Singapore",
  },
  {
    title: "Leong Yam Meng",
    img: meng,
    description: "Managing Director, Malaysia",
  },
  {
    title: "Kian Foh Then",
    img: kian ,
    description: "Interim Managing Director, Thailand",
  },

    {
    title: "Maxie Alexie Charisse Arboleda",
    img: alexise,
    description: "Managing Director, Philippines",
  },

      {
    title: "Prasanth Shankar Rama Rao",
    img: prasanth,
    description: "Managing Director, India",
  },

      {
    title: "Nguyen Thi Thuy Lieu",
    img: lieu,
    description: "Managing Director, Vietnam",
  },

      {
    title: "Adriany Luppy Latuheru",
    img: adriany,
    description: "Managing Director, Indonesia",
  },
];

const About = () => {
  const carouselRef1 = useRef(null);
  const carouselRef2 = useRef(null);
  const carouselRef3 = useRef(null);

  const scroll = (ref, direction) => {
    const container = ref.current;
    const scrollAmount = 320;
    if (direction === "left") {
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };


useEffect(() => {
  const interval1 = setInterval(() => {
    console.log("Carousel 1 scrolling"); // debug
    if (carouselRef1.current) {
      carouselRef1.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  }, 3000);

  const interval2 = setInterval(() => {
    console.log("Carousel 2 scrolling"); // debug
    if (carouselRef2.current) {
      carouselRef2.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  }, 3000);

  const interval3 = setInterval(() => {
    console.log("Carousel 3 scrolling"); // debug
    if (carouselRef3.current) {
      carouselRef3.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  }, 3000);

  return () => {
    clearInterval(interval1);
  };
}, []);


useEffect(() => {
    const interval2 = setInterval(() => {
    console.log("Carousel 2 scrolling"); // debug
    if (carouselRef2.current) {
      carouselRef2.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  }, 3000);

  return () => {
    clearInterval(interval2);
  };
}, []);

useEffect(() => {
    const interval3 = setInterval(() => {
    console.log("Carousel 3 scrolling"); // debug
    if (carouselRef3.current) {
      carouselRef3.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  }, 3000);

  return () => {
    clearInterval(interval3);
  };
}, []);




  return (
    <div className="about-container">
      <Navbar />

      {/* Wave */}
      <div className="wave-container">
        <svg viewBox="0 0 1440 500" preserveAspectRatio="none" className="wave-svg">
          <defs>
            <clipPath id="waveClip">
              <path
                fill="url(#waveGradient)"
                d="M0,300 C180,350,360,250,540,280 C720,310,900,400,1080,380 C1260,360,1350,300,1440,280 L1440,0 L0,0 Z"
              />
            </clipPath>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#13714C" />
              <stop offset="100%" stopColor="#A2E494" />
            </linearGradient>
          </defs>
          <g clipPath="url(#waveClip)">
            <rect x="0" y="0" width="100%" height="100%" fill="url(#waveGradient)" />
          </g>
        </svg>
      </div>

<header className="header">
          <h1>ABOUT COLLECTIUS</h1>
      </header>
<div className="center-wrapper">
      <div className="body-content">
              <h1 >About Collectius Philippines</h1>
              <p>A trusted restructuring and servicing partner to financial institutions 
                and commercial companies in Asia</p>

              <p>Our business is to purchase portfolios of non-performing consumer and SME loans, and recover them. 
                We also service financial institutions to help them resolve overdue accounts.</p>

              <p>Customer-centric approach and a data-driven platform powered by machine learning
                Our cutting-edge debt management system based on robust collection system to enables Collectius to deliver a seamless, 
                personalized customer experience powered by omni channel communication, automation, API connectivity and more.
              </p>

              <p>
                We facilitate debt repayment with protocols that exceed industry standards.

                Our infrastructure and compliance protocols go above and beyond industry requirements. With sound 
                collection and compliance practices, our clients and their customers can trust that we will deliver results
                </p>   
                
                <br></br> <br></br>

              <h1>Our Vission</h1>

              <p>We want to create a world where every person, 
                regardless of background, has the financial know-how to grow with the economy.</p>
      </div>
</div>

      {/* Journey Section */}
      <div className="journey-section">
      <h1 style={{ textAlign: 'center' }}>Our Journey</h1>
      <div className="static-carousel">
        {journey.map((item, index) => (
          <div className="static-carousel-wrapper" key={index}>
            <div className="carousel-card1">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
      </div>
      
      {/* First Carousel */}
      <div className="carousel-wrapper">
        <h1 style={{ textAlign: 'center' , color: 'black' }}>Board Member</h1>
        <button className="nav-button left" onClick={() => scroll(carouselRef1, "left")}>❮</button>
        <div className="carousel-track" ref={carouselRef1}>
          {carouselItems.map((item, index) => (
            <article className="carousel-card" key={index}>
              <img src={item.img} alt={item.title} />
              <h2>{item.title}</h2>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
        <button className="nav-button right" onClick={() => scroll(carouselRef1, "right")}>❯</button>
      </div>

      {/* C-Level Carousel */}
      <div className="carousel-wrapper">
        <h1 style={{ textAlign: 'center', color: 'black' }}>C-Level Team</h1>
        <button className="nav-button left" onClick={() => scroll(carouselRef2, "left")}>❮</button>
        <div className="carousel-track" ref={carouselRef2}>
          {CLevelTeam.map((item, index) => (
            <article className="carousel-card" key={index}>
              <img src={item.img} alt={item.title} />
              <h2>{item.title}</h2>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
        <button className="nav-button right" onClick={() => scroll(carouselRef2, "right")}>❯</button>
      </div>


           {/* C-Level Carousel */}
      <div className="carousel-wrapper">
        <h1 style={{ textAlign: 'center' }}>Country Managing Directors</h1>
        <button className="nav-button left" onClick={() => scroll(carouselRef3, "left")}>❮</button>
        <div className="carousel-track" ref={carouselRef3}>
          {directors.map((item, index) => (
            <article className="carousel-card" key={index}>
              <img src={item.img} alt={item.title} />
              <h2>{item.title}</h2>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
        <button className="nav-button right" onClick={() => scroll(carouselRef3, "right")}>❯</button>
      </div>

<div className="wave-footer">
  <svg viewBox="0 0 1440 400" preserveAspectRatio="none" className="wave-svg flipped">
    <defs>
      <clipPath id="waveClipFooter">
        <path
          fill="url(#waveGradientFooter)"
    d="M0,300 
   C180,350 360,250 540,300 
   C720,350 900,250 1080,300 
   C1260,350 1350,300 1440,300 
   L1440,0 L0,0 Z"

        />
      </clipPath>
      <linearGradient id="waveGradientFooter" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#13714C" />
        <stop offset="100%" stopColor="#A2E494" />
      </linearGradient>
    </defs>
    <g clipPath="url(#waveClipFooter)">
      <rect x="0" y="0" width="100%" height="100%" fill="url(#waveGradientFooter)" />
    </g>
  </svg>

  {/* ➕ INSERTED TEXT INSIDE THE WAVE */}
  <div className="wave-footer-text">
    <h2>Thank you for visiting Collectius!</h2>
    <p>Empowering financial freedom across Asia.</p>

        <div className="footer-content">
      <div className="footer-section">
        <h3>Collectius Philippines</h3>
        <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
      </div>
      <div className="footer-section">
        <h4>Links</h4>
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Services</a></li>
        </ul>
      </div>
      <div className="footer-section">
        <h4>Contact</h4>
        <p>Email: info@collectius.ph</p>
        <p>Phone: +63 900 123 4567</p>
      </div>
    </div>
  </div>
</div>
    </div>
  );
};

export default About;