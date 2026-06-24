const mongoose = require('mongoose');



/**
 * job description schema : String
 * resume text : String
 * self description : String
 * 
 * MatchScore : Number
 * 
 * Technical questions : aray format -> 
 *                  [{
 *                      question : "",
 *                      intention : "",
 *                      answer : ""
 *                  }]
 * Behavioral questions : aray format ->
 *                  [{
 *                      question : "",
 *                      intention : "",
 *                      answer : ""
 *                  }]
 * Skills gaps : aray format -> 
 *                  [{
 *                      skill : "",
 *                      severity : "",
 *                          {type : string,
 *                           enum : ["low","medium","high"] }
 *                  }]
 * preparation plan : aray format -> 
 *                  [{
 *                      day : Number,
 *                      focus : String,
 *                      task : [String]
 *                  }]
 */


const technicalQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true,"Technical questions is required"]
    },
    intention:{
        type: String,
        required: [true,"Intention is required"]
    },
    answer:{
        type: String,
        required: [true,"Answer is required"]
    }
},{
    _id : false
})

const behavioralQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true,"Behavioral questions is required"]
    },
    intention:{
        type: String,
        required: [true,"Intention is required"]
    },
    answer:{
        type: String,
        required: [true,"Answer is required"]
    }
},{
    _id : false
})

const skillGapSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: [true,"Skill is required"]
    },
    severity:{
        type: String,
        enum: ["low","medium","high"],
        required: [true,"Severity is required"]
    }
},{
    _id : false
})

const preparationplanSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: [true,"Day is required"]
    },
    focus:{
        type: String,
        required: [true,"Focus is required"]
    },
    tasks:[{
        type: String,
        required: [true,"Task is required"]
    }]
},{
    _id : false
})

const interviewReportSchema = new mongoose.Schema({
    jobDescription:{
        type: String,
        required: [true, "Job description is required"]
    },
    resume: {
        type: String,
    },
    selfDescription:{
        type: String,
    },
    matchScore: {
        type: Number,
        min : 0,
        max : 100, 
    },
    technicalQuestions: [technicalQuestionSchema],
    behavioralQuestions: [behavioralQuestionSchema],
    skillGap: [skillGapSchema],
    preparationplan: [preparationplanSchema],
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    title: {
        type: String,
        required: [true, "Job title is required"]
    }
})


const interviewReportModel = mongoose.model("InterviewReport",interviewReportSchema)

module.exports = interviewReportModel;