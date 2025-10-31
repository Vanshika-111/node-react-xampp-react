import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./Flights.css";

const Flights = () => {
  const [flights, setFlights] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✈️ Predefined routes
  const routes = [
    { from: "DEL", to: "DXB", label: "India → Dubai" },
    { from: "BOM", to: "LHR", label: "Mumbai → London" },
    { from: "JFK", to: "LAX", label: "New York → Los Angeles" },
    { from: "SIN", to: "SYD", label: "Singapore → Sydney" },
    { from: "CDG", to: "FRA", label: "Paris → Frankfurt" },
    { from: "DOH", to: "DXB", label: "Qatar → Dubai" },
    { from: "DEL", to: "BKK", label: "Delhi → Bangkok" },
  ];

  const fetchFlights = useCallback(
    async (fromCode = from, toCode = to) => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`http://localhost:4000/flights?dep_iata=${fromCode}&arr_iata=${toCode}`);
        // 🔍 Filter flights in frontend based on selected route
        const allFlights = res.data.data || [];
        const filtered = allFlights.filter(
          (f) =>
            f.departure?.iata?.toUpperCase() === fromCode.toUpperCase() &&
            f.arrival?.iata?.toUpperCase() === toCode.toUpperCase()
        );
        setFlights(filtered);
      } catch (err) {
        console.error("Error fetching flights:", err);
        setError("Failed to load flight data. Please try again later.");
      } finally {
        setLoading(false);
      }
    },
    [from, to]
  );

 useEffect(() => {
  if (from && to) {
    fetchFlights();
  }
}, [fetchFlights, from, to]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!from || !to) {
      alert("Please enter both source and destination airport codes!");
      return;
    }
    fetchFlights(from, to);
  };

  const handleRouteClick = (route) => {
    setFrom(route.from);
    setTo(route.to);
    fetchFlights(route.from, route.to);
  };

  return (
    <div className="flights-page">
      {/* Banner Section */}
      <div className="banner-section">
        <img
          src="https://www.thewowstyle.com/wp-content/uploads/2021/08/Flights-1-1.jpg"
          alt="Flight Banner"
          className="flights-banner"
        />

        {/* Search Bar */}
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="From (e.g. DEL)"
            value={from}
            onChange={(e) => setFrom(e.target.value.toUpperCase())}
          />
          <input
            type="text"
            placeholder="To (e.g. DXB)"
            value={to}
            onChange={(e) => setTo(e.target.value.toUpperCase())}
          />
          <button type="submit">Search Flights</button>
        </form>

        {/* Quick Routes */}
        <div className="quick-routes">
          <h3>🌍 Popular Routes</h3>
          <div className="routes-list">
            {routes.map((r, i) => (
              <button
                key={i}
                className={`route-btn ${
                  from === r.from && to === r.to ? "active" : ""
                }`}
                onClick={() => handleRouteClick(r)}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Flights Section */}
      <div className="flights-content">
        <h2>
          ✈️ Live Flights ({from} → {to})
        </h2>

        {loading && <p className="loading">Loading flights...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && flights.length === 0 && (
          <p className="no-flights">No flights found for this route.</p>
        )}

        {!loading && flights.length > 0 && (
          <ul className="flights-list">
            {flights.map((flight, index) => (
              <li key={index} className="flight-card">
                <h3>{flight.airline?.name || "Unknown Airline"}</h3>
                <p>
                  <strong>Flight:</strong> {flight.flight?.iata || "N/A"}
                </p>
                <p>
                  <strong>From:</strong> {flight.departure?.airport || "N/A"} (
                  {flight.departure?.iata || "?"})
                </p>
                <p>
                  <strong>To:</strong> {flight.arrival?.airport || "N/A"} (
                  {flight.arrival?.iata || "?"})
                </p>
                <span
                  className={`status ${
                    flight.flight_status === "active"
                      ? "active"
                      : flight.flight_status === "landed"
                      ? "landed"
                      : "delayed"
                  }`}
                >
                  {flight.flight_status || "N/A"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Flights;
