// TravellerDetails.js
import React, { useState } from "react";
import { useLocation, useNavigate, } from "react-router-dom";
import "./TravellerDetails.css";

const TravellerDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { formData, selectedDate, packageData, totalPrice } = location.state || {};
  const travelerCount = formData?.travelers || 1;

  const [travelers, setTravelers] = useState(
    Array.from({ length: travelerCount }, () => ({
      fullName: "",
      age: "",
      gender: "",
      idProof: "",
      specialRequest: "",
    }))
  );

  const handleChange = (index, field, value) => {
    const updatedTravelers = [...travelers];
    updatedTravelers[index][field] = value;
    setTravelers(updatedTravelers);
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();

    console.log("Final Booking Details:", {
      mainContact: formData,
      travelers,
      selectedDate,
      packageData,
      totalPrice,
    });

    alert("🎉 Booking Confirmed Successfully!");
    navigate("/booking-confirmation", {
      state: { formData, travelers, selectedDate, packageData, totalPrice },
    });
  };

  return (
    <div className="traveller-details-container">
      <div className="traveller-left">
        <h1>Traveler Information</h1>

        <form onSubmit={handleFinalSubmit} className="traveller-form">
          {travelers.map((traveler, index) => (
            <div key={index} className="traveler-box">
              <h3>Traveler {index + 1}</h3>

              <label>
                Full Name:
                <input
                  type="text"
                  required
                  value={traveler.fullName}
                  onChange={(e) => handleChange(index, "fullName", e.target.value)}
                />
              </label>

              <label>
                Age:
                <input
                  type="number"
                  min="1"
                  required
                  value={traveler.age}
                  onChange={(e) => handleChange(index, "age", e.target.value)}
                />
              </label>

              <label>
                Gender:
                <select
                  required
                  value={traveler.gender}
                  onChange={(e) => handleChange(index, "gender", e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </label>

              <label>
                ID Proof (Aadhaar/Passport/PAN):
                <input
                  type="text"
                  required
                  value={traveler.idProof}
                  onChange={(e) => handleChange(index, "idProof", e.target.value)}
                />
              </label>

              <label>
                Special Requests:
                <textarea
                  rows="2"
                  placeholder="e.g., vegetarian meals, window seat..."
                  value={traveler.specialRequest}
                  onChange={(e) =>
                    handleChange(index, "specialRequest", e.target.value)
                  }
                ></textarea>
              </label>
            </div>
          ))}

          <button type="submit" className="final-btn">
            Confirm Final Booking
          </button>
        </form>
      </div>

      <div className="traveller-right">
        {packageData && (
          <div className="summary-box">
            <h2>{packageData.title}</h2>
            <p>{packageData.description}</p>
            <p>
              <strong>Travel Date:</strong> {selectedDate}
            </p>
            <p>
              <strong>Travelers:</strong> {travelerCount}
            </p>
            <p>
              <strong>Total Price:</strong> ₹{totalPrice}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TravellerDetails;
