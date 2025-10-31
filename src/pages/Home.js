import './Home.css'; // Import your CSS file
import './feature.css'; // Import your CSS file
import './travelpoint.css';
import './destinationstyle.css';
import './footer.css';
import { useEffect, useState} from "react";
import { useNavigate,useParams} from "react-router-dom";





// Hero Section like TravelPro
export function Hero() {
  const [destinations, setDestinations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:4000/api/destinations") // your backend endpoint
      .then((res) => res.json())
      .then((data) => setDestinations(data))
      .catch((err) => console.error("Error fetching destinations:", err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const destination = e.target.destination.value;
    if (destination && destination !== "Destination") {
      navigate(`/UserDestination/${destination.toLowerCase()}`); // navigate to dynamic destination page
    }
  };

  return (
    
    <section
      className="cs_hero cs_style_1 cs_center cs_ripple_activate cs_primary_bg"
      style={{ backgroundImage: "url('https://www.thewowstyle.com/wp-content/uploads/2019/07/Vietnam.jpg')",
        
         
       }}
    >
      <div className="container">
        <div className="cs_hero_text text-center">
          <h3 className="cs_hero_subtitle cs_white_color cs_ternary_font cs_fs_25 cs_normal text-uppercase">
            Bandook travels
          </h3>
          <h1 className="cs_hero_title cs_white_color cs_fs_100">
            Travel Top Destination <br /> of The World
          </h1>
        </div>
        <div className="cs_find_form_wrap">
        <form className="cs_find_form" onSubmit={handleSubmit}>
          <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
          />
          <div className="form-icons">
            <a href="/flights" className="form-icon" title="Book Flights">
        <i className="fa-solid fa-plane"></i>
      </a>
      <a href="/UserPackages" className="form-icon" title="View Packages">
        <i className="fa-solid fa-box"></i>
      </a>
    </div>
  <h2 className="cs_fs_18 cs_normal mb-0">Where to?</h2>
  
  <div className="cs_form_row">
    <select name="destination" className="st_select">
      <option>Destination</option>
      {destinations?.map((d) => (
        <option key={d.id} value={d.id}>
          {d.name}
        </option>
      ))}
    </select>

    <select className="st_select">
      <option>Guests</option>
      {[...Array(10)].map((_, i) => (
        <option key={i}>{i + 1}</option>
      ))}
    </select>

    <button className="cs_find_btn cs_bold cs_primary_font cs_center">
      <i className="fa-solid fa-magnifying-glass"></i> Find Now
    </button>
  </div>
</form>


        </div>
      </div>
    </section>
  );
} 
 

export function DestinationDetail() {
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  
  

  useEffect(() => {
    fetch(`http://localhost:4000/api/destinations/${id}`)
      .then((res) => res.json())
      .then((data) => setDestination(data))
      .catch((err) => console.error("Error fetching destination:", err));
  }, [id]);

  if (!destination) {
    return <p>Loading destination...</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>{destination.name}</h1>

      {destination.image && (
        <img
          src={destination.image}
          alt={destination.name}
          style={{
            maxWidth: "300px",
            borderRadius: "12px",
            margin: "20px 0",
            display: "block",
          }}
        />
      )}

      <p>{destination.description}</p>
    </div>
  );
}


function Home() {
  const [packages, setPackages] = useState([]);
  const [Destinations, setDestinations] = useState([]);
  const [showAll] = useState(false);
  const Navigate = useNavigate();
  
   
  useEffect(() => {
  // Fetch packages
  fetch('http://localhost:5000/api/packages')
    .then(res => res.json())
    .then(data => setPackages(data))
    .catch(err => console.error('Error fetching packages:', err));

  // Fetch destinations
  fetch('http://localhost:4000/api/destinations')
    .then(res => res.json())
    .then(data => setDestinations(data))
    .catch(err => console.error('Error fetching destinations:', err));
  

},
 []);
 
  const visiblePackages = showAll ? packages : packages.slice(0, 3);
  
  return (
    <>
    <Hero />
    <DestinationDetail />
      {/* About Section */}
      <section className="cs_about cs_style_1">
        <div className="cs_height_140 cs_height_lg_80"></div>
        <div className="container">
          <div className="row align-items-center cs_gap_y_40">
            <div className="col-lg-5">
              <img src="assets/images/about_img.png" alt="About" />
            </div>
            <div className="col-lg-6 offset-lg-1">
              <div className="cs_section_heading cs_style_1">
                <h3 className="cs_section_title_up cs_ternary_font cs_accent_color cs_normal cs_fs_24">
                  About Us
                </h3>
                <h2
                  className="cs_section_title cs_semibold cs_fs_56 mb-0 wow fadeInRight"
                  data-wow-duration="0.8s"
                  data-wow-delay="0.2s"
                >
                  We are Professional Planners For your
                </h2>
              </div>
              <div className="cs_about_text">
                <p>
                  We are passionate about creating unforgettable travel experiences.
                  <br/>
                  Our team carefully plans each detail to ensure your journey is smooth,
                  <br/>
                  enjoyable, and full of memories. With years of expertise, 
                  <br/>
                  we bring you the best destinations, trusted services, 
                  <br/>
                  and a commitment to making every trip special.
                </p>
                <p className="mb-0 cs_accent_color cs_medium cs_fs_18">
                  Speak to our Destination Experts at Direct Call +1 546 378 654
                </p>
              </div>
              <ul className="cs_list cs_style_1 cs_mp0 cs_fs_18">
                <li>
                  <i className="fa-solid fa-circle-check cs_accent_color"></i>
                  All places and activities are carefully picked by us.
                </li>
                <li>
                  <i className="fa-solid fa-circle-check cs_accent_color"></i>
                  98% Course Completion Rates
                </li>
                <li>
                  <i className="fa-solid fa-circle-check cs_accent_color"></i>
                  We are an award-winning agency
                </li>
                <li>
                  <i className="fa-solid fa-circle-check cs_accent_color"></i>
                  Trusted by more than 80,000 customers
                </li>
              </ul>
              <a href={`/About`} className="cs_btn cs_style_1 cs_fs_18 cs_medium">
                Read More
                <svg
                  width="20"
                  height="10"
                  viewBox="0 0 20 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19.5866 5.69629H0.41235C0.184269 5.69629 0 5.46776 0 5.1849C0 4.90204 0.184269 4.67352 0.41235 4.67352H18.5906L16.0881 1.57004C15.927 1.37028 15.927 1.04587 16.0881 0.846109C16.2492 0.646349 16.5108 0.646349 16.6718 0.846109L19.8792 4.82374C19.9977 4.97076 20.0325 5.1897 19.9681 5.38147C19.9036 5.57164 19.7529 5.69629 19.5866 5.69629Z"
                    fill="currentColor"
                  />
                  <path
                    d="M16.3435 9.11986C16.2384 9.11986 16.1333 9.08012 16.0538 8.99935C15.8935 8.83909 15.8935 8.57884 16.0538 8.41858L19.2487 5.22371C19.4089 5.06345 19.6692 5.06345 19.8294 5.22371C19.9897 5.38396 19.9897 5.64422 19.8294 5.80448L16.6346 8.99935C16.5538 9.08012 16.4487 9.11986 16.3435 9.11986Z"
                    fill="currentColor"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="cs_height_140 cs_height_lg_80"></div>
      </section>

       <section className="cs_featured cs_style_1 cs_bg_filed"
       style={{ backgroundImage: "url(assets/images/feature_bg.jpeg)" }}
>
  <div className="cs_height_140 cs_height_lg_80"></div>
  <div className="container">
    <div
      className="row cs_gap_y_40 wow fadeIn"
      data-wow-duration="0.8s"
      data-wow-delay="0.2s"
    >
      <div className="col-lg-3 col-sm-6">
        <div className="cs_iconbox cs_style_1">
          <div className="cs_iconbox_icon cs_radius_15 cs_center">
            <img
              src="assets/images/icons/feature_icon_1.svg"
              alt="Featured Icon"
            />
          </div>
          
          <h2 className="cs_iconbox_title cs_fs_24 cs_semibold">
            Customer Delight
          </h2>
          <p className="cs_iconbox_subtitle mb-0">
            We deliver the best service and you to <br />
            experience for our customer we est <br />
            service and you to experie
          </p>
        </div>
      </div>

      <div className="col-lg-3 col-sm-6">
        <div className="cs_iconbox cs_style_1">
          <div className="cs_iconbox_icon cs_radius_15 cs_center">
            <img
              src="assets/images/icons/feature_icon_2.svg"
              alt="Featured Icon"
            />
          </div>
          <h2 className="cs_iconbox_title cs_fs_24 cs_semibold">
            Trusted Adventure
          </h2>
          <p className="cs_iconbox_subtitle mb-0">
            We deliver the best service and you to <br />
            experience for our customer we est <br />
            service and you to experie
          </p>
        </div>
      </div>

      <div className="col-lg-3 col-sm-6">
        <div className="cs_iconbox cs_style_1">
          <div className="cs_iconbox_icon cs_radius_15 cs_center">
            <img
              src="assets/images/icons/feature_icon_3.svg"
              alt="Featured Icon"
            />
          </div>
          <h2 className="cs_iconbox_title cs_fs_24 cs_semibold">
            Expert Guides
          </h2>
          <p className="cs_iconbox_subtitle mb-0">
            We deliver the best service and you to <br />
            experience for our customer we est <br />
            service and you to experie
          </p>
        </div>
      </div>

      <div className="col-lg-3 col-sm-6">
        <div className="cs_iconbox cs_style_1">
          <div className="cs_iconbox_icon cs_radius_15 cs_center">
            <img
              src="assets/images/icons/feature_icon_4.svg"
              alt="Featured Icon"
            />
          </div>
          <h2 className="cs_iconbox_title cs_fs_24 cs_semibold">
            Time Flexibility
          </h2>
          <p className="cs_iconbox_subtitle mb-0">
            We deliver the best service and you to <br />
            experience for our customer we provide best <br />
            service and experience
          </p>
        </div>
      </div>
    </div>
  </div>
  <div className="cs_height_133 cs_height_lg_80"></div>
</section>
<section>
  <div className="cs_height_135 cs_height_lg_75"></div>
    <div className="container">
      <div className="cs_section_heading cs_style_1 text-center">
        <h3 className="cs_section_title_up cs_ternary_font cs_accent_color cs_normal cs_fs_24">
          CHOOSE YOUR PACKAGE
        </h3>
        <h2
          className="cs_section_title cs_semibold cs_fs_56 mb-0 wow fadeInUp"
          data-wow-duration="0.8s"
          data-wow-delay="0.2s"
        >
          Popular Tours Packages
        </h2>
      </div>
      </div>

      <div className="container-fluid">
        <div className="packages-grid">
          {visiblePackages.map((pkg) => (
            <div
              className="package-card"
              key={pkg.id}
              style={{
                backgroundImage: `url(${pkg.image || "https://via.placeholder.com/400x300"})`,
              }}
            >
              <div className="package-overlay">
                <div className="package-meta">
                  
                  <div>
                    <i className="fa-regular fa-clock"></i> {pkg.nd || "N/A"} Days
                  </div>
                  <div>
                    <i className="fa-solid fa-star"></i> {pkg.rating || "N/A"} Rating
                  </div>
                </div>
                <h3 className="package-title">{pkg.name}</h3>
                <div className="package-action">
                  <a href={`/packages/${pkg.id}`} className="book-btn">
                    Book Now →
                  </a>
                  <span className="package-price">${pkg.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Read More Button */}
        {packages.length > 3 && (
          <div className="text-center mt-4">
            <button
              className="read-more-btn"
              onClick={() => Navigate("/UserPackages")}
            >
              {showAll ? "Show Less ↑" : "Read More →"}
            </button>
          </div>
        )}
      </div>
    </section>
     
      {/* Travel Point Section */}
      <section>
        <div className="cs_height_135 cs_height_lg_80"></div>
        <div className="container">
          <div className="row cs_gap_y_40">
            <div className="col-lg-6">
              <div className="cs_image_box cs_style_1">
                <img src="assets/images/funfact_img.png" alt="FunFact" />
                <div className="cs_image_box_shape" data-src="assets/images/funfact_shape.png"></div>
              </div>
            </div>
            <div className="col-lg-5 offset-lg-1">
              <div className="cs_section_heading cs_style_1">
                <h3 className="cs_section_title_up cs_ternary_font cs_accent_color cs_normal cs_fs_24">Travel Point</h3>
                <h2 className="cs_section_title cs_semibold cs_fs_56 mb-0">Discover The World With Our Guide</h2>
                <p className="cs_section_subtitle">Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC.</p>
              </div>
              <div className="cs_height_55 cs_height_lg_40"></div>
              <div className="row cs_gap_y_24 position-relative">
                
                <div className="col-sm-6">
                  <div className="cs_funfact cs_style_1 text-center">
                    <h3 className="cs_funfact_title cs_fs_40 cs_semibold cs_accent_color"><span className="odometer" data-count-to="502"></span>+</h3>
                    <p className="cs_funfact_subtitle mb-0 cs_fs_18">Holiday Package</p>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="cs_funfact cs_style_1 text-center">
                    <h3 className="cs_funfact_title cs_fs_40 cs_semibold cs_accent_color"><span className="odometer" data-count-to="100"></span>+</h3>
                    <p className="cs_funfact_subtitle mb-0 cs_fs_18">Luxury Hotel</p>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="cs_funfact cs_style_1 text-center">
                    <h3 className="cs_funfact_title cs_fs_40 cs_semibold cs_accent_color"><span className="odometer" data-count-to="77"></span>k</h3>
                    <p className="cs_funfact_subtitle mb-0 cs_fs_18">Premium Airlines</p>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="cs_funfact cs_style_1 text-center">
                    <h3 className="cs_funfact_title cs_fs_40 cs_semibold cs_accent_color"><span className="odometer" data-count-to="2"></span>k+</h3>
                    <p className="cs_funfact_subtitle mb-0 cs_fs_18">Happy Customer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
  <div className="cs_height_135 cs_height_lg_80"></div>
  <div className="container">
    {/* Section Heading */}
    <div className="cs_section_heading cs_style_1 text-center">
      <h3 className="cs_section_title_up cs_ternary_font cs_accent_color cs_normal cs_fs_24">
        POPULAR DESTINATION
      </h3>
      <h2
        className="cs_section_title cs_semibold cs_fs_56 mb-0 wow fadeInUp"
        data-wow-duration="0.8s"
        data-wow-delay="0.2s"
      >
        Popular Destinations
      </h2>
    </div>

    <div className="cs_height_55 cs_height_lg_40"></div>

    {/* Grid */}
    <div className="cs_grid_1">
      {Destinations.length > 0 ? (
        Destinations.slice(0, showAll ? Destinations.length : 3).map((dest) => (
          <div className="cs_grid_item" key={dest.id}>
            <a
              href={`/UserDestination/${dest.id}`}
              className="cs_card cs_style_2 cs_zoom position-relative cs_radius_8"
            >
              <div className="cs_card_thumb w-100 h-100">
                <img
                  src={dest.image || "assets/images/popular_destination_1.jpeg"}
                  alt={dest.name}
                  className="w-100 h-100 cs_zoom_in"
                />
              </div>
              <div className="cs_card_content position-absolute">
                <h2 className="cs_card_title cs_fs_35 cs_medium cs_white_color">
                  {dest.name}
                </h2>
                <div className="package-action">
                  <a href={`/UserDestination/${dest.id}`} className="dook-btn">
                    Explore Now →
                  </a>
                </div>
              </div>

            </a>
          </div>
        ))
      ) : (
        <p style={{ textAlign: "center", padding: "20px", width: "100%" }}>
          No destinations found.
        </p>
      )}
    </div>

    {/* Read More Button */}
    {Destinations.length > 3 && (
      <div className="read-more-container">
        <button
          className="read-more-btn"
          onClick={() => Navigate("/UserDestinations")}
        >
          {showAll ? "Show Less" : "Read More"}
        </button>
      </div>
    )}
  </div>
  <div className="cs_height_140 cs_height_lg_80"></div>
</section>

<section className="how-it-works">
  <h2 className="section-subtitle">HOW IT WORKS</h2>
  <h1 className="section-title">Plan Your Perfect Trip</h1>

  <div className="steps-container">
    <div className="step-card">
      <div className="step-circle">
        <img src="https://channeltimes.com/wp-content/uploads/2004/11/GettyImages-950986656-4.jpg" alt="Step 1" />
      </div>
      <h3>Tell Us Your Plan</h3>
      <p>
        Share your travel preferences and budget, and we’ll start crafting your itinerary.
      </p>
    </div>
      <img src="https://images.rawpixel.com/image_social_landscape/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDI0LTA5L3JtMjEyNy1kb29kbGUtYS0wNTktdl8xLmpwZw.jpg" alt="Arrow" className="arrow-img" />

    <div className="step-card">
      <div className="step-circle">
        <img src="https://img.freepik.com/premium-photo/collage-travel-destinations-experiences-around-world_9975-109420.jpg" alt="Step 2" />
      </div>
      <h3>We Curate Your Itinerary</h3>
      <p>
        Our team personalizes your trip plan with the best routes, stays, and experiences.
      </p>
    </div>
      <img src="https://images.rawpixel.com/image_social_landscape/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDI0LTA5L3JtMjEyNy1kb29kbGUtYS0wNTktdl8xLmpwZw.jpg" alt="Arrow" className="arrow-img" />


    <div className="step-card">
      <div className="step-circle">
        <img src="https://d34mfkth6cubud.cloudfront.net/wp-content/uploads/2024/10/28085355/moving-india-dubai-body-image-5-768x480.jpg" alt="Step 3" />
      </div>
      <h3>Enjoy Your Trip</h3>
      <p>
        Relax and have fun while we ensure your travel goes smoothly and stress-free!
      </p>
    </div>
  </div>

</section>



  <section>
  <div className="container">
    <div
      className="cs_video_block cs_style_1 cs_bg_filed position-relative"
      style={{ backgroundImage: "url('https://www.thewowstyle.com/wp-content/uploads/2014/12/lets-travel-to-the-alps-switzerland-jungfrau-railway-with-jakub-polomski-3.jpg')" }}
    >
      <a
        href="https://www.youtube.com/results?search_query=travel"
        className="cs_player_btn cs_center cs_accent_bg cs_video_open"
      >
        <svg
          width="40"
          height="47"
          viewBox="0 0 40 47"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M36.9921 17.8114L9.63992 0.951019C7.66105 -0.267256 5.26855 -0.317908 3.23984 0.815524C1.21113 1.94878 0 4.01294 0 6.3367V39.9039C0 43.4175 2.83109 46.2914 6.31071 46.3104C6.32021 46.3104 6.32971 46.3105 6.33902 46.3105C7.42642 46.3104 8.55958 45.9696 9.61794 45.3238C10.4693 44.8043 10.7384 43.693 10.219 42.8417C9.69952 41.9902 8.58807 41.7212 7.73693 42.2407C7.2419 42.5426 6.75844 42.6988 6.33016 42.6987C5.01727 42.6916 3.61159 41.5669 3.61159 39.904V6.33679C3.61159 5.33994 4.13113 4.4547 5.00127 3.96853C5.87149 3.48236 6.89764 3.50407 7.74543 4.02606L35.0977 20.8864C35.9198 21.3926 36.3902 22.2366 36.3882 23.2021C36.3862 24.1674 35.9124 25.0095 35.0857 25.514L15.31 37.6224C14.4594 38.1432 14.192 39.2549 14.7128 40.1054C15.2335 40.956 16.3453 41.2234 17.1959 40.7026L36.9693 28.5956C38.8625 27.4407 39.9955 25.4272 40 23.2093C40.0045 20.9916 38.8797 18.9735 36.9921 17.8114Z"
            fill="currentColor"
          />
        </svg>
      </a>
      <h2 className="cs_video_title cs_fs_60 cs_semibold cs_white_color position-absolute mb-0">
        Our Journey <br /> in Videos
      </h2>
      <span className="cs_location cs_fs_20 cs_white_color">
        <i className="fa-solid fa-location-dot"></i> Location Mountain Strait, Any State
      </span>
    </div>
  </div>

  {/* Brands Section */}
  <div>
    <div className="cs_height_76 cs_height_lg_40"></div>
    <div className="container">
      <div className="cs_brand_list cs_style_1">
        <div className="cs_brand"><img src="assets/images/brand_1.svg" alt="Brand" /></div>
        <div className="cs_brand"><img src="assets/images/brand_2.svg" alt="Brand" /></div>
        <div className="cs_brand"><img src="assets/images/brand_3.svg" alt="Brand" /></div>
        <div className="cs_brand"><img src="assets/images/brand_4.svg" alt="Brand" /></div>
        <div className="cs_brand"><img src="assets/images/brand_5.svg" alt="Brand" /></div>
      </div>
    </div>
    <div className="cs_height_135 cs_height_lg_80"></div>
  </div>

<section className="cs_blog_section py-5">
  <div className="container">
    {/* Section Heading */}
    <div className="cs_section_heading cs_style_1 text-center">
      <h3 className="cs_section_title_up cs_ternary_font cs_accent_color cs_normal cs_fs_24">
        News & Blogs
      </h3>
      <h2
        className="cs_section_title cs_semibold cs_fs_56 mb-0 wow fadeInUp"
        data-wow-duration="0.8s"
        data-wow-delay="0.2s"
      >
        Last Minute Amazing Deals
      </h2>
    </div>

    <div className="row g-4">
      {/* Blog Post 1 */}
      <div className="col-lg-6 col-md-6">
        <article className="cs_post">
          <div className="cs_post_thumb">
            <img
              src="assets/images/blog_1.jpeg"
              alt="Useful VS Code Extensions"
            />
            <div className="cs_date_box">
              <span>27</span>
              <small>March 2025</small>
            </div>
          </div>
          <div className="cs_post_content">
            <div className="cs_post_author">
              <img src="assets/images/avatar_1.png" alt="Author Admin" />
              <span>By. Admin</span>
            </div>
            <h3 className="cs_post_title">
              Useful VS Code Extensions for Front-End Development
            </h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt.
            </p>
            <div className="cs_post_footer">
              <span className="cs_comment">💬 Comment (5)</span>
              <a href="http://" className="cs_more">
                More ➝
              </a>
            </div>
          </div>
        </article>
      </div>

      {/* Blog Post 2 */}
      <div className="col-lg-6 col-md-6">
        <article className="cs_post">
          <div className="cs_post_thumb">
            <img
              src="assets/images/blog_2.jpeg"
              alt="Designing Better Linked Websites"
            />
            <div className="cs_date_box">
              <span>16</span>
              <small>June 2025</small>
            </div>
          </div>
          <div className="cs_post_content">
            <div className="cs_post_author">
              <img src="assets/images/avatar_2.png" alt="Author Admin" />
              <span>By. Admin</span>
            </div>
            <h3 className="cs_post_title">
              Designing Better Linked Websites and Email
            </h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt.
            </p>
            <div className="cs_post_footer">
              <span className="cs_comment">💬 Comment (8)</span>
              <a href="http://" className="cs_more">
                More ➝
              </a>
            </div>
          </div>
        </article>
      </div>
    </div>
  </div>
</section>




</section>
<footer className="cs_footer cs_style_1 cs_white_color cs_bg_filed cs_primary_bg" style={{ backgroundImage: "url('https://www.thewowstyle.com/wp-content/uploads/2021/09/Amazing-Camping-Experience.jpg')" }}>
<div className="cs_newsletter_1_wrap">
  <div className="container-fluid">
    <div className="cs_newsletter cs_style_1 cs_accent_bg">
      <div className="cs_newsletter_icon">
        <img src="assets/images/icons/envlop.png" alt="Icon" />
        </div>
        <h2 className="cs_newsletter_title cs_fs_40 cs_bold mb-0 cs_white_color">
          Subscribe Our Newsletter
        </h2>
        <form className="cs_newsletter_form">
          <input
            type="text"
            className="cs_newsletter_form_field"
            placeholder="Enter your email address ..."
          />
          <button type="submit" className="cs_btn cs_style_1 cs_fs_18 cs_medium">
            Subscribe
            <svg width="20" height="10" viewBox="0 0 20 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.5866 5.69629H0.41235C0.184269 5.69629 0 5.46776 0 5.1849C0 4.90204 0.184269 4.67352 0.41235 4.67352H18.5906L16.0881 1.57004C15.927 1.37028 15.927 1.04587 16.0881 0.846109C16.2492 0.646349 16.5108 0.646349 16.6718 0.846109L19.8792 4.82374C19.9977 4.97076 20.0325 5.1897 19.9681 5.38147C19.9036 5.57164 19.7529 5.69629 19.5866 5.69629Z" fill="currentColor"></path>
              <path d="M16.3435 9.11986C16.2384 9.11986 16.1333 9.08012 16.0538 8.99935C15.8935 8.83909 15.8935 8.57884 16.0538 8.41858L19.2487 5.22371C19.4089 5.06345 19.6692 5.06345 19.8294 5.22371C19.9897 5.38396 19.9897 5.64422 19.8294 5.80448L16.6346 8.99935C16.5538 9.08012 16.4487 9.11986 16.3435 9.11986Z" fill="currentColor"></path>
            </svg>
          </button>
        </form>
      </div>
    </div>
  </div>

  <div className="container">
    <div className="cs_footer_main">
      <div className="cs_footer_main_col">
        <div className="cs_footer_widget">
          <div className="cs_text_widget">
            <img src="assets/images/footer_logo.svg" alt="Logo" />
          </div>
          <ul className="cs_contact_widget mb-0">
            <li>
              <p>Call Us</p>
              <p className="cs_fs_20">+423 5362 42365</p>
            </li>
            <li>
              <p>Mail Us</p>
              <p className="cs_fs_20">hello@travelpro.com</p>
            </li>
            <li>
              <p>Follow Us</p>
              <div className="cs_social_btn cs_style_1 d-flex">
                <a href="https://www.linkedin.com/" target="_blank"rel="noreferrer" className="cs_center"><i className="fa-brands fa-linkedin-in"></i></a>
                <a href="https://twitter.com/" target="_blank" rel="noreferrer"className="cs_center"><i className="fa-brands fa-x-twitter"></i></a>
                <a href="https://www.youtube.com/" target="_blank"rel="noreferrer" className="cs_center"><i className="fa-brands fa-youtube"></i></a>
                <a href="https://slack.com/" target="_blank" rel="noreferrer" className="cs_center"><i className="fa-brands fa-slack"></i></a>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="cs_footer_main_col">
        <div className="cs_footer_widget">
          <h3 className="cs_footer_widget_title cs_fs_24 cs_semibold cs_white_color">Useful Links</h3>
          <ul className="cs_menu_widget">
            <li><a href="index.html">Home</a></li>
            <li><a href="about.html">Activities</a></li>
            <li><a href="http://">Flights</a></li>
            <li><a href="http://">Organized Trips</a></li>
            <li><a href="http://">Hotels</a></li>
            <li><a href="http://">Booking</a></li>
            <li><a href="http://">Transfers</a></li>
            <li><a href="http://">Requests</a></li>
          </ul>
        </div>
      </div>

      <div className="cs_footer_main_col">
        <div className="cs_footer_widget">
          <h3 className="cs_footer_widget_title cs_fs_24 cs_semibold cs_white_color">Contact Info</h3>
          <ul className="cs_menu_widget">
            <li><a href="http://">Emirates, United Arabian</a></li>
            <li><a href="http://">New York City, USA</a></li>
            <li><a href="http://">One Bridge, Belgium</a></li>
            <li><a href="http://">Golden Frame, Dubai</a></li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <div className="container">
    <div className="cs_footer_bottom">
      <div className="cs_copyright">
        Copyright © {new Date().getFullYear()} travelpro All rights reserved.
      </div>
    </div>
  </div>
</footer>

      
    </>
  );
}

export default Home;
