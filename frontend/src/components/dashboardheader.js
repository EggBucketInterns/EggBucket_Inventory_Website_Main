import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function DashHeader() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.post("/logout");
      window.alert(response.data.message || "Logout successful");
      navigate("/");
    } catch (error) {
      console.error(error.response.stack)
      console.error(error.response.error)
      window.alert("Sorry, unable to verify you. Please login again.");
    }
  };

  const handleRefresh = async () => {
    try {
      const response = await axios.post("/refreshSheet");
      window.alert(response.data.message || "Sheet refreshed successfully");
    } catch (error) {
      console.error(error.response ? error.response.data : error.message);
      window.alert("Sorry, unable to refresh the sheet.");
    }
  };

  return (
    <div id="headdash">
      <div style={{  borderRadius: "50%", backgroundColor: "white" }}>
        <img src={process.env.PUBLIC_URL + "/logo.png"} height={47} width={60} style={{ zIndex: "2000",position:"relative",marginLeft:"-1rem" }} alt="Logo" ></img>
      </div>
      <span>EGG-BUCKET</span>
      <div style={{ marginLeft: "auto", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center",padding:"0.7rem" }}>
        <button
          className="homedashbtn"
          style={{ cursor: "pointer" }}

        >
          <a href="https://docs.google.com/spreadsheets/d/1_FQT28T2pwdSu2tFXZE9oXOP7juDNDhK8ILtgz5alhc/edit?gid=0#gid=0" target="__blank" style={{ color: "inherit", fontSize: "inherit", textDecoration: "inherit" }}>Visit Sheet</a>
        </button>
        <button
          className="homedashbtn"
          style={{ cursor: "pointer" }}
          onClick={handleRefresh}
        >
          Refresh Sheet
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
