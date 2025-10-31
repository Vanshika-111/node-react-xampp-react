import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

function Packages() {
  const [packages, setPackages] = useState([]);
  const navigate = useNavigate();

  // Fetch all packages
  useEffect(() => {
    fetch("http://localhost:4000/api/packages")
      .then((res) => res.json())
      .then((data) => setPackages(data))
      .catch((err) => console.error("Error fetching packages:", err));
  }, []);

  // Delete a package
  const handleDeletePackage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this package?")) return;

    try {
      const response = await fetch(`http://localhost:4000/api/packages/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete package");
      setPackages((prev) => prev.filter((pkg) => pkg.id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting package.");
    }
  };

  // Handle Excel Download
  const handleDownloadExcel = () => {
    if (!packages.length) {
      alert("No packages available to download.");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(packages);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Packages");

    XLSX.writeFile(workbook, "packages.xlsx");
  };

  // Handle Excel Upload
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

        const formatted = jsonData.map((row) => ({
          package_id: row.package_id || "",
          name: row.name || "",
          price: Number(row.price) || 0,
          nd: row.nd || "",
          image: row.image || "",
          created_at: row.created_at
            ? new Date(row.created_at).toISOString().slice(0, 19).replace("T", " ")
            : new Date().toISOString().slice(0, 19).replace("T", " "),
          modify_date: row.modify_date
            ? new Date(row.modify_date).toISOString().slice(0, 19).replace("T", " ")
            : null,
          status: row.status || "Active",
          destination_id: row.destination_id || null,
        }));

        const response = await fetch("http://localhost:4000/api/packages/bulk-insert", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ packages: formatted }),
        });

        if (!response.ok) throw new Error(`Upload failed: ${response.status}`);

        const result = await response.json();
        if (result.success) {
          const updated = await fetch("http://localhost:4000/api/packages").then(res => res.json());
          setPackages(updated);
          alert(`Uploaded ${result.inserted} packages successfully.`);
        } else {
          throw new Error(result.error || "Bulk upload failed");
        }
      } catch (err) {
        console.error("Error processing Excel upload:", err);
        alert("There was a problem uploading the Excel file.");
      } finally {
        e.target.value = null; // Reset file input
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="packages-container">
      <div className="packages-header">
        <h2>Packages</h2>
        <div className="header-buttons">
          <button onClick={() => navigate("/packages/add")}>+ Add Package</button>

          <label>
            Upload Excel
            <input type="file" accept=".xlsx, .xls" hidden onChange={handleFileUpload} />
          </label>

          <button onClick={handleDownloadExcel}>Download Excel</button>
        </div>
      </div>

      <div className="packages-table-wrapper">
        {packages.length > 0 ? (
          <table className="packages-table">
            <thead>
              <tr>
                {["S.No","Image","PackageID","Name","Price","N/D","Created Date","Modify Date","Status","Action"].map((head) => (
                  <th key={head}>{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {packages.map((pkg, index) => (
                <tr key={pkg.id} className="package-row">
                  <td>{index + 1}</td>
                  <td>
                    <img src={pkg.image || "https://via.placeholder.com/50"} alt={pkg.name} className="package-image" />
                  </td>
                  <td>{pkg.package_id}</td>
                  <td>{pkg.name}</td>
                  <td>${pkg.price}</td>
                  <td>{pkg.nd}</td>
                  <td>{new Date(pkg.created_at).toLocaleDateString()}</td>
                  <td>{pkg.modify_date}</td>
                  <td>
                    <span className={`status-badge ${pkg.status.toLowerCase()}`}>{pkg.status}</span>
                  </td>
                  <td className="action-buttons">
                    <button className="edit-btn" onClick={() => navigate(`/packages/edit/${pkg.id}`)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDeletePackage(pkg.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-data">No packages available. Try adding one!</div>
        )}
      </div>

      {/* CSS Styles */}
      <style jsx>{`
        .packages-container { padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f0f2f7; min-height: 100vh; }
        .packages-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .packages-header h2 { font-size: 32px; color: #222; }
        .packages-header button, label { padding: 12px 20px; background: linear-gradient(90deg,#4a90e2,#007bff); color: #fff; border-radius: 8px; font-weight: 600; cursor: pointer; margin-left: 7px; border: none; }
        label { position: relative; overflow: hidden; }
        label input { display: none; }
        .packages-table-wrapper { overflow-x: auto; }
        .packages-table { width: 100%; border-collapse: separate; border-spacing: 0; min-width: 900px; }
        .packages-table th { background: #007bff; color: #fff; padding: 16px 12px; text-align: left; font-weight: 600; font-size: 15px; position: sticky; top: 0; z-index: 1; }
        .packages-table td { padding: 14px 12px; font-size: 14px; vertical-align: middle; }
        .package-row { background: #fff; border-radius: 10px; box-shadow: 0 3px 8px rgba(0,0,0,0.05); transition: transform 0.2s, box-shadow 0.2s; }
        .package-row:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,0.1); }
        .package-image { width: 30px; height: 30px; object-fit: cover; border-radius: 8px; }
        .status-badge { padding: 4px 10px; border-radius: 12px; font-weight: 600; font-size: 13px; text-align: center; }
        .status-badge.active { background: #d4edda; color: #28a745; }
        .status-badge.inactive { background: #f8d7da; color: #dc3545; }
        .action-buttons { display: flex; gap: 8px; }
        .edit-btn { background: #ffc107; color: #fff; border: none; border-radius: 6px; padding: 6px 14px; cursor: pointer; }
        .delete-btn { background: #dc3545; color: #fff; border: none; border-radius: 6px; padding: 6px 14px; cursor: pointer; }
        .no-data { text-align: center; padding: 40px 0; color: #555; font-style: italic; font-size: 16px; }
      `}</style>
    </div>
  );
}

export default Packages;
