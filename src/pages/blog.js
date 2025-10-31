import React from "react";
import { motion } from "framer-motion";
import "./blog.css";

const Blogs = [
  {
    id: 1,
    title: "Exploring the Beauty of Kerala",
    author: "Vanshika Saini",
    date: "October 15, 2025",
    image:
      "https://www.thewowstyle.com/wp-content/uploads/2015/01/Kerala.jpg",
    tag: "Travel",
    description:
      "Kerala, often known as God's Own Country, is a tropical paradise known for its serene backwaters, lush landscapes, and vibrant culture...",
  },
  {
    id: 2,
    title: "Top 5 Authentic Foods You Must Try in Rajasthan",
    author: "Vanshika Saini",
    date: "October 10, 2025",
    image:
      "https://www.thewowstyle.com/wp-content/uploads/2015/01/Rajasthan.jpg",
    tag: "Food",
    description:
      "From Dal Baati Churma to Gatte ki Sabzi, Rajasthan’s cuisine is full of rich flavors and royal traditions you cannot miss...",
  },
  {
    id: 3,
    title: "Why You Should Visit Goa During Monsoon",
    author: "Vanshika Saini",
    date: "September 28, 2025",
    image:
      "https://www.thewowstyle.com/wp-content/uploads/2014/11/Chapora-Beach.jpg",
    tag: "Nature",
    description:
      "Goa’s monsoon charm brings a new life to its beaches and hills, making it a perfect off-season destination for peace seekers...",
  },
];

const Blog = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="blog-hero">
        <div className="overlay"></div>
        <img
          src="https://www.thewowstyle.com/wp-content/uploads/2018/12/Dirty-Laundry.jpg"
          alt="Blog Hero"
          className="blog-hero-img"
        />
        <div className="blog-hero-text">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Tales of Trails Blog
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Discover destinations, flavors, and stories across India
          </motion.p>
        </div>
      </section>

      {/* Blog Cards */}
      <section className="blogs-section">
        <div className="blogs-container">
          <motion.div
            className="blogs-header"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h2>Latest Articles</h2>
            <p>
              Travel stories, local experiences, and food discoveries from
              across India.
            </p>
          </motion.div>

          <div className="blogs-grid">
            {Blogs.map((post, index) => (
              <motion.div
                key={post.id}
                className="blog-card"
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 200 }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transitionDelay={index * 0.2}
              >
                <div className="blog-img-container">
                  <img src={post.image} alt={post.title} />
                  <span className="blog-tag">{post.tag}</span>
                </div>
                <div className="blog-content">
                  <h3>{post.title}</h3>
                  <p className="meta">
                    {post.author} • {post.date}
                  </p>
                  <p className="desc">{post.description}</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="read-btn"
                  >
                    Read More →
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Blog;
