import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../index.css";

export default function Login() {
  const Navigate = useNavigate();

  const handleloginsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      const response = await axios.post("/signin", {
        email: fd.get('email'),
        password: fd.get('password')
      });
      Navigate("/dashboard");

    } catch (error) {
      window.alert(error.response.data.message);
    }
  };

  return (
    <div
      id="logincontent"
      style={{
        background: "linear-gradient(to right, #FFDAB9, #FFE4B5)",
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          width: "50vw",
          backgroundColor: "white",
          display: "flex",
          gap: "1rem",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}

      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            justifyContent: "center",
            alignItems: "center",
            margin: "2rem",
          }}
        >
          <img
            src={process.env.PUBLIC_URL + "/logo.png"}
            alt="error"
            height={50}
            width={100}
          />
        </div>
        <h2
          style={{
            color: "#B07501",
            fontWeight: "600",
            fontSize: "2rem",
          }}
        >
          Hi, Welcome Back
        </h2>
        <h4 style={{ color: "rgb(111 112 114)", fontSize: "1.5rem" }}>
          Enter your credentials to continue
        </h4>
        <form id="my-form1" onSubmit={handleloginsubmit} style={{
          display: " flex",
          flexDirection: "column",
          alignItems: "center"
        }}>
          <div
            style={{
              backgroundColor: "rgb(238,242,246)",
              border: "2px solid black",
              width: "20vw",
              display: "flex",
              flexDirection: "column",
              padding: "1rem",
              borderRadius: "0.5rem",
            }}
          >
            <label htmlFor="email" style={{ color: "black", fontWeight: 700, fontSize: "1rem" }}>
              Email Id
            </label>

            <input
              type="email"
              id="email"
              className="username"
              name="email"
              style={{
                border: "none",
                backgroundColor: "rgb(238,242,246)",
                fontSize: "1.5rem",
                width: "100%",
                fontWeight: "500",
              }}
              required

            />
          </div>

          <div
            style={{
              marginTop: "1rem",
              backgroundColor: "rgb(238,242,246)",
              border: "2px solid black",
              width: "20vw",
              display: "flex",
              flexDirection: "column",
              padding: "1rem",
              borderRadius: "0.5rem",
            }}
          >
            <label
              htmlFor="Password"
              style={{ color: "black", fontWeight: 700, fontSize: "1rem" }}
            >
              Password
            </label>

            <input
              type="password"
              id="Password"
              name="password"
              style={{
                border: "none",
                backgroundColor: "rgb(238,242,246)",
                fontSize: "1.5rem",
                width: "100%",
                fontWeight: "500",
              }}
              required
            />
          </div>

          <button
            type="submit"
            style={{
              backgroundColor: "#B07501",
              color: "white",
              width: "80%",
              padding: "0.5rem",
              marginTop: "2rem",
              fontSize: "1rem",
              cursor: "pointer",
              marginBottom: "2rem"
            }}
          >
            SignIn
          </button>


        </form>
      </div>
    </div >
  );
}