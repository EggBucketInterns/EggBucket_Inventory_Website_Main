const { getAuth, signInWithEmailAndPassword, } = require("firebase/auth")
const admin = require("firebase-admin")
const path = require("path")
const { getFirestore } = require("firebase-admin/firestore")
const serviceAccount = require(path.join(__dirname, "..", "AdminKey.json"))
const { format } = require('date-fns');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "scannerapp-4448f.appspot.com"
})

//Signing in(post)
const Sign_In_Handler = async (req, res) => {
    try {
        const { email, password } = req.body
        const auth = getAuth()
        const sign_in = await signInWithEmailAndPassword(auth, email, password)
        const user = sign_in.user
        const jwt = await user.getIdToken(true)//Getting the jwt
        const expiry = 60 * 60 * 24 * 1000 //1 day
        const cookie = await admin.auth().createSessionCookie(jwt, { expiresIn: expiry })
        if (!cookie) {
            res.status(500).json({ idToken: null, message: "Server error" }).end()
        }
        const options = { maxAge: expiry, httpOnly: true, secure: false };
        res.cookie('session', cookie, options);
        res.status(200).json({ idToken: jwt, message: "Success Logging In" }).end()
    }
    catch (err) {
        if (err.code === "auth/invalid-credential") {
            res.status(404).json({ idToken: null, message: "Invalid Credentials" }).end()
        }
        else {
            res.status(500).json({ idToken: null, message: "Server error" }).end()
        }
        console.log(err)
    }
}
//Logging out(Post)
const Logout_Handler = async (req, res) => {
    try {
        const cookie = req.cookies.session
        const verify = await check_user(cookie)
        if (verify == null) {
            res.clearCookie('session')
            res.status(401).json({ message: "Unauthorized access" }).end()
            return
        }
        await admin.auth().revokeRefreshTokens(verify.uid)
        res.clearCookie("session")
        res.status(200).json({ message: "Successfully logged out" }).end()
    }
    catch (err) {
        res.status(500).json({ message: "Server error" }).end()
    }
}

//To fetch complete user info(Get)
const Get_Complete_User_Info = async (req, res) => {
    try {
        const { name, date } = req.query;
        const cookie = req.cookies.session
        const verify = await check_user(cookie)
        if (verify == null) {
            res.clearCookie('session')
            res.status(401).json({ message: "Unauthorized access" }).end()
            return
        }
        const db = getFirestore();
        const phoneRef = await db.collection("Employees").get()
        var phoneNo = ""
        phoneRef.forEach((file) => {
            if (file.data().name == name) {
                phoneNo = file.id
                return
            }
        })
        if (phoneNo == "") {
            res.status(404).json({ message: `No info found for ${name}` }).end()
            return
        }
        const reference = db.collection(date).doc(phoneNo);
        const resp = await reference.get();
        if (!resp.exists) {
            res.status(404).json({ message: `No info found for ${phoneNo} on ${date}` }).end();
            return;
        }

        const bucket = admin.storage().bucket();
        const path = `Daily_Info/${phoneNo}/${date}/`;
        //Storage query
        const [files] = await bucket.getFiles({ prefix: path });

        if (files.length === 0) {
            const response = {
                data: resp.data(),
                message: "No images found",
                images: []
            };
            res.status(207).send(response).end();
            return;
        }

        const images = [];
        const d = new Date();
        const EOD = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
        for (const file of files) {
            //Getting URL's
            const url = await file.getSignedUrl({
                action: 'read',

                expires: EOD//Expires at end of current day
            });
            images.push(url[0]);
        }

        const response = {
            data: resp.data(),
            images: images,
            message: "data fetched successfully"
        };
        res.status(200).send(response).end();
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message }).end();
    }
};

//To fetch timing info(Get)

