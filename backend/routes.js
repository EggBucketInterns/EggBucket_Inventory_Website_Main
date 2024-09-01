const express = require("express")
const router = express.Router()
const path = require("path")
const { Sign_In_Handler,
    Get_Complete_User_Info,
    Verification_handler,
    Get_Timing_Info,
    Get_Stock_Info,
    // Get_User_Documents,
    Verify_User_Token,
    Logout_Handler,
    Create_new_user,
    Delete_user,
    fetch_seven_days,
    fetch_thirty_days,
    list_all_users
} = require(path.join(__dirname, ".", "Controllers", "Queries.js"))
const { SetupSheet } = require(path.join(__dirname, ".", "Controllers", "SpreadSheet.js"))


router.route("/signin").post(Sign_In_Handler)//For handling Sign-in
router.route("/userCompleteInfo").get(Get_Complete_User_Info)//Fetching docs of unverified users
router.route("/timingInfo").get(Get_Timing_Info)//To get check in check out times
router.route("/stockInfo").get(Get_Stock_Info)//To get stock and money info
router.route("/prevSevenDays").get(fetch_seven_days)// Fetch previous 7 days data
router.route("/prevMonth").get(fetch_thirty_days)// Fetch previous month data
router.route("/logout").post(Logout_Handler)//Logging out
router.route("/createUser").post(Create_new_user)//To create new user
router.route("/deleteUser").delete(Delete_user)//To delete user
router.route("/verifyToken").get(Verify_User_Token)//To verify user
router.route("/fetchUsers").get(list_all_users)//To fetch all active users
router.route("/refreshSheet").post(SetupSheet)//To refresh excel sheet
module.exports = router

// router.route("/userDocuments").get(Get_User_Documents)//To fetch user documents
// router.route("/verifyUser").patch(Verification_handler)//