import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./UserDestination.css";

const UserDestination = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/destinations/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch destination");
        }
        const data = await res.json();
        setDestination(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchDestination();
  }, [id]);

  if (loading) {
    return <p className="loading">Loading...</p>;
  }

  if (error || !destination) {
    return (
      <div className="error">
        <h2>{error || "Destination not found"}</h2>
        <button className="back-button" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="user-destination-wrapper">
      <div className="user-destination-container">
        <img
          src={destination.image}
          alt={destination.name}
          className="user-destination-image"
        />

        <h1 className="user-destination-title">{destination.name}</h1>
        <p className="user-destination-description">
          {destination.description}
        </p>

        <div className="user-destination-info">
          <div className="info-card">
            <strong>Days:</strong> {destination.days || "N/A"}
          </div>
          <div className="info-card">
            <strong>Rating:</strong> {destination.rating || "N/A"} ★
          </div>
        </div>

        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>
    </div>
  );
};

export default UserDestination;