const Get_Timing_Info = async (req, res) => {
    try {
        const { date } = req.query;

        const cookie = req.cookies.session
        const verify = await check_user(cookie)
        if (verify == null) {
            res.clearCookie('session')
            res.status(401).json({ message: "Unauthorized access" }).end()
            return
        }
        const db = getFirestore();
        const reference = db.collection(date);
        const resp = await reference.get();

        if (resp.empty) {
            return res.status(404).json({
                message: "No information found",
            }).end();
        }

        const responseObj = [];
        resp.forEach(doc => {
            const data = {
                date: date,
                //put space for name also
                phoneNo: doc.id,

                data: {
                    name: doc.data().name,
                    morning_check_in_time: doc.data().morning_check_in_time,
                    morning_check_out_time: doc.data().morning_check_out_time,
                    evening_check_in_time: doc.data().evening_check_in_time,
                    evening_check_out_time: doc.data().evening_check_out_time
                }

            };
            responseObj.push(data);
        });
        console.log(responseObj)
        res.status(200).json({ message: "search successfull", data: [responseObj] }).end();
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Internal Server Error" }).end()
    }
};

//To fetch stock info(Get)

const Get_Stock_Info = async (req, res) => {
    try {
        const { date } = req.query;
        const cookie = req.cookies.session
        const verify = await check_user(cookie)
        if (verify == null) {
            res.clearCookie('session')
            res.status(401).json({ message: "Unauthorized access" }).end()
            return
        }
        const db = getFirestore()
        const reference = db.collection(date)
        const resp = await reference.get()
        if (resp.empty) {
            res.status(404).json({ message: "No info found" }).end()
            return
        }
        const responseObj = []
        resp.forEach((doc) => {
            const data = {
                date: date,
                phoneNo: doc.id,
                data: {
                    name: doc.data().name,
                    morning_opening_stock: doc.data().morning_opening_stock,
                    morning_closing_stock: doc.data().morning_closing_stock,
                    morning_money_collected: doc.data().morning_money_collected,
                    evening_opening_stock: doc.data().evening_opening_stock,
                    evening_closing_stock: doc.data().evening_closing_stock,
                    evening_money_collected: doc.data().evening_money_collected
                }

            }
            responseObj.push(data)
        })
        res.status(200).send({ message: "search succesfull", data: [responseObj] }).end()
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: "Internal Server Error" }).end()
    }
}


//Verify user for protected path
const Verify_User_Token = async (req, res) => {
    try {
        const cookie = req.cookies.session
        const valid = await check_user(cookie);
        if (!valid) {
            res.clearCookie('session')
            res.status(401).json({ message: "Unauthorized access" }).end();
            return;
        }
        res.status(200).json({ message: "Verified" }).end()
    }
    catch (err) {
        console.log(err)
        res.clearCookie('session')
        res.status(500).json({ mesage: "Server error" }).end()
    }
}

//To verify user
const check_user = async (cookie) => {

    try {
        if (cookie == "") return null
        const verify = await admin.auth().verifySessionCookie(cookie, true)
        return verify
    }
    catch (err) {
        console.log(err)
        return null
    }
};

