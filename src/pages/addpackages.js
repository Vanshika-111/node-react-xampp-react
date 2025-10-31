import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AddPackages() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    package_id: "",
    name: "",
    price: "",
    nd: "",
    image: "",
    description: "",
    destination_id: "",
    status: "Active",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/destinations")
      .then(res => res.json())
      .then(data => setDestinations(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4000/api/packages/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to add package");

      navigate("/itineraries/" + formData.package_id);
    } catch (err) {
      console.error("Error adding package:", err);
      alert("Failed to add package");
    }
  };

  return (
    <div style={{ padding: "50px", background: "#f5f6fa", minHeight: "100vh" }}>
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          background: "#fff",
          borderRadius: "15px",
          padding: "30px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "25px", color: "#333" }}>
          Add New Package
        </h2>

        <button
          style={{
            display: "block",
            margin: "0 auto 25px auto",
            padding: "10px 20px",
            backgroundColor: formData.package_id ? "#28a745" : "#a5d6a7",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: formData.package_id ? "pointer" : "not-allowed",
            fontWeight: "600",
            opacity: formData.package_id ? 1 : 0.6,
            transition: "all 0.3s ease",
          }}
          disabled={!formData.package_id}
          onClick={() => navigate("/itineraries/" + formData.package_id)}
        >
          View Itineraries
        </button>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gap: "15px",
          }}
        >
          <input
            type="text"
            name="package_id"
            placeholder="Package ID"
            value={formData.package_id}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            type="text"
            name="name"
            placeholder="Package Name"
            value={formData.name}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            type="number"
            name="price"
            placeholder="Price (INR)"
            value={formData.price}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            type="text"
            name="nd"
            placeholder="N/D"
            value={formData.nd}
            onChange={handleChange}
            style={inputStyle}
          />
          <input
            type="text"
            name="image"
            placeholder="Image URL"
            value={formData.image}
            onChange={handleChange}
            style={inputStyle}
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            style={{ ...inputStyle, resize: "vertical" }}
          />

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <select
            value={formData.destination_id}
            onChange={(e) =>
              setFormData({ ...formData, destination_id: e.target.value })
            }
            required
            style={inputStyle}
          >
            <option value="">Select Destination</option>
            {destinations.map((dest) => (
              <option key={dest.id} value={dest.id}>
                {dest.name}
              </option>
            ))}
          </select>

          <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
            <button type="submit" style={submitBtnStyle}>
              Save
            </button>
            <button
              type="button"
              onClick={() => navigate("/packages")}
              style={cancelBtnStyle}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Shared input style
const inputStyle = {
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "16px",
  outline: "none",
  transition: "border 0.3s ease",
};

const submitBtnStyle = {
  flex: 1,
  padding: "12px",
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  transition: "background 0.3s ease",
};

const cancelBtnStyle = {
  flex: 1,
  padding: "12px",
  backgroundColor: "#6c757d",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  transition: "background 0.3s ease",
};

export default AddPackages;
