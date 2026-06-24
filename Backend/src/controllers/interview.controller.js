const pdfParse = require("pdf-parse")
const generateInterviewReport = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")


const parsePdfText = async (buffer) => {
    const data = await pdfParse(buffer)
    return data.text || ""
}



/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterviewReportController(req,res){

    const {selfDescription,jobDescription} = req.body

    if (!jobDescription) {
        return res.status(400).json({
            message: "Job description is required."
        })
    }

    if (!selfDescription && !req.file) {
        return res.status(400).json({
            message: "Either resume or self description is required."
        })
    }

    let resumeText = ""

    if(req.file?.buffer){
        resumeText = await parsePdfText(req.file.buffer)
    }

    const interviewReportByAi = await generateInterviewReport({
        resume: resumeText,
        selfDescription,
        jobDescription
    })

    const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        resume: resumeText,
        selfDescription,
        jobDescription,
        ...interviewReportByAi
    })

    res.status(201).json({
        message: "Interview report generated successfully.",
        interviewReport
    })

}


/**
 * @description Controller to get interview report bu interviewId
 */

async function generateInterviewReportbyIdController(req,res){
    const {interviewId} = req.params

    const interviewReport = await interviewReportModel.findOne({_id: interviewId,user: req.user.id})

    if(!interviewReport){
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    })
}

/**
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllinterviewReportsController(req,res) {
    const interviewReports = await interviewReportModel.find({user: req.user.id})
        .sort({createdAt: -1})
        .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGap -preparationplan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}

module.exports = {generateInterviewReportController,generateInterviewReportbyIdController,getAllinterviewReportsController}