//7 Day data
const fetch_seven_days = async (req, res) => {
    try {
        console.log("seven days")
        const cookie = req.cookies.session
        const verify = await check_user(cookie)
        if (verify == null) {
            res.clearCookie('session')
            res.status(401).json({ message: "Unauthorized access" }).end()
            return
        }

        const db = getFirestore()
        const collections = await db.listCollections()

        if (collections.length < 8) {
            res.status(400).json({ message: "Not enough data" }).end()
            return
        }

        let count = 7, i = collections.length - 2
        const collectionIds = []
        while (count-- > 0 && i >= 0) {
            collectionIds.push(collections[i]._queryOptions.collectionId)
            --i;
        }

        // Fetch all collections in parallel
        const dataPromises = collectionIds.map(async (collectionId) => {
            const ref = await db.collection(collectionId).get()
            let currDay = []
            ref.forEach((doc) => {
                let currObj = {
                    phoneNo: doc.id,
                    date: collectionId,
                    data: doc.data()
                }
                currDay.push(currObj)
            })
            return currDay
        })

        const respObj = await Promise.all(dataPromises)

        res.status(200).send({ message: "Successfully fetched data", data: respObj }).end()
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Internal server error" }).end()
    }
}
//30 day data
const fetch_thirty_days = async (req, res) => {
    try {
        const cookie = req.cookies.session;
        const verify = await check_user(cookie);

        if (verify == null) {
            res.clearCookie('session');
            res.status(401).json({ message: "Unauthorized access" }).end();
            return;
        }

        const db = getFirestore();
        const collections = await db.listCollections();

        if (collections.length < 10) {
            res.status(400).json({ message: "Not enough data" }).end();
            return;
        }

        let count = 30, i = collections.length - 2;
        const collectionIds = [];
        while (count-- > 0 && i >= 0) {
            collectionIds.push(collections[i]._queryOptions.collectionId);
            --i;
        }

        // Fetch all collections in parallel
        const dataPromises = collectionIds.map(async (collectionId) => {
            const ref = await db.collection(collectionId).get();
            let currDay = [];
            ref.forEach((doc) => {
                let currObj = {
                    phoneNo: doc.id,
                    date: collectionId,
                    data: doc.data()
                };
                currDay.push(currObj);
            });
            return currDay;
        });

        const respObj = await Promise.all(dataPromises);

        res.status(200).send({ message: "Successfully fetched data", data: respObj }).end();
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" }).end();
    }
};

//To create new user
const Create_new_user = async (req, res) => {
    try {
        const { phoneNo, name } = req.body;
        const cookie = req.cookies.session
        const verify = await check_user(cookie)
        if (verify == null) {
            res.clearCookie('session')
            res.status(401).json({ message: "Unauthorized access" }).end()
            return
        }
        const auth = admin.auth()
        var resp = await auth.createUser({
            phoneNumber: phoneNo
        })
        const uid = resp.uid
        if (resp === null) {
            res.status(424).send({ message: "User creation failed" }).end()
            return
        }
        const db = getFirestore()
        const ref = db.collection("Employees").doc(phoneNo)
        resp = await ref.set({
            is_Verified: true,
            name: name,
            uid: uid,
            time_created: Date()
        })
        if (resp === null) {
            res.status(424).send({ message: "User creation failed" }).end()
            return
        }
        res.status(200).send({ message: "User created successfully" }).end()
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ message: "Internal server error" }).end()
    }
}
//To delete user
const Delete_user = async (req, res) => {
    try {
        const { phoneNo } = req.body
        const cookie = req.cookies.session
        const verify = await check_user(cookie)
        if (verify == null) {
            res.clearCookie('session')
            res.status(401).json({ message: "Unauthorized access" }).end()
            return
        }
        const uid = (await admin.auth().getUserByPhoneNumber(phoneNo)).uid
        const delete_auth = await admin.auth().deleteUser(uid)

        const db_ref = getFirestore().collection("Employees").doc(phoneNo)
        const delete_db_ref = await db_ref.delete()

        res.status(200).json({ message: "User deleted" }).end()
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server error" }).end()
    }
}
// to fetch list of all users
const list_all_users = async (req, res) => {
    try {
        const cookie = req.cookies.session
        const verify = await check_user(cookie)
        if (verify == null) {
            res.clearCookie('session')
            res.status(401).json({ message: "Unauthorized access" }).end()
            return
        }
        const db = getFirestore().collection("Employees")
        const resp = await db.get()
        var respObj = []
        resp.forEach((employee) => {
            const currObj = {
                phone: employee.id,                    //RESPOBJ = [{employee_info} , {} ...]
                name: employee.data().name
            }
            respObj.push(currObj)
        })
        res.status(200).send({ message: "Data fetched successfully", data: respObj }).end()
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ message: "Internal server error" }).end()
    }
}
// get eveningstock for spreadsheet
const getOutletData = async () => {
    const db = admin.firestore();
    const DateData = [];
    const collections = await db.listCollections();

    for (const collection of collections) {
        const tempDate = [];
        const snapshot = await collection.get();
        snapshot.forEach(doc => {
            tempDate.push({ name: doc.data().name, eveningStock: doc.data().evening_closing_stock })
            // console.log(tempDate)
        });
        DateData.push({ date: collection.id, data: tempDate });
    }
    DateData.pop();
    return DateData
    // console.log(DateData)
}

