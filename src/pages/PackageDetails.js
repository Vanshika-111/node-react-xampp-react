import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./packagedetails.css";

function PackageDetails() {
  const { id } = useParams();
  const [packageData, setPackageData] = useState(null);
  const [itineraries, setItineraries] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [loadingItineraries, setLoadingItineraries] = useState(false);
  const navigate = useNavigate();

  // Available travel dates
  const availableDates = [
    "2025-11-05",
    "2025-11-12",
    "2025-11-19",
    "2025-11-26",
  ];

  // Fetch package details
  useEffect(() => {
    fetch(`http://localhost:5000/api/packages/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPackageData(data);
      })
      .catch((err) => console.error(err));
  }, [id]);

  // Fetch itineraries
  useEffect(() => {
    const fetchItineraries = async () => {
      setLoadingItineraries(true);
      try {
        const res = await fetch(`http://localhost:5000/itineraries/${id}`);
        const data = await res.json();
        const sorted = Array.isArray(data)
          ? data.sort((a, b) => Number(a.day) - Number(b.day))
          : [];
        setItineraries(sorted);
      } catch (err) {
        console.error("Failed to fetch itineraries:", err);
      } finally {
        setLoadingItineraries(false);
      }
    };
    fetchItineraries();
  }, [id]);

  // ✅ Load fixed date if already saved
  useEffect(() => {
    const savedDate = localStorage.getItem(`fixedDate_${id}`);
    if (savedDate) {
      setSelectedDate(savedDate);
    }
  }, [id]);

  if (!packageData)
    return <p className="loading-text">Loading package details...</p>;

  return (
    <div className="package-container">
      {/* Hero Section */}
      <div className="hero-section">
        <img src={packageData.image} alt={packageData.name} className="hero-img" />
        <div className="hero-overlay">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="hero-title">{packageData.name}</h1>
            <p className="hero-sub">
              ₹{packageData.price} | {packageData.nd} Days | {packageData.status}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="content-wrapper">
        <div className="main-content">
          {/* Tabs */}
          <div className="tabs">
            {["overview", "itinerary", "gallery", "reviews"].map((tab) => (
              <button
                key={tab}
                className={`tab ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                className="tab-content"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
              >
                <h2>About this Package</h2>
                <p>{packageData.description}</p>

                <div className="info-grid">
                  <div className="info-card">
                    <h3>🕒 Duration</h3>
                    <p>{packageData.nd} Days</p>
                  </div>
                  <div className="info-card">
                    <h3>💰 Price</h3>
                    <p>₹{packageData.price} per person</p>
                  </div>
                  <div className="info-card">
                    <h3>📅 Status</h3>
                    <p>{packageData.status}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <motion.div
          className="sidebar"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <button className="book-btn" onClick={() => setShowPopup(true)}>
            Book Now
          </button>
        </motion.div>
      </div>

      {/* Date Popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            className="popup-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="popup-content"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h2>
                {selectedDate
                  ? "Fixed Date for this Package"
                  : "Select Available Date"}
              </h2>

              <div className="date-options">
                {selectedDate ? (
                  <button className="date-btn selected" disabled>
                    {new Date(selectedDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </button>
                ) : (
                  availableDates.map((date) => (
                    <button
                      key={date}
                      className={`date-btn ${
                        selectedDate === date ? "selected" : ""
                      }`}
                      onClick={() => setSelectedDate(date)}
                    >
                      {new Date(date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </button>
                  ))
                )}
              </div>

              <div className="popup-buttons">
                {!selectedDate ? (
                  <>
                    <button
                      className="continue-btn"
                      disabled={!selectedDate}
                      onClick={() => {
                        localStorage.setItem(`fixedDate_${id}`, selectedDate);
                        setShowPopup(false);
                        navigate(`/booknow/${id}`, {
                          state: { packageData, selectedDate },
                        });
                      }}
                    >
                      Continue
                    </button>
                    <button
                      className="cancel-btn"
                      onClick={() => setShowPopup(false)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    className="continue-btn"
                    onClick={() => {
                      setShowPopup(false);
                      navigate(`/booknow/${id}`, {
                        state: { packageData, selectedDate },
                      });
                    }}
                  >
                    Proceed
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default PackageDetails;
