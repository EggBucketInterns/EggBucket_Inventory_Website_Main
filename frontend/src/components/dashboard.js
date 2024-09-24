import React, { useState, useEffect } from "react";
import axios from "axios"
import {
  Routes,
  Route,
  Link,
  useLocation, useNavigate
} from "react-router-dom";
import "../index.css";
import Header from "./dashboardheader.js";
import Profile from "./profile.js";
import Profile2 from "./profile2.js";
import OutletDetails from "./outletdetails.js";
import Verify_Vendor from "./verify_vendor.js";
import AddUser from "./manageuser.js";
// import ShowAddUser from "./getalluserdetails.js"

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [curButton, setCurButton] = useState("btn1");



  const checkToken = async () => {
    try {
      const response = await axios.get("/verifyToken");
      console.log(response.data.message);
    } catch (error) {
      console.error(error.response?.data?.message || "Error verifying token");
      window.alert("Sorry, unable to verify you. Please log in again.");
      navigate('/');
    }
    console.log("Cookies after verification:", document.cookie);
  };




// for dev only frontend comment only below useEffect
  // useEffect(() => {
  //   checkToken();
  // }, []);



  useEffect(() => {


    if (window.location.pathname === "/dashboard") {
      setCurButton("btn1");
    } else if (window.location.pathname === "/dashboard/profile2") {
      setCurButton("btn2");
    } else if (window.location.pathname === "/dashboard/info") {
      setCurButton("btn3");
    }
    // else if (window.location.pathname === "/dashboard/verify") {
    //   setCurButton("btn4");
    // }
    else if (window.location.pathname === "/dashboard/adduser") {
      setCurButton("btn5");
    }
    // else if (window.location.pathname === "/dashboard/adduserdetail") {
    //   setCurButton("btn6");
    // }



  }, [window.location.pathname]);

  return (
    <div>
      <div>
        <Header />
        <div id="maincontent">
          <div id="leftnavdash">
            <Link to="/dashboard">
              <button
                className={`divleftdash ${curButton === "btn1" ? "divleftdashclicked" : ""}`}
                id="btn1"
              >
                Admin Time Service
              </button>
            </Link>
            <Link to="/dashboard/profile2">
              <button
                className={`divleftdash ${curButton === "btn2" ? "divleftdashclicked" : ""}`}
                id="btn2"
              >
                Admin Stock Service
              </button>
            </Link>
            <Link to="/dashboard/info">
              <button
                className={`divleftdash ${curButton === "btn3" ? "divleftdashclicked" : ""}`}
                id="btn3"
              >
                Show Vendor Details
              </button>
            </Link>
            {/* <Link to="/dashboard/verify">
              <button
                className={`divleftdash ${curButton === "btn4" ? "divleftdashclicked" : ""}`}
                id="btn4"
              >
                Verify Vendor
              </button>
            </Link> */}
            <Link to="/dashboard/adduser">
              <button
                className={`divleftdash ${curButton === "btn5" ? "divleftdashclicked" : ""}`}
                id="btn5"
              >
                Manage User
              </button>
            </Link>
            {/* <Link to="/dashboard/adduserdetail">
              <button
                className={`divleftdash ${curButton === "btn6" ? "divleftdashclicked" : ""}`}
                id="btn6"
              >
                Get User Detail
              </button>
            </Link> */}

          </div>
          <div id="rightcontentdash">
            <Routes>
              <Route path="/" element={<Profile />} />
              <Route path="/profile2" element={<Profile2 />} />
              <Route path="/info" element={<OutletDetails />} />
              <Route path="/adduser" element={<AddUser />} />
              {/* <Route path="/verify" element={<Verify_Vendor />} /> */}
              {/* <Route path="/adduserdetail" element={<ShowAddUser />} /> */}
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}