//get names of all outlet for spreadsheet
const getAllOutlet = async () => {
    const db = admin.firestore();
    const outletname = [];
    const collectionRef = db.collection("Employees");
    const snapshot = await collectionRef.get();
    snapshot.forEach(doc => {
        outletname.push(doc.data().name)
        // console.log(doc.data().name)
    })
    return outletname
}
const update_user = async (req, res) => {

    try {
        const { phone, newName } = req.body
        const cookie = req.cookies.session
        const verify = await check_user(cookie)
        if (verify == null) {
            res.clearCookie('session')
            res.status(401).json({ message: "Unauthorized access" }).end()
            return
        }
        const db = getFirestore()
        const path = db.collection("Employees").doc(phone)
        await path.update({ name: newName })
        res.status(200).json({ message: "User updated" }).end()
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server error" }).end()
    }
}
module.exports = {
    Sign_In_Handler,
    Get_Complete_User_Info,
    Get_Timing_Info,
    // Verification_handler,
    Get_Stock_Info,
    // Get_User_Documents,
    Verify_User_Token,
    list_all_users,
    Logout_Handler,
    Create_new_user,
    Delete_user,
    fetch_seven_days,
    fetch_thirty_days, 
    getAllOutlet, 
    getOutletData,
     update_user
}





//To verify user in database(Patch)
// const Verification_handler = async (req, res) => {
//     try {
//         const { phoneNo , jwt} = req.body;
//         const valid = await check_user(jwt);
//         if (!valid) {
//             res.status(401).json({ message: "Unauthorized access" }).end();
//             return;
//         }
//         const db = getFirestore();
//         const docRef = db.collection("Employees").doc(phoneNo)

//         const resp = await docRef.update({
//             is_Verified: true
//         });
//         res.status(200).json({ message: "User verified" }).end();
//     }
//     catch (err) {
//         if (err.code === "auth/user-not-found" || err.code === "not-found") {
//             res.status(404).json({ message: "User does not exist" }).end()
//             return;
//         }
//         res.status(500).json({ message: err.mesage }).end()
//         console.log(err)
//     }
// }

//To fetch user docs(Get)
// const Get_User_Documents = async (req, res) => {
//     try {

//         const { phoneNo, jwt } = req.query;

// const valid = await check_user(jwt);
//         if (!valid) {
//             res.status(401).json({ message: "Unauthorized access" }).end();
//             return;
//         }

//         const bucket = admin.storage().bucket();
//         const folderPath = `Images/${phoneNo}/`;
//         const [files] = await bucket.getFiles({ prefix: folderPath });

//         if (files.length === 0) {
//             res.status(404).json({ message: "No documents found" }).end();
//             return;
//         }
//         const d = new Date();
//         const EOD = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
//         const imageArr = [];
//         for (const file of files) {
//             const url = await file.getSignedUrl({
//                 action: 'read',
//                 expires: EOD//Valid only till end of current date
//             });
//             imageArr.push(url[0]);
//         }
//         const db = getFirestore()
//         const docRef = db.collection("Employees").doc(phoneNo)
//         const currDoc = await docRef.get()

//         res.status(200).send({
//             verification : currDoc.data().is_Verified,
//             images: imageArr,
//             message: "Search successful"
//         }).end();
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ message: err.message }).end();
//     }
// };
