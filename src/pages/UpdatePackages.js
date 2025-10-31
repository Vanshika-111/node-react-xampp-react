import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function UpdatePackages() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    package_id: "",
    name: "",
    price: "",
    nd: "",
    status: "Active",
    image: " ",
    description: "",
    destination_name:" ",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [destinations, setDestinations] = useState([]);
  
  useEffect(() => {
    fetch("http://localhost:4000/api/destinations")
      .then(res => res.json())
      .then(data => setDestinations(data));
  }, []);

  // Fetch package by ID
  useEffect(() => {
    fetch(`http://localhost:4000/api/packages/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Package not found");
        return res.json();
      })
      .then((data) => {
        setFormData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching package:", err);
        setError("Could not load package details.");
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:4000/api/packages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update package");

      navigate("/packages"); // ✅ redirect back
    } catch (err) {
      console.error("Error updating package:", err);
      alert("Failed to update package");
    }
  };

  if (loading) return <p style={{ padding: "20px" }}>Loading...</p>;
  if (error) return <p style={{ padding: "20px", color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "40px" }}>
      <h2>Edit Package</h2>
      <button
      style={{
        margin: "10px 0 20px 0",
        padding: "8px 16px",
        backgroundColor: formData.package_id ? "#28a745" : "#a5d6a7", // green if enabled, light green if disabled
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: formData.package_id ? "pointer" : "not-allowed",
        fontWeight: "600",
        opacity: formData.package_id ? 1 : 0.6,
      }}
      disabled={!formData.package_id} // ✅ disable if no Package ID
      onClick={() => navigate("/itineraries/" + formData.package_id)}
      >
        Itineraries
      </button>
      <button
      style={{
        margin: "10px 10px 20px 0",
        padding: "8px 16px",
        backgroundColor: formData.package_id ? "#28a745" : "#a5d6a7", // green if enabled, light green if disabled
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: formData.package_id ? "pointer" : "not-allowed",
        fontWeight: "600",
        opacity: formData.package_id ? 1 : 0.6,
      }}
      disabled={!formData.package_id} // ✅ disable if no Package ID
      onClick={() => navigate("/itineraries/" + formData.package_id)}
      >
        Upload Excel
      </button>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gap: "15px",
          maxWidth: "500px",
          background: "#fff",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 6px 14px rgba(0,0,0,0.08)",
        }}
      >
        <input
          type="text"
          name="package_id"
          placeholder="Package ID"
          value={formData.package_id}
          onChange={handleChange}
          style={inputStyle}
          required
        />
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          style={inputStyle}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          style={inputStyle}
          required
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
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          style={{ ...inputStyle, minHeight: "80px" }}
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


        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="submit"
            style={{
              flex: 1,
              padding: "10px 20px",
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Update
          </button>
          <button
            type="button"
            style={{
              flex: 1,
              padding: "10px 20px",
              backgroundColor: "#6c757d",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "600",
            }}
            onClick={() => navigate("/packages")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

const inputStyle = {
  padding: "10px 12px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  fontSize: "14px",
};

export default UpdatePackages;
