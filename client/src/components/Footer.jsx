import React from "react";
import "style.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-img-wrapper">
          <img
            src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUSExMVFRUVFRUYFRcYFRUXFxcVFRUXFhUYFxUYHSggGBolGxUVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGxAQGjAmICUwLS4rMi0tLS0tLi0tLS0tLS0tLS0tLS0tLS0tLS0tKy0tLi0tLS0tLS0tLS0tLS0tLf/AABEIAOEA4QMBIgACEQEDEQH/xAA..."
            alt="model"
            className="footer-img"
          />

          <div className="footer-social">
            <span>INSTAGRAM</span>
            <span>FACEBOOK</span>
          </div>
        </div>

        <div className="footer-columns">

          <div className="footer-column">
            <h4>Shop</h4>
            <p>Catalog</p>
            <p>Best Sellers</p>
            <p>New Collection</p>
            <p>Lookbook</p>
          </div>

          <div className="footer-column">
            <h4>Company</h4>
            <p>About us</p>
            <p>Contact us</p>
            <p>Join us</p>
          </div>

          <div className="footer-column">
            <h4>Help</h4>
            <p>Payment</p>
            <p>Shipping information</p>
            <p>Return policy</p>
            <p>Terms & Conditions</p>
          </div>
        </div>

        <h1 className="footer-logo">FADED&FOUND</h1>
      </div>
    </footer>
  );
}

export default Footer;
