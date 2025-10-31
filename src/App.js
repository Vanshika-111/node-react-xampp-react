import {  Routes, Route,Link,  useLocation} from "react-router-dom";
import { useEffect,useRef } from "react";

import Home from "./pages/Home";
import Packages from "./pages/Packages";
import Destinations from "./pages/Destinations";
import Itineraries from "./pages/itineraries";
import './App.css';
import PackageDetails from "./pages/PackageDetails";
import AddDestination from "./pages/AddDestination";
import UpdateDestination from "./pages/UpdateDestination";
import AddPackages from "./pages/addpackages";
import UpdatePackages from "./pages/UpdatePackages";
import Chatbot from "./pages/Chatbot";
import ChatPage from "./pages/ChatPage";
import About from "./pages/About";
import Flights from "./pages/Flights";
import UserPackages from "./pages/UserPackages";
import Blog from "./pages/blog";
import UserDestination from "./pages/UserDestination";
import Contact from "./pages/contact";
import BookNow from "./pages/booknow";
import TravellerDetails from "./pages/TravellerDetails";
// Header like TravelPro
const Header = () => {
  const headerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!headerRef.current) return;
      if (window.scrollY > 50) {
        headerRef.current.classList.add("scrolled");
      } else {
        headerRef.current.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      ref={headerRef}
      className="cs_site_header cs_style_1 cs_fs_18 cs_sticky_header"
  
      
    >
      <div className="cs_main_header">
        <div className="cs_main_header_in">
          {/* Left - Logo */}
          <div className="cs_main_header_left">
            <Link className="cs_site_branding" to="/">
              <img src="assets/images/logo_7.png" alt="Logo" />
            </Link>
          </div>

          {/* Center - Navigation */}
          <div className="cs_main_header_center">
            <nav className="cs_nav cs_medium cs_primary_font">
              <ul className="cs_nav_list">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/About">About Us</Link></li>
                <li><Link to="/UserDestination/1">Destinations</Link></li>
                <li><Link to="/UserPackages">Packages</Link></li>
                <li><Link to="/blog">Blogs</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                
              </ul>
            </nav>
          </div>

          {/* Right - Search + Phone */}
          <div className="cs_main_header_right">
            <div className="cs_header_toolbox">
              <button className="cs_search_btn cs_fs_24" type="button">
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
              <div className="cs_fs_20 cs_medium">+8 (123) 985 789</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}



function App() {
  const location = useLocation();
  const isChatbot = location.pathname === "/chat"; 

  return (
    <div>
      {/* Header + Hero sirf tab dikhna chahiye jab chatbot page na ho */}
      {!isChatbot && <Header />}

      <main className="container" style={{ padding: "40px 0" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/packages/add" element={<AddPackages />} />
          <Route path="/packages/edit/:id" element={<UpdatePackages />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/itineraries/:id" element={<Itineraries />} />
          <Route path="/destinations/add" element={<AddDestination />} />
          <Route path="/destinations/edit/:id" element={<UpdateDestination />} />
          <Route path="/userpackages" element={<UserPackages />} />
          <Route path="/UserDestination/:id" element={<UserDestination />} />
          <Route path="/packages/:id" element={<PackageDetails />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/chat" element={<Chatbot />} />
          <Route path="/About" element={<About />} />
          <Route path="/blog" element={< Blog />} />
          <Route path="/flights" element={<Flights />} />
          <Route path="/contact" element={<Contact/>} />
          <Route path="/booknow/:id" element={<BookNow/>} />
          <Route path="/traveller-details/:id" element={<TravellerDetails />}
          />
        </Routes>
      </main>

      {/* Floating chatbot button har page pe ho, lekin agar tum /chat page pe full chatbot dikha rahe ho to button remove karna better hai */}
      {!isChatbot && <Chatbot />}
    </div>
  );
}


export default App;
