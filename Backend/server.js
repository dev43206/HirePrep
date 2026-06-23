require("dotenv").config()
const app = require("./src/app")
const connecToDB = require("./src/config/database")
// const {resume,selfDescription,jobDescription} = require("./src/services/temp.js")
// const generateInterviewReport = require("./src/services/ai.service.js")

connecToDB()

// generateInterviewReport({resume,selfDescription,jobDescription})
app.listen(3000,()=>{
    console.log("server is running on port 3000")
})


