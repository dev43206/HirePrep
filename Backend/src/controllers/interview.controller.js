const pdfParse = require("pdf-parse")
const generateInterviewReport = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")

async function generateInterviewReportController(req,res){

    const {selfDescription} = req.body
    const jobDescription = req.body.jobDescription || req.body.jobdescription || req.body.jobDesciption

    if(!req.file){
        return res.status(400).json({
            message: "Resume PDF is required"
        })
    }

    if(!jobDescription){
        return res.status(400).json({
            message: "Job description is required"
        })
    }

    const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()

    const interviewReportByAi = await generateInterviewReport({
        resume: resumeContent.text,
        selfDescription,
        jobDescription
    })

    const interviewReport = await interviewReportModel.create({
        ...interviewReportByAi,
        user: req.user.id,
        resume: resumeContent.text,
        selfDescription,
        jobDescription
    })

    res.status(201).json({
        message: "Interview report generated successfully.",
        interviewReport
    })

}


module.exports = {generateInterviewReportController}
