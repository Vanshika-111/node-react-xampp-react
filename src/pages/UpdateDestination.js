import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function UpdateDestination() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    destination_id: "",
    name: "",
    image: "",
    description: "",
    status: "Active",
  });

  // Fetch existing destination
  useEffect(() => {
    fetch(`http://localhost:4000/api/destinations/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setFormData({
          destination_id: data.destination_id || "",
          name: data.name || "",
          image: data.image || "",
          description: data.description || "",
          status: data.status || "Active",
        });
      })
      .catch((err) => console.error("Error fetching destination:", err));
  }, [id]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:4000/api/destinations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update destination");

      alert("Destination updated successfully!");
      navigate("/destinations");
    } catch (err) {
      console.error("Error updating destination:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Update Destination</h2>
      
      <form onSubmit={handleSubmit} style={{ maxWidth: "500px" }}>
        <label>Destination ID</label>
        <input
          type="text"
          name="destination_id"
          value={formData.destination_id}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <label>Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <label>Image URL</label>
        <input
          type="text"
          name="image"
          value={formData.image}
          onChange={handleChange}
          style={inputStyle}
        />

        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          style={{ ...inputStyle, resize: "none" }}
        />

        <label>Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          style={inputStyle}
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <button type="submit" 
        style={btnStyle}
        onClick={() => navigate("/destinations" )}>
          
          Update Destination
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  margin: "8px 0 16px",
  borderRadius: "5px",
  border: "1px solid #ccc",
};

const btnStyle = {
  padding: "10px 20px",
  backgroundColor: "#28a745",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
 
};

export default UpdateDestination;
