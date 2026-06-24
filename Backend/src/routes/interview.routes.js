const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const interviewController = require("../controllers/interview.controller")
const upload = require("../middlewares/file.middleware")

const interviewRouter = express.Router()



/**
 * @route POST /api/interview
 * @description generate new interview report on the basis of user self descriptiion , resume pdf and job desciption
 * @access private
 */

interviewRouter.post("/",authMiddleware.authUser,upload.single("resume"),interviewController.generateInterviewReportController)

/**
 * @route GET  /api/interview/report/:interviewID
 * @description get interview report by interviewID
 * @access private
 */
interviewRouter.get("/report/:interviewId",authMiddleware.authUser,interviewController.generateInterviewReportbyIdController)


/**
 * @route GET  /api/interview/
 * @description get all interview report of logged in user
 * @access private
 */
interviewRouter.get("/",authMiddleware.authUser,interviewController.getAllinterviewReportsController)

module.exports = interviewRouter

