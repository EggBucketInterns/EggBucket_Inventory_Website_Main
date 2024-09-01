
import React, { useState } from "react";
import axios from "axios";
import { Link, Navigate, useNavigate } from "react-router-dom";
import "../index.css";

export default function UserAddedDetails(/*{ renderdata }*/) {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState("");
  const [outletData, setOutletData] = useState([]);
  const [show, setshow] = useState(false)


  const handleClick = (val) => {
    navigate("/dashboard/info", { state: { mobileNo: val } });
  }

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const response = await axios.get("/timingInfo", {
        params: {
          date: selectedDate,
        }
      });
      console.log(response.data)
      // window.alert(response.data.message);
      setOutletData(response.data.data);
      setshow(true)
    } catch (error) {
      window.alert(error.response.data.message);
    }
  }

  return (
    <>
     
    </>
  );
}
