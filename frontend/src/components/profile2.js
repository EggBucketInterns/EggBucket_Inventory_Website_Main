import React, { useState } from "react";
import { format, parseISO, startOfToday } from 'date-fns';
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(format(startOfToday(), 'yyyy-MM-dd'));
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [option, setOption] = useState("Set Date");
  const [outletData, setOutletData] = useState([]);
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(true);

  const handleClick = (val) => {
    navigate("/dashboard/info", { state: { mobileNo: val } });
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleStartDateChange = (e) => {
    setCustomStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setCustomEndDate(e.target.value);
  };

  const handleOptionChange = (e) => {
    const value = e.target.value;
    setOption(value);
    setShow1(value === 'Set Date' || value === 'Custom Date Interval');

    if (value === 'Today') {
      setSelectedDate(format(startOfToday(), 'yyyy-MM-dd'));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if start and end dates are selected for custom date interval
    if (option === "Custom Date Interval" && (!customStartDate || !customEndDate)) {
        window.alert("Please select both start and end dates.");
        return;
    }

    try {
        let response;

        switch (option) {
            case 'Set Date':
                response = await axios.get("/stockInfo", {
                    params: { date: format(parseISO(selectedDate), 'yyyy-MM-dd') }
                });
                break;

            case 'Today':
                response = await axios.get("/stockInfo", {
                    params: { date: format(startOfToday(), 'yyyy-MM-dd') }
                });
                break;

            case 'Monthly':
                response = await axios.get("/prevMonth");
                break;

            case 'Weekly':
                response = await axios.get("/prevSevenDays");
                break;

            case 'Custom Date Interval':
                console.log("Sending custom date interval:", customStartDate, customEndDate);
                response = await axios.get("/customDateInterval", {
                    params: { startDate: customStartDate, endDate: customEndDate }
                });
                break;

            default:
                return;
        }

        if (response.data && response.data.data) {
            setOutletData(response.data.data);
            setShow(true);
        } else {
            setShow(false); // Handle no data scenario
            console.log("No data returned:", response.data);
        }
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'An error occurred';
        window.alert(errorMessage);
    }
};

const isSubmitDisabled = option === "Custom Date Interval" && (!customStartDate || !customEndDate);

  const formatDisplayDate = (dateString) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'dd-MM-yyyy');
    } catch (error) {
      return 'Invalid Date';
    }
  };

  return (
    <>
      <p id="headingprofile">Hello Admin</p>
      <hr className="mb-6" />

      <div id="mainsearch">
        <form onSubmit={handleSubmit} style={{ display: "flex" }}>
          <div className="search">
            <select
              name="datetype"
              value={option}
              style={{ width: "100%", height: "100%", fontSize: "1.5rem" }}
              onChange={handleOptionChange}
              required
            >
              <option value="Set Date" style={{ fontSize: "1.5rem" }}>Set Date</option>
              <option value="Today" style={{ fontSize: "1.5rem" }}>Today</option>
              <option value="Monthly" style={{ fontSize: "1.5rem" }}>Monthly</option>
              <option value="Weekly" style={{ fontSize: "1.5rem" }}>Weekly</option>
              <option value="Custom Date Interval" style={{ fontSize: "1.5rem" }}>Custom Date Interval</option>
            </select>
          </div>

          {show1 && option !== "Custom Date Interval" && (
            <div className="search">
              <input
                type="date"
                onChange={handleDateChange}
                value={selectedDate}
                required
              />
            </div>
          )}

{option === "Custom Date Interval" && (
                <>
                    <div className="search">
                        <input
                            type="date"
                            onChange={handleStartDateChange}
                            value={customStartDate}
                            placeholder="Start Date"
                            required
                        />
                    </div>
                    <div className="search">
                        <input
                            type="date"
                            onChange={handleEndDateChange}
                            value={customEndDate}
                            placeholder="End Date"
                            required
                        />
                    </div>
                </>
            )}
            <div className="search">
                <button type="submit" disabled={isSubmitDisabled}>
                    Search
                </button>
            </div>
        </form>
      </div>

      {show && (
        <div className="container">
          <div className="request-details">
            <h2 id="heading2">Enquiry</h2>

            {outletData.map((outletInf, dateIndex) => (
              <div key={dateIndex} className="mb-8">
                <h3 style={{
                  fontWeight: "bold",
                  color: "#B07501",
                  fontSize: "1.5rem",
                  marginBottom: "2rem",
                  marginTop: "2rem",
                  textDecoration: "2px solid underline"
                }}
                >
                  {formatDisplayDate(outletInf[0].date)}
                </h3>
                <table className="tablereqstatus w-full">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Initial Stock (Morning)</th>
                      <th>Closing Stock (Morning)</th>
                      <th>Initial Stock (Evening)</th>
                      <th>Closing Stock (Evening)</th>
                      <th>Purchased Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {outletInf.map((outletInfObj, rowIndex) => (
                      <tr key={`${outletInfObj.phoneNo}-${rowIndex}`}>
                        <td style={{ cursor: "pointer" }}>
                          {outletInfObj.data.name}
                        </td>
                        <td>{outletInfObj.data.morning_opening_stock}</td>
                        <td>{outletInfObj.data.morning_closing_stock}</td>
                        <td>{outletInfObj.data.evening_opening_stock}</td>
                        <td>{outletInfObj.data.evening_closing_stock}</td>
                        <td>{outletInfObj.data.purchased_stock}</td>
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
};

export default Profile;
