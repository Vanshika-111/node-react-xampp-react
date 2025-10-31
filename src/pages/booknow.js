import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import "./BookNow.css";

const BookNow = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const packageData = location.state?.packageData || null;
  const selectedDate =
    location.state?.selectedDate || localStorage.getItem(`fixedDate_${id}`);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    travelers: 1,
  });

  const [fetchedPackage, setFetchedPackage] = useState(packageData);
  const [totalPrice, setTotalPrice] = useState(0);

  // ✅ Fetch package if not passed from previous page
  useEffect(() => {
    if (!packageData) {
      fetch(`http://localhost:5000/api/packages/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setFetchedPackage(data);
          setTotalPrice(data.price);
        })
        .catch((err) => console.error(err));
    } else {
      setFetchedPackage(packageData);
      setTotalPrice(packageData.price);
    }
  }, [id, packageData]);

  // ✅ Update total price dynamically
  useEffect(() => {
    if (fetchedPackage?.price) {
      setTotalPrice(formData.travelers * fetchedPackage.price);
    }
  }, [formData.travelers, fetchedPackage]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    if (!selectedDate) {
      alert("No date selected. Please go back and choose a date.");
      navigate(`/packagedetails/${id}`);
      return;
    }

    navigate(`/traveller-details/${id}`, {
      state: { formData, selectedDate, packageData: fetchedPackage, totalPrice },
    });
  };

  return (
    <div className="booknow-container">
      <div className="booknow-left">
        <h1>Booking Details</h1>

        <div className="booking-info">
          <p>
            <strong>Travel Date:</strong>{" "}
            <span className="highlight">{selectedDate || "Not selected"}</span>
          </p>
        </div>

        <form className="booking-form" onSubmit={handleConfirmBooking}>
          <label>
            Full Name:
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
            />
          </label>

          <label>
            Email Address:
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </label>

          <label>
            Phone Number:
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
            />
          </label>

          <label>
            No. of Travelers:
            <input
              type="number"
              name="travelers"
              min="1"
              value={formData.travelers}
              onChange={handleChange}
            />
          </label>

          <div className="total-price-box">
            <strong>Total Price: </strong>
            <span className="price">₹{totalPrice || 0}</span>
          </div>

          <button type="submit" className="confirm-btn">
            Confirm Booking
          </button>
        </form>
      </div>

      <div className="booknow-right">
        {fetchedPackage ? (
          <div className="package-summary">
            <h2>{fetchedPackage.title}</h2>
            <p>{fetchedPackage.description}</p>
            <p>
              <strong>Base Price (per traveler):</strong> ₹{fetchedPackage.price}
            </p>
            <p>
              <strong>Duration:</strong> {fetchedPackage.duration}
            </p>
          </div>
        ) : (
          <p>Loading package details...</p>
        )}
      </div>
    </div>
  );
};

export default BookNow;
