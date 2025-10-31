// src/pages/About.js
import React from "react";
import { motion } from "framer-motion";
import "./About.css";

export default function About() {
  const team = [
    {
      name: "Vanshika Saini",
      role: "Founder & Developer",
      img: "https://wallpapercave.com/wp/wp7001262.jpg",
    },
    {
      name: "John Doe",
      role: "UI/UX Designer",
      img: "https://tse1.mm.bing.net/th/id/OIP.AVnqtJ0NKl2izEq5YNaEuQAAAA?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3",
    },
    {
      name: "Jane Smith",
      role: "Project Manager",
      img: "https://tse1.explicit.bing.net/th/id/OIP.9hrrZifIk4wlI5dl1PooZQHaKk?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3",
    },
  ];

  const timeline = [
    { year: "2023", text: "Started with an idea and a small team" },
    { year: "2024", text: "Launched our first product and gained users" },
    { year: "2025", text: "Expanding globally with innovative projects" },
  ];

  return (
    <div className="about-page">
      {/* Hero */}
      <section className="hero">
        <motion.div
          className="overlay"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1>About Us</h1>
          <p>Innovating today, shaping tomorrow ✨</p>
        </motion.div>
      </section>

      {/* Mission & Vision */}
      <section className="mission-vision">
        <motion.div
          className="card"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <h2>Our Mission</h2>
          <p>
            To deliver world-class digital solutions that empower people and
            businesses to achieve more.
          </p>
        </motion.div>
        <motion.div
          className="card"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <h2>Our Vision</h2>
          <p>
            To be a global leader in technology & design, driving innovation and
            making life easier.
          </p>
        </motion.div>
      </section>

      {/* Timeline */}
      <section className="timeline">
        <h2>Our Journey</h2>
        <div className="timeline-container">
          {timeline.map((item, idx) => (
            <motion.div
              key={idx}
              className="timeline-item"
              initial={{ opacity: 0, x: idx % 2 === 0 ? -80 : 80 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="circle"></div>
              <div className="content">
                <span className="year">{item.year}</span>
                <p>{item.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="team">
        <h2>Meet Our Team</h2>
        <div className="team-grid">
          {team.map((member, idx) => (
            <motion.div
              key={idx}
              className="team-card"
              whileHover={{ y: -10, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <div className="team-img-container">
                <img src={member.img} alt={member.name} />
              </div>
              <h3>{member.name}</h3>
              <p>{member.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Want to work with us?
        </motion.h2>
        <p>We love new collaborations. Let’s build something great together.</p>
        <motion.a
          href="/contact"
          className="cta-btn"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          Contact Us
        </motion.a>
      </section>
    </div>
  );
}
