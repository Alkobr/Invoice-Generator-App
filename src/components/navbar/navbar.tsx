import React from "react";
import "./navbar.css";
import AppIcon from "../../assets/PayInvo.png";
import { useLocation } from "react-router-dom";

const Navbar: React.FC = () => {
  const location = useLocation();
  const pathParts = location.pathname.split("/"); // Split path into parts
  const id = pathParts[pathParts.length - 1]; // Get the last part (ID)

  const getTitle = () => {
    if (location.pathname.startsWith("/CreateInvoice")) {
      return "New Invoice";
    } else if (location.pathname.startsWith("/CardList")) {
      return "All Invoices";
    } else if (location.pathname.startsWith("/editInvoice/")) {
      return `Invoice ${id}`;
    }
    return "";
  };

  console.log("Extracted ID:", id);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h3 className="TextStyle">{getTitle()}</h3>
      </div>
      
    </nav>
  );
};

export default Navbar;
