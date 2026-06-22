const {GoogleGenAI} = require("@google/genai")
const {z} = require("zod")
const {zodToJsonSchema} = require("zod-to-json-schema")

const ai  = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

const fallbackModels = [
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-2.5-pro",
    "gemini-3.5-flash"
]

const retryableStatuses = [429, 500, 502, 503, 504]


const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The behavioral question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGap: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum(["low","medium","high"]).describe("The severity of this skill gap , i.e. how important is this skill for the job and how much it can impact the candidate's chances"),
    })).describe("List  of Skil gaps in the candidate's profile along with their severity"),
    preparationplan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structure, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A day-wise preparation plan for the candidate  to follow in order to prepare for the interview effectively")
    
})

async function generateInterviewReport({resume,selfDescription,jobDescription}){

    const prompt = `Generate an interview report for a candidate with the following details:
                        Resume: ${resume}
                        selfDescription: ${selfDescription}
                        JobDescription: ${jobDescription}
    `

    let lastError

    for (const model of fallbackModels) {
        try {
            const response = await ai.models.generateContent({
                model,
                contents: prompt,
                config:{
                    responseMimeType: "application/json",
                    responseSchema: zodToJsonSchema(interviewReportSchema)
                }
            })

            return JSON.parse(response.text)
        } catch (err) {
            lastError = err

            const status = err?.status || err?.error?.code

            if (!retryableStatuses.includes(status)) {
                throw err
            }

            console.log(`${model} failed with status ${status}, trying next model...`)
        }
    }

    throw lastError
}

module.exports = generateInterviewReport
