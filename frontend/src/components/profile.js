import React, { useEffect, useState } from "react";
import axios from "axios";
import { format, parseISO } from 'date-fns';
import { Link, Navigate, useNavigate } from "react-router-dom";
import "../index.css";

export default function Profile(/*{ renderdata }*/) {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState("");
  const [option, setoption] = useState("");
  const [outletData, setOutletData] = useState([]);
  const [show, setshow] = useState(false)
  const [show1, setshow1] = useState(true)
  // const [show1, setshow1] = useState(true)


  // const handleClick = (val) => {
  //   navigate("/dashboard/info", { state: { mobileNo: val } });
  // }

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  }
  const handleOptionChange = (e) => {
    if (e.target.value !== 'Set Date') {
      setshow1(false);
    }
    else {
      setshow1(true);
    }
    setoption(e.target.value);
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    let response;

    try {
      if (e.target[0].value === "Set Date") {
        response = await axios.get("/timingInfo", {
          params: { date: selectedDate }
        });
      }
      else if (e.target[0].value === "Monthly") {
        response = await axios.get("/prevMonth");
      }
      else if (e.target[0].value === "Weekly") {
        response = await axios.get("/prevSevenDays");
      }
      else {
        const date = format(new Date(), 'yy-MM-dd');
        response = await axios.get("/timingInfo", {
          params: { date: `20${date}` }
        });
      }
      // window.alert(response.data.message);
      setOutletData(response.data.data);
      setshow(true)
    } catch (error) {
      window.alert(error.response.data.message);
    }
  }
  const formatDate = (dateString) => {
    const date = parseISO(dateString);
    return format(date, 'dd-MM-yyyy');
  };

  return (
    <>
      <p id="headingprofile">Hello Admin</p>
      <hr />

      <div id="mainsearch">

        <form onSubmit={handleSubmit} style={{ display: "flex" }}>
          <div className="search">
            <select name="datetype" value={option} style={{ width: "100%", height: "100%", fontSize: "1.5rem" }} onChange={handleOptionChange} required>
              <option value="Set Date" style={{ fontSize: "1.5rem" }}>Set Date</option>
              <option value="Today" style={{ fontSize: "1.5rem" }}>Today</option>
              <option value="Monthly" style={{ fontSize: "1.5rem" }}>Monthly</option>
              <option value="Weekly" style={{ fontSize: "1.5rem" }}>Weekly</option>
            </select>
          </div>
          {show1 && <div className="search">
            <input type="date" onChange={handleDateChange} value={selectedDate} required />
          </div>}


          <div className="search">
            <button type="submit">Search</button>
          </div>
        </form>
      </div>

      {show && (
        <div className="container">
          <div className="request-details">
            <h2 id="heading2">Enquiry</h2>

            {outletData.map((outletInf, dateIndex) => (
              <div key={dateIndex}>
                <h3 style={{
                  fontWeight: "bold",
                  color: "#B07501",
                  fontSize: "1.5rem",
                  marginBottom: "2rem",
                  marginTop: "2rem",
                  textDecoration: "2px solid underline"
                }}>{formatDate(outletInf[0].date)}</h3>
                <table className="tablereqstatus">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Check In Time (Morning)</th>
                      <th>Check Out Time (Morning)</th>
                      <th>Check In Time (Evening)</th>
                      <th>Check Out Time (Evening)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {outletInf.map((outletInfObj, rowIndex) => (
                      <tr key={outletInfObj.phoneNo + '-' + rowIndex}>
                        <td /*onClick={() => handleClick(outletInfObj.phoneNo)}*/ style={{ cursor: "pointer" }}>{outletInfObj.data.name}</td>
                        <td>{outletInfObj.data.morning_check_in_time.slice(0, 8)}</td>
                        <td>{outletInfObj.data.morning_check_out_time.slice(0, 8)}</td>
                        <td>{outletInfObj.data.evening_check_in_time.slice(0, 8)}</td>
                        <td>{outletInfObj.data.evening_check_out_time.slice(0, 8)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}