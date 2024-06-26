import React from "react";
import logo from "../../../public/by.png";
import "./Footer.css";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <img src={logo} width={200} height={90} alt="Logo" />
        </div>
        <div className="footer-section">
          <ul>
            <li><a href="https://www.donationalerts.com/r/inf_tech">• Donate</a></li>
            <li><a href="https://github.com/Faynot">• Github</a></li>
            <li><a href="/info">• Inform</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; v0.0.2.
      </div>
    </footer>
  );
};

export default Footer;
