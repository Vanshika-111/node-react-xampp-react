import { useEffect, useState, useCallback  } from "react";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx"; // for Excel upload

function Itineraries() {
  const { id: packageId } = useParams();
  const [itineraries, setItineraries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    day: "",
    heading: "",
    destinations: "",
    pois: "",
  });

 const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbyjPvGzyXJjKHGekVxAuX-8_4kQpntf8lG2fqSqDDhrsLZ243f-aWtGpHaWIO3DSmSkAw/exec";

  // Helper function to sync with Google Sheets
const sendToGoogleSheet = async (payload, action, id = null, packageId) => {
  try {
    const requestBody = {
      action: action,
      payload: payload,
      ...(id && { id: id }),
      packageId,
    };

    console.log("🚀 Sending to Google Sheets:", {
      url: GOOGLE_SHEETS_URL,
      requestBody: requestBody,
    });

    const response = await fetch(GOOGLE_SHEETS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    console.log("📡 Response status:", response.status);
    console.log("📡 Response ok:", response.ok);

    const contentType = response.headers.get("content-type");
    console.log("📡 Content-Type:", contentType);

    if (!contentType || !contentType.includes("application/json")) {
      const textResponse = await response.text();
      console.error("❌ Non-JSON response:", textResponse);
      return { success: false, error: "Invalid JSON response" };
    }

    const result = await response.json();
    console.log("📊 Full response:", result);

    if (!result.success) {
      console.error("❌ Google Sheets sync failed:", result.error);
      return { success: false, error: result.error };
    } else {
      console.log("✅ Google Sheets sync successful:", result.data);
      return { success: true, data: result.data };
    }
  } catch (error) {
    console.error("💥 Error syncing with Google Sheets:", error.message);
    return { success: false, error: error.message };
  }
};


  // Fetch itineraries
  useEffect(() => {
    fetch(`http://localhost:4000/api/packages/${packageId}/itineraries`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => setItineraries(data))
      .catch((err) => alert(`Failed to load itineraries: ${err.message}`));
  }, [packageId]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      destinations: form.destinations.split(",").map((d) => d.trim()).filter(Boolean),
      pois: form.pois.split(",").map((p) => p.trim()).filter(Boolean),
    };

    if (editingId) {
      // UPDATE existing itinerary
      try {
        const response = await fetch(`http://localhost:4000/api/itineraries/update/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        
        const updatedItinerary = await response.json();
        
        setItineraries((prev) =>
          prev.map((it) => (it.id === editingId ? updatedItinerary : it))
        );

        // Sync with Google Sheets
        await sendToGoogleSheet({
          ...payload,
          id: editingId
        }, 'update', editingId);

        setForm({ day: "", heading: "", destinations: "", pois: "" });
        setEditingId(null);
        setShowForm(false);
      } catch (err) {
        console.error("Error updating itinerary:", err);
      }
    } else {
      // ADD new itinerary
      try {
        const response = await fetch(`http://localhost:4000/api/packages/${packageId}/itineraries/add`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        
        const newItinerary = await response.json();
        
        setItineraries((prev) => [...prev, newItinerary]);

        // Sync with Google Sheets
        await sendToGoogleSheet({
          ...payload,
          id: newItinerary.id // Use the ID returned from your API
        }, 'add');

        setForm({ day: "", heading: "", destinations: "", pois: "" });
        setShowForm(false);
      } catch (err) {
        console.error("Error adding itinerary:", err);
      }
    }
  };


const fetchFromSheets = useCallback(async () => {
  try {
    const response = await fetch(GOOGLE_SHEETS_URL);
    const result = await response.json();
    console.log("📊 Data from Google Sheets:", result);

    if (result.success) {
      // Map Google Sheets data into the format your table expects
      const formattedData = result.data
        .filter(item => item.ID?.toString() === packageId.toString())
        .map(item => ({
          id: item.ID || Math.random().toString(36).substr(2, 9),
          day: Number(item.Day) || item.day || "",
          heading: item.Heading || item.heading || "",
          destinations: item.Destinations?.split(",").map(d => d.trim()) || [],
          pois: item.POIs?.split(",").map(p => p.trim()) || [],
        }));

      setItineraries(formattedData);
    } else {
      console.error("❌ Failed to fetch from Sheets:", result.error);
    }
  } catch (error) {
    console.error("💥 Error fetching from Sheets:", error.message);
  }
}, [packageId]);

useEffect(() => {
  fetchFromSheets();
  const interval = setInterval(() => {
    fetchFromSheets(); // refresh every 10s
  }, 10000);

  return () => clearInterval(interval); 
}, [fetchFromSheets]);




  const handleEdit = (itinerary) => {
    setForm({
      day: itinerary.day,
      heading: itinerary.heading,
      destinations: Array.isArray(itinerary.destinations)
        ? itinerary.destinations.join(", ")
        : itinerary.destinations,
      pois: Array.isArray(itinerary.pois)
        ? itinerary.pois.join(", ")
        : itinerary.pois,
    });
    setEditingId(itinerary.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:4000/api/itineraries/delete/${id}`, { 
        method: "DELETE" 
      });
      
      setItineraries((prev) => prev.filter((i) => i.id !== id));

      // Sync with Google Sheets
      await sendToGoogleSheet(null, 'delete', id);
      
    } catch (err) {
      console.error("Error deleting itinerary:", err);
    }
  };

  const closeModal = () => {
    setShowForm(false);
    setForm({ day: "", heading: "", destinations: "", pois: "" });
    setEditingId(null);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) closeModal();
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && showForm) closeModal();
    };
    if (showForm) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [showForm]);

  // Enhanced file upload with Google Sheets sync
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        if (!jsonData.length) {
          alert("Excel sheet is empty or not formatted correctly.");
          return;
        }

        const maxDay = itineraries.length
          ? Math.max(0, ...itineraries.map((it) => Number(it.day) || 0))
          : 0;
        const startDay = maxDay + 1;

        const formatted = jsonData.map((row, idx) => ({
          day: startDay + idx,
          heading: row.Heading ?? row.heading ?? "",
          destinations:
            row.Destinations && typeof row.Destinations === "string"
              ? row.Destinations.split(",").map((d) => d.trim()).filter(Boolean)
              : [],
          pois:
            row.POIs && typeof row.POIs === "string"
              ? row.POIs.split(",").map((p) => p.trim()).filter(Boolean)
              : [],
        }));

        // Send to your API
        const uploadPromises = formatted.map((item) =>
          fetch(`http://localhost:4000/api/packages/${packageId}/itineraries/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item),
          }).then((res) => {
            if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
            return res.json();
          })
        );

        const newItineraries = await Promise.all(uploadPromises);

        // Sync all new itineraries with Google Sheets
        const googleSheetsPromises = newItineraries.map((itinerary) =>
          sendToGoogleSheet({
            ...itinerary,
            destinations: Array.isArray(itinerary.destinations) 
              ? itinerary.destinations 
              : itinerary.destinations.split(',').map(d => d.trim()).filter(Boolean),
            pois: Array.isArray(itinerary.pois) 
              ? itinerary.pois 
              : itinerary.pois.split(',').map(p => p.trim()).filter(Boolean),
          }, 'add')
        );

        // Wait for Google Sheets sync (optional - you can do this without waiting)
        await Promise.all(googleSheetsPromises);

        setItineraries((prev) => {
          const combined = [...prev, ...newItineraries];
          combined.sort((a, b) => Number(a.day) - Number(b.day));
          return combined;
        });

        alert(`Uploaded ${newItineraries.length} itineraries and synced with Google Sheets.`);
      } catch (err) {
        console.error("Error processing Excel upload:", err);
        alert("There was a problem uploading the Excel file. Check console for details.");
      } finally {
        e.target.value = null;
      }
    };

    reader.readAsArrayBuffer(file);
  };
  const handleDownloadExcel = () => {
  if (!itineraries.length) {
    alert("No itineraries to download.");
    return;
  }

  // Convert itineraries into a worksheet format
  const worksheetData = itineraries.map(it => ({
    Day: it.day,
    Heading: it.heading,
    Destinations: Array.isArray(it.destinations) ? it.destinations.join(", ") : it.destinations,
    POIs: Array.isArray(it.pois) ? it.pois.join(", ") : it.pois,
  }));

  // Create a worksheet
  const worksheet = XLSX.utils.json_to_sheet(worksheetData);

  // Create a new workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Itineraries");

  // Generate Excel file and trigger download
  XLSX.writeFile(workbook, `itineraries_package_${packageId}.xlsx`);
};

  // ---------- end upload handler ----------

    return (
  <div style={{ padding: "1.5rem", width: "100%" }}>
    <h2 style={{ fontSize: "2.0rem", fontWeight: "700", marginBottom: "1.5rem",
    color: "#1f2937" ,
     fontFamily: "Poppins', sans-serif" }}>
      ITINERARIES FOR PACKAGE {packageId}
    </h2>

    {/* Add Itinerary Button */}
    {/* Buttons Row */}
    <div
    style={{
    display: "flex",
    justifyContent:"space-evenly", // keeps them at opposite ends
    alignItems: "center",
    marginBottom: "1.5rem",
  }}
>
  {/* Add Itinerary Button */}
  <button
  onClick={() => setShowForm(true)}
  style={{
    backgroundColor: "#2563eb",
    color: "#fff",
    padding: "0.5rem 1.5rem",   // same padding for both
    borderRadius: "0.5rem",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s",
    fontSize: "0.95rem",
    fontWeight: "500",
    minWidth: "150px",          // ensures consistent width
    textAlign: "center",
  }}
    onMouseEnter={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
    onMouseLeave={(e) => (e.target.style.backgroundColor = "#2563eb")}
  >
    + Add Itinerary
  </button>

  {/* Upload Button */}
  <label
    style={{
      padding: "0.5rem 0.5rem",
      backgroundColor: "#10b981",
      color: "#fff",
      borderRadius: "0.5rem",
      cursor: "pointer",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      transition: "all 0.2s",
      fontSize: "0.95rem",
      fontWeight: "500",
      minWidth: "150px",          // same width as Add Itinerary
      textAlign: "center",
    }}
    onMouseEnter={(e) => (e.target.style.backgroundColor = "#059669")}
    onMouseLeave={(e) => (e.target.style.backgroundColor = "#10b981")}
  >
    + Upload
    <input
      type="file"
      accept=".xlsx, .xls"
      style={{ display: "none" }}
      onChange={handleFileUpload}
    />
  </label>
    {/* Download Button */}
  <button
    onClick={handleDownloadExcel}
    style={{
      backgroundColor: "#9333ea",
      color: "#fff",
      padding: "0.5rem 1.5rem",
      borderRadius: "0.5rem",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      border: "none",
      cursor: "pointer",
      transition: "all 0.2s",
      fontSize: "0.95rem",
      fontWeight: "500",
      minWidth: "150px",
      textAlign: "center",
    }}
    onMouseEnter={(e) => (e.target.style.backgroundColor = "#7e22ce")}
    onMouseLeave={(e) => (e.target.style.backgroundColor = "#9333ea")}
  >
    ⬇ Download Excel
  </button>

</div>

    {/* Modal */}
    {showForm && (
      <div
        onClick={handleOverlayClick}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 50,
          padding: "1rem",
        }}
      >
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "1rem",
            boxShadow: "0 16px 48px rgba(0,0,0,0.2)",
            width: "100%",
            maxWidth: "32rem",
            padding: "1.5rem",
            transform: "scale(1.05)",
            transition: "transform 0.3s",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.25rem", alignItems: "center" }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#1f2937" }}>Add Itinerary</h3>
            <button
              onClick={closeModal}
              aria-label="Close modal"
              style={{ fontSize: "1.5rem", color: "#9ca3af", fontWeight: "700", lineHeight: "1", cursor: "pointer", background: "none", border: "none" }}
              onMouseEnter={(e) => (e.target.style.color = "#374151")}
              onMouseLeave={(e) => (e.target.style.color = "#9ca3af")}
            >
              ×
            </button>
          </div>

          <form onSubmit={handleAdd} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[
              { label: "Day", name: "day", type: "number", required: true },
              { label: "Heading", name: "heading", type: "text", required: true },
              { label: "Destinations", name: "destinations", type: "text" },
              { label: "Points of Interest", name: "pois", type: "text" },
            ].map((field) => (
              <div key={field.name}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, color: "#374151", marginBottom: "0.25rem" }}>{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  value={form[field.name]}
                  onChange={handleChange}
                  required={field.required}
                  style={{
                    width: "100%",
                    padding: "0.5rem 0.75rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "0.375rem",
                    outline: "none",
                    transition: "all 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.boxShadow = "0 0 0 2px rgba(59,130,246,0.3)")}
                  onBlur={(e) => (e.target.style.boxShadow = "none")}
                />
              </div>
            ))}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid #e5e7eb" }}>
              <button
                type="button"
                onClick={closeModal}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#e5e7eb",
                  color: "#374151",
                  borderRadius: "0.375rem",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#d1d5db")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#e5e7eb")}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#2563eb",
                  color: "#fff",
                  borderRadius: "0.375rem",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#2563eb")}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    )}

    {/* Enhanced Table */}
    <div style={{ overflowX: "auto", borderRadius: "1rem", boxShadow: "0 8px 24px rgba(0,0,0,0.1)", border: "1px solid #e5e7eb" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead style={{ position: "sticky", top: 0, backgroundColor: "#eff6ff", boxShadow: "0 2px 6px rgba(0,0,0,0.05)", zIndex: 20 }}>
          <tr>
            {["Day", "Heading", "Destinations", "POIs", "Actions"].map((head) => (
              <th key={head} style={{ padding: "1rem 1.5rem", textAlign: "left", fontSize: "0.875rem", fontWeight: 600, color: "#374151", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {head}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {itineraries.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ padding: "5rem 1.5rem", textAlign: "center", color: "#9ca3af", fontWeight: 500 }}>
                No itineraries found. Click "+ Add Itinerary" to create one.
              </td>
            </tr>
          ) : (
            itineraries.map((it, idx,item) => (
              <tr
                key={it.id}
                style={{
                  backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f9fafb",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#dbeafe")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = idx % 2 === 0 ? "#ffffff" : "#f9fafb")}
              >
                <td style={{ padding: "1rem 1.5rem", fontWeight: 500, color: "#374151" }}>{it.day}</td>
                <td style={{ padding: "1rem 1.5rem", color: "#374151" }}>{it.heading}</td>
                <td style={{ padding: "1rem 1.5rem", color: "#374151", maxWidth: "20rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {Array.isArray(it.destinations) ? it.destinations.join(", ") : it.destinations}
                </td>
                <td style={{ padding: "1rem 1.5rem", color: "#374151", maxWidth: "20rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {Array.isArray(it.pois) ? it.pois.join(", ") : it.pois}
                </td>
                <td style={{ padding: "1rem 1.5rem", textAlign: "center" }}>
                  <button
                  onClick={() => handleEdit(it)}
                  style={{
                    backgroundColor: "#f59e0b",
                    color: "#fff",
                    padding: "0.25rem 1rem",
                    borderRadius: "0.5rem",
                    border: "none",
                    cursor: "pointer",
                    marginRight: "0.5rem",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#d97706")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "#f59e0b")}
                  >
                    Edit
                    </button>
                  <button
                    onClick={() => handleDelete(it.id)}
                    style={{
                      backgroundColor: "#ef4444",
                      color: "#fff",
                      padding: "0.25rem 1rem",
                      borderRadius: "0.5rem",
                      border: "none",
                      cursor: "pointer",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = "#dc2626")}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = "#ef4444")}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);
}

export default Itineraries;
