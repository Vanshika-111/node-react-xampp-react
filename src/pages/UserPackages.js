import { useEffect, useState } from "react";
import "./UserPackages.css";
import { useNavigate } from "react-router-dom";

function UserPackages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/packages");
        if (!res.ok) throw new Error("Failed to fetch packages");
        const data = await res.json();
        setPackages(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load tour packages at the moment. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const handleBookNow = (id) => {
    navigate(`/packages/${id}`);
  };

  return (
    <section className="user-packages-section">
      <div className="cs_height_135 cs_height_lg_75"></div>

      <div className="container text-center">
        <div className="cs_section_heading cs_style_1">
          <h3 className="cs_section_title_up cs_accent_color cs_fs_24">
            CHOOSE YOUR PACKAGE
          </h3>
          <h2 className="cs_section_title cs_semibold cs_fs_56 mb-0">
            Popular Tour Packages
          </h2>
          <p className="cs_section_subtitle">
            Explore destinations, adventures, and unforgettable memories.
          </p>
        </div>
      </div>

      <div className="cs_height_55 cs_height_lg_40"></div>

      <div className="container-fluid">
        {loading ? (
          <div className="user-packages-loader text-center">
            <div className="spinner"></div>
            <p>Loading packages...</p>
          </div>
        ) : error ? (
          <p className="error-text text-center">{error}</p>
        ) : packages.length === 0 ? (
          <p className="text-center no-packages-text">
            No tour packages available at the moment.
          </p>
        ) : (
          <div className="row cs_gap_y_24 justify-content-center">
            {packages.map((pkg) => (
              <div className="col-xl-3 col-lg-4 col-md-6 col-sm-10" key={pkg.id}>
                <div
                  className="cs_card cs_style_1 cs_radius_10 position-relative"
                  style={{ backgroundImage: `url(${pkg.image})` }}
                >
                  <div className="cs_card_overlay cs_radius_10"></div>
                  <div className="cs_card_content position-absolute">
                    <div className="cs_card_meta cs_white_color">
                      <div>
                        <i className="fa-solid fa-location-dot"></i>
                        <span>{pkg.location}</span>
                      </div>
                      <div>
                        <i className="fa-regular fa-clock"></i>
                        <span>{pkg.days}</span>
                      </div>
                      <div>
                        <i className="fa-solid fa-star"></i>
                        <span>{pkg.rating}</span>
                      </div>
                    </div>

                    <h2 className="cs_card_title cs_fs_24 cs_medium cs_white_color">
                      {pkg.name}
                    </h2>

                    <div className="cs_card_action">
                      <button
                        onClick={() => handleBookNow(pkg.id)}
                        className="cs_btn cs_style_1 cs_fs_18 cs_medium"
                      >
                        Book Now
                      </button>
                      <span className="cs_card_price cs_fs_22 cs_medium cs_white_color mb-0">
                        ₹{pkg.price}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default UserPackages;
