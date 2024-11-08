import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function DashHeader() {
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await axios.post("/logout");
      window.alert(response.data.message || "Logout successful");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      window.alert(error.response?.data?.message || "Sorry, unable to verify you. Please login again.");
    }
  };

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    
    try {
      console.log("Starting sheet refresh...");
      const response = await axios.post("/refreshSheet");
      console.log("Refresh response:", response.data);
      window.alert("Sheet refreshed successfully!");
    } catch (error) {
      console.error("Full error object:", error);
      console.error("Response data:", error.response?.data);
      
      let errorMessage = "Unable to refresh the sheet. ";
      
      if (error.response?.data?.error) {
        errorMessage += `Error: ${error.response.data.error}`;
        if (error.response.data.solution) {
          errorMessage += `\n\nSuggested solution: ${error.response.data.solution}`;
        }
      } else if (error.message) {
        errorMessage += `\nDetails: ${error.message}`;
      }
      
      window.alert(errorMessage);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div id="headdash">
      <div style={{ margin: "3px", backgroundColor: "white" }}>
        <img
          src={process.env.PUBLIC_URL + "/logo.png"}
          height={47}
          width={60}
          style={{ zIndex: "2000", position: "relative", marginLeft: "-1rem" }}
          alt="Logo"
        />
      </div>
      <span>EGG-BUCKET</span>
      <div
        style={{
          marginLeft: "auto",
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "0.7rem",
        }}
      >
        <button className="homedashbtn">
          <a
            href="https://docs.google.com/spreadsheets/d/1eCyfbCmFoerH7VZK6QIf9W-vGtaS5QwMl5DTUlrQryY/edit?gid=0"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "inherit",
              fontSize: "inherit",
              textDecoration: "inherit",
            }}
          >
            Visit Sheet
          </a>
        </button>
        <button
          className="homedashbtn"
          style={{ 
            cursor: isRefreshing ? "not-allowed" : "pointer",
            opacity: isRefreshing ? 0.7 : 1 
          }}
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          {isRefreshing ? "Refreshing..." : "Refresh Sheet"}
        </button>
        <button
          className="homedashbtn"
          style={{ cursor: "pointer" }}
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}