import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Destinations() {
  const [destinations, setDestinations] = useState([]);
  const navigate = useNavigate();

  const fetchDestinations = () => {
    fetch("http://localhost:4000/api/destinations")
      .then((res) => res.json())
      .then((data) => setDestinations(data))
      .catch((err) => console.error("Error fetching destinations:", err));
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this destination?")) {
      fetch(`http://localhost:4000/api/destinations/${id}`, {
        method: "DELETE",
      })
        .then((res) => {
          if (res.ok) {
            setDestinations(destinations.filter((dest) => dest.id !== id));
          } else {
            alert("Failed to delete destination");
          }
        })
        .catch((err) => console.error("Error deleting destination:", err));
    }
  };
  

  return (
    <div style={{ padding: "1px", background: "#f5f7fa", minHeight: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <h2 style={{ margin: 0 }}>Destinations</h2>
        <button
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
          onClick={() => navigate("/destinations/add")}
        >
          + Add Destination
        </button>
      </div>

      <div style={{ background: "#fff", padding: "20px", borderRadius: "12px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#007bff", color: "#fff" }}>
              <th style={{ padding: "12px" }}>S.No</th>
              <th style={{ padding: "12px" }}>Name</th>
              <th style={{ padding: "12px" }}>Image</th>
              <th style={{ padding: "12px" }}>Description</th>
              <th style={{ padding: "12px" }}>Status</th>
              <th style={{ padding: "12px" }}>Created At</th>
              <th style={{ padding: "12px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {destinations.length > 0 ? (
              destinations.map((dest, index) => (
                <tr key={dest.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "12px" }}>{index + 1}</td>
                  <td style={{ padding: "12px" }}>{dest.name}</td>
                  <td style={{ padding: "12px" }}>
                    {dest.image ? <img src={dest.image} alt={dest.name} width="80" /> : "No Image"}
                  </td>
                  <td style={{ padding: "12px" }}>{dest.description || "-"}</td>
                  <td style={{ padding: "12px" }}>{dest.status || "Active"}</td>
                  <td style={{ padding: "12px" }}>
                    {new Date(dest.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "12px" }}>
                    <button
                      style={{
                        background: "#f0ad4e",
                        color: "#fff",
                        padding: "6px 12px",
                        border: "none",
                        borderRadius: "5px",
                        marginRight: "8px",
                        cursor: "pointer",
                      }}
                      onClick={() => navigate(`/destinations/edit/${dest.id}`)}
                    >
                      Edit
                    </button>
                    <button
                      style={{
                        background: "#dc3545",
                        color: "#fff",
                        padding: "6px 12px",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleDelete(dest.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                  No destinations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Destinations;
