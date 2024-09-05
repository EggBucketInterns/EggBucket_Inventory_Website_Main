import React, { useEffect, useState } from "react";
import "../index.css";
import axios from "axios";
import { Form, useLocation } from "react-router-dom";

export default function App() {
  const [vendordata, setvendordata] = useState({});
  const [name, setname] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [show, setshow] = useState(false);
  const [show1, setshow1] = useState(false);
  const [suggestionList, setsuggestionList] = useState([]);
  const [myMap, setMyMap] = useState(new Map());
  // const location = useLocation();
  // const mobileNo = location.state?.mobileNo || "";

  const fetchData = async () => {
    try {
      const response = await axios.get("/fetchUsers");
      
      // Check if response.data contains the 'data' array
      const users = response.data.data || []; 
      
      const map = new Map();
      users.forEach((ele) => {
        const key = ele.name[0];
        const value = ele.name;
  
        if (!map.has(key)) {
          map.set(key, []);
        }
        map.get(key).push(value);
      });
      
      setMyMap(map);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // Define the async function

    fetchData();
  },[]);

  const handleNameChange = (e) => {
    const inputValue = e.target.value;
    setname(inputValue);
    
    if (inputValue && myMap.has(inputValue[0])) {
      setsuggestionList(myMap.get(inputValue[0]));
    } else {
      setsuggestionList([]);
    }
  };

  const handleDateChange = (e) => {
    // console.log(e.target.value);
    setSelectedDate(e.target.value);
  };

  const handleOnClick = async (event) => {

    event.preventDefault();
    const submitData = {
      name: name,
      date: selectedDate,
    }
    try {
      const response = await axios.get("/userCompleteInfo", {
        params: submitData,
      });
      // window.alert(response.data.message);
      setshow(true);
      setvendordata(response.data);
    } catch (error) {
      window.alert(error.response.data.message);

    }
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedImage(null);
  };

  const handleOnMouseEnter = () => {
    setshow1(true);
  }
  const handleOnMouseLeave = () => {
    setshow1(false);
  }

  const handleOnClickRecommendation=(e)=>{
    // console.log(e.target.value);
    setname(e.target.value);
  }


  // useEffect(() => {
  //   setname(mobileNo)
  // }, [])


  return (
    <div className="container">
      <h2 id="heading1">Please Enter Name</h2>
      <form style={{ display: "flex" }} onSubmit={handleOnClick} id="mainform">
        <div className="search" style={{ display: "flex", flexDirection: "column" }}>
          <input
            onMouseEnter={handleOnMouseEnter}
            onFocus={handleOnMouseEnter}
            type="text"
            className="textNavbar"
            placeholder="Search Here"
            onChange={handleNameChange}
            required
            pattern="^[A-Za-z_]+$"
            value={name}
            id="mainfield"

          />

        </div>
        <div className="search">
          <input
            type="date"
            onChange={handleDateChange}
            value={selectedDate}
            required
          />
        </div>
        <div className="search" >
          <button type="submit" form="mainform">Search</button>
        </div>

      </form>
      {show1 && (<div id="suggestion" style={{ display: "inline-block", borderRadius: "1rem", position: "absolute" }} onMouseLeave={handleOnMouseLeave}
        onMouseEnter={handleOnMouseEnter}>
        {suggestionList.map((value, index) => (
          <div
            key={index}
            className="search"
            style={{ display: "flex", flexDirection: "column", borderRadius: "0.5rem" }}
          >
            <input
              type="text"
              onClick={handleOnClickRecommendation}
              className="textNavbar"
              value={value}
              readOnly
              style={{cursor:"pointer"}}
            />
          </div>
        ))}


      </div>)}

      {show && (
        <div style={{ overflowX: "scroll" }}>
          <div className="request-details">
            <h2 id="heading2">Enquiry</h2>
            <table className="tablereqstatus">
              <tbody>
                <tr>
                  <th>Check In Time (Morning)</th>
                  <td>{vendordata.data.morning_check_in_time.slice(0, 8)}</td>
                </tr>
                <tr>
                  <th>Check Out Time (Morning)</th>
                  <td>{vendordata.data.morning_check_out_time.slice(0, 8)}</td>
                </tr>
                <tr>
                  <th>Check In Time (Evening)</th>
                  <td>{vendordata.data.evening_check_in_time.slice(0, 8)}</td>
                </tr>
                <tr>
                  <th>Check Out Time (Evening)</th>
                  <td>{vendordata.data.evening_check_out_time.slice(0, 8)}</td>
                </tr>
                <tr>
                  <th>Initial Stock (Morning)</th>
                  <td>{vendordata.data.morning_opening_stock}</td>
                </tr>
                <tr>
                  <th>Initial Stock (Evening)</th>
                  <td>{vendordata.data.evening_opening_stock}</td>
                </tr>
                <tr>
                  <th>Closing Stock (Morning)</th>
                  <td>{vendordata.data.morning_closing_stock}</td>
                </tr>
                <tr>
                  <th>Closing Stock (Evening)</th>
                  <td>{vendordata.data.evening_closing_stock}</td>
                </tr>
                <tr>
                  <th>Amount (Morning)</th>
                  <td>{`₹ ${vendordata.data.morning_money_collected}`}</td>
                </tr>
                <tr>
                  <th>Amount (Evening)</th>
                  <td>{`₹ ${vendordata.data.evening_money_collected}`}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {(vendordata.images && vendordata.images != []) && (
            <>
              <div className="image-gallery">
                <h2 id="heading3">Morning Image Enquiry</h2>
                <div className="card-container">
                  {vendordata.images.slice(2).map((img, index) => (
                    <div
                      className="card"
                      key={img}
                      onClick={() => handleImageClick(img)}
                    >
                      <img
                        src={img}
                        alt={`error loading`}
                        className="card-image"
                      />
                      <div className="card-content">
                        <h3 style={{ fontSize: "1.5rem" }}>Evening Image {index + 1}</h3>
                        <p style={{ fontSize: "1.2rem" }}>Click to view full image</p>
                      </div>
                    </div>
                  ))}

                </div>
              </div>

              <div className="image-gallery">
                <h2 id="heading3">Evening Image Enquiry</h2>
                <div className="card-container">
                  {vendordata.images.slice(0, 2).map((img, index) => (
                    <div
                      className="card"
                      key={index + 1}
                      onClick={() => handleImageClick(img)}
                    >
                      <img
                        src={img}
                        alt={`error loading`}
                        className="card-image"
                      />
                      <div className="card-content">
                        <h3 style={{ fontSize: "1.5rem" }}>Morning Image {index + 1}</h3>
                        <p style={{ fontSize: "1.2rem" }}>Click to view full image</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {isModalOpen && selectedImage && (
            <div className="modal" onClick={handleCloseModal}>
              <div className="modal-content">
                <span className="close" onClick={handleCloseModal}>&times;</span>
                <img
                  src={selectedImage}
                  alt="Full Sample"
                  className="modal-image"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
