import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AddUser() {
    const [contactNo1, setcontactNo1] = useState("");
    const [contactNo2, setcontactNo2] = useState("");
    const [name1, setname1] = useState("");
    // const [name2, setname2] = useState("");
    const [Data, setData] = useState([]);
    const [show, setshow] = useState(false)

    const handleMobileChange1 = (e) => {
        setcontactNo1(e.target.value);
        console.log(e.target.value);
    };

    const handleMobileChange2 = (e) => {
        setcontactNo2(e.target.value);
        console.log(e.target.value);
    };

    const handleNameChange1 = (e) => {
        setname1(e.target.value);
        console.log(e.target.value);
    };

    // const handleNameChange2 = (e) => {
    //     setname2(e.target.value);
    //     console.log(e.target.value);
    // };

    const handleOnClick1 = async (event) => {

        event.preventDefault();

        const submitData = {
            phoneNo: `+91${contactNo1}`,
            name: name1
        }

        try {
            const response = await axios.post("/createUser", submitData);
            // window.alert(response.data.message);
            setcontactNo1("");
            setname1("");
            if(show){
                handleOnClick3();
            }
        } catch (error) {
            window.alert(error.response.data.message);
            console.error(error);
        }
    };

    const handleOnClick2 = async (event) => {

        event.preventDefault();
        const submitData = {
            phoneNo: `+91${contactNo2}`,
            // name: name2,  can lead to deletion of data that is having same name as the data to be deleted
        }

        try {
            const response = await axios.delete("/deleteUser", { data: submitData });
            // window.alert(response.data.message);
            setcontactNo2("");
            if(show){
                handleOnClick3();
            }

        } catch (error) {
            window.alert(error.response.data.message);
            console.error(error);
        }
    };


    const handleOnClick3 = async () => {
        try {
            const response = await axios.get("/fetchUsers");
            // window.alert(response.data.message);
            setData(response.data.data);
            setshow(true)
        } catch (error) {
            window.alert(error.response.data.message);
            console.error(error);
        }
    };

   

    return (
        <>
            <p id="headingprofile"> Hello Admin </p>
            <hr />
            <div id="mainsearch" >
                <h2 id="heading1" style={{ marginTop: "2rem" }}>Add User</h2>
                <form onSubmit={handleOnClick1} id="mainform1" style={{ display: "flex" }}>

                    <div className="search">
                        <input
                            type="tel"
                            className="textNavbar"
                            placeholder="Enter Name"
                            onChange={handleNameChange1}
                            required
                            pattern="^[A-Za-z]+$"
                            value={name1}
                        />

                    </div>
                    <div className="search">
                        <i className="fa fa-search" />
                        <p style={{ fontSize: "1.5rem", fontWeight: "700" }}>+91</p>
                        <input
                            type="tel"
                            className="textNavbar"
                            placeholder="Enter Mobile Number"
                            onChange={handleMobileChange1}
                            required
                            pattern="^[56789][0-9]{9}$"
                            value={contactNo1}
                        />

                    </div>
                    {/* </div> */}

                    <div className="search" >
                        <button type="submit" form="mainform1">Enter</button>
                    </div>
                </form>


                <h2 id="heading1" style={{ marginTop: "4rem" }}>Delete User</h2>
                <form onSubmit={handleOnClick2} id="mainform2" style={{ display: "flex" }}>
                    {/* <div className="search">
                        <input
                            type="tel"
                            className="textNavbar"
                            placeholder="Enter Name"
                            onChange={handleNameChange2}
                            required
                            pattern="^[A-Za-z]+$"
                            value={name2}
                        />

                    </div> */}
                    <div className="search">
                        <i className="fa fa-search" />
                        <p style={{ fontSize: "1.5rem", fontWeight: "700" }}>+91</p>
                        <input
                            type="tel"
                            className="textNavbar"
                            placeholder="Enter Mobile Number"
                            onChange={handleMobileChange2}
                            required
                            pattern="^[56789][0-9]{9}$"
                            value={contactNo2}
                        />

                    </div>

                    <div className="search" >
                        <button type="submit" form="mainform2">Enter</button>
                    </div>
                </form>

                <h2 id="heading1" style={{ marginTop: "2rem" }}>Show Details</h2>
                <div className="search" >
                    <button type="submit" onClick={handleOnClick3}>Get Details</button>
                </div>

                {show && (
                    <div className="request-details">
                        <h2 id="heading2">Users</h2>

                        <table className="tablereqstatus">
                            <thead>
                                <tr>
                                    <th>User Name</th>
                                    <th>Phone Number</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Data.map((userInf) => (
                                    <tr key={userInf.phone}>
                                        <td>{userInf.name}</td>
                                        <td>{userInf.phone}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                )}


            </div>
        </>
    );
}