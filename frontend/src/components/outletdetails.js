import React, { useEffect, useState } from "react";
import "../index.css";
import axios from "axios";

export default function App() {
  const [vendordata, setvendordata] = useState({});
  const [name, setname] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [show, setshow] = useState(false);
  const [outletOptions, setOutletOptions] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get("/fetchUsers");
      const users = response.data.data || [];
      const outletNames = users.map((user) => user.name);
      setOutletOptions(outletNames);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleNameChange = (e) => {
    setname(e.target.value);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleOnClick = async (event) => {
    event.preventDefault();
    const submitData = {
      name: name,
      date: selectedDate,
    };
    try {
      const response = await axios.get("/userCompleteInfo", {
        params: submitData,
      });
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

  return (
    <div className="container">
      <h2 id="heading1">Please Select an Outlet</h2>
      <form style={{ display: "flex" }} onSubmit={handleOnClick} id="mainform">
        <div className="search">
          <select
            className="dropdown"
            value={name}
            onChange={handleNameChange}
            required
          >
            <option value="" disabled>
              Select Outlet
            </option>
            {outletOptions.map((outlet, index) => (
              <option key={index} value={outlet}>
                {outlet}
              </option>
            ))}
          </select>
        </div>
        <div className="search">
          <input
            type="date"
            onChange={handleDateChange}
            value={selectedDate}
            required
          />
        </div>
        <div className="search">
          <button type="submit" form="mainform">
            Search
          </button>
        </div>
      </form>

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
                {/* Other rows */}
              </tbody>
            </table>
          </div>

          {(vendordata.images && vendordata.images.length > 0) && (
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
                        alt="Morning Image"
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
                        alt="Evening Image"
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
                <span className="close" onClick={handleCloseModal}>
                  &times;
                </span>
                <img src={selectedImage} alt="Full Sample" className="modal-image" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
