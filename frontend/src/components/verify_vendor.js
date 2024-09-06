import React, { useState } from "react";
import "../index.css";
import axios from "axios"

export default function Verify_Vendor() {
  const [vendordata, setvendordata] = useState([]);
  const [contactNo, setcontactNo] = useState("");
  const [isModalOpen, setModalOpen] = useState();
  const [selectedImage, setSelectedImage] = useState("");
  const [show, setshow] = useState(false);
  const [showcontent, setshowcontent] = useState(false);
  const [verificationstatus, setverificationstatus] = useState("");


  const handleMobileChange = (e) => {
    setcontactNo(e.target.value);
    console.log(e.target.value);
  }


  const handleOnClick = async () => {
    try {
      const response = await axios.get("/userDocuments", {
        params: {
          phoneNo: `+91${contactNo}`,
        }
      })
      window.alert(response.data.message);
      const verified = response.data.verification;
      if (verified) {
        setshow(false);

        setvendordata(response.data.images);
        setverificationstatus("Verified");
      }
      else {
        setvendordata(response.data.images);
        setverificationstatus("Unverified");
        setshow(true);
      }
      setshowcontent(true)
    }
    catch (error) {

      window.alert(error.response.data.message)
      console.error(error.response.data.message);
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
  const handleverification = async (e) => {

    try {
      const response = await axios.patch("/verifyUser", {
        phoneNo: `+91${contactNo}`,
      })
      window.alert(response.data.message);
    }
    catch (error) {
      window.alert(error.response.data.message)
    }
  }
  //sample images
  // const images = [
  //   {
  //     id: 1,
  //     preview: "https://via.placeholder.com/150",
  //     full: "https://via.placeholder.com/600",
  //     type: "aadhar",
  //   },
  //   {
  //     id: 2,
  //     preview: "https://via.placeholder.com/150/0000FF",
  //     full: "https://via.placeholder.com/600/0000FF",
  //     type: "pan",
  //   },
  //   {
  //     id: 3,
  //     preview: "https://via.placeholder.com/150/FF0000",
  //     full: "https://via.placeholder.com/600/FF0000",
  //     type: "driving licence",
  //   },
  // ];


  return (
    <div className="container">
      <h2 id="heading1">Please Enter Contact Number</h2>
      <div className="search">
        <i className="fa fa-search" />
        <p style={{ fontSize: "1.5rem", fontWeight: "700" }}>+91</p>
        <input type="tel" className="textNavbar" placeholder="Search Here" onChange={handleMobileChange} required pattern="^[56789][0-9]{9}$" />
        <button type="submit" onClick={handleOnClick}
        >
          Search
        </button>
      </div>
      {showcontent && (<><div className="request-details">
        <h2 id="heading2" style={{ color: verificationstatus === "Verified" ? "green" : "red" }}>
          {verificationstatus}
        </h2>
      </div>


        <div className="image-gallery">
          <h2 id="heading3">Image Enquiry</h2>
          <div className="card-container">
            {vendordata.map((image, index) => (
              <div
                className="card"
                key={image}
                onClick={() => handleImageClick(image)}
              >
                <img
                  src={image}
                  alt={`Error`}
                  className="card-image"
                />
                <div className="card-content">
                  <h3 style={{ fontSize: "1.5rem" }}> Verification Image {index + 1}</h3>

                </div>
              </div>
            ))}
          </div>
        </div>


        {isModalOpen && selectedImage && (
          <div className="modal" onClick={handleCloseModal}>
            <div className="modal-content">
              <span className="close">&times;</span>
              <img
                src={selectedImage}
                alt="Full Sample"
                className="modal-image"
              />
            </div>
          </div>
        )}

        {show && (<div className="verification-buttons">
          <h2 id="heading4">Verification</h2>
          <button id="btnverify" onClick={handleverification}>Verify</button>
          {/* <button id="btnreject" onClick={handleverification}>Reject</button> */}
        </div>)}</>)}


    </div>
  );
}
