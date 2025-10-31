import React from "react";
import "./Contact.css";
import { motion } from "framer-motion";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

const Contact = () => {
  return (
    <div className="contact-page">
      {/* Hero Section */}
      <motion.div
        className="contact-hero"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1>Get in Touch</h1>
        <p>
          We'd love to hear from you! Whether you have a question, project idea,
          or just want to say hi — drop us a message.
        </p>
      </motion.div>

      {/* Contact Section */}
      <div className="contact-container">
        {/* Left Info Cards */}
        <motion.div
          className="contact-info"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="info-card">
            <FaEnvelope className="icon" />
            <h3>Email</h3>
            <p>hello@talesoftrails.com</p>
          </div>
          <div className="info-card">
            <FaPhoneAlt className="icon" />
            <h3>Phone</h3>
            <p>+91 98765 43210</p>
          </div>
          <div className="info-card">
            <FaMapMarkerAlt className="icon" />
            <h3>Location</h3>
            <p>New Delhi, India</p>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.form
          className="contact-form"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="form-group">
            <label htmlFor="name">Your Name</label>
            <input type="text" id="name" placeholder="Enter your name" required />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Your Message</label>
            <textarea
              id="message"
              rows="5"
              placeholder="Write your message..."
              required
            ></textarea>
          </div>

          <motion.button
            type="submit"
            className="submit-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Send Message ✉️
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
};

export default Contact;
