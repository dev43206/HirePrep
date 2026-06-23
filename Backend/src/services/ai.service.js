// const {GoogleGenAI} = require("@google/genai")
// const {z} = require("zod")
// const {zodToJsonSchema} = require("zod-to-json-schema")


// const ai  = new GoogleGenAI({
//     apiKey: process.env.GOOGLE_GENAI_API_KEY
// })




// const interviewReportSchema = z.object({
//     matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
//     technicalQuestions: z.array(z.object({
//         question: z.string().describe("The technical question can be asked in the interview"),
//         intention: z.string().describe("The intention of interviewer behind asking this question"),
//         answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
//     })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
//     behavioralQuestions: z.array(z.object({
//         question: z.string().describe("The behavioral question can be asked in the interview"),
//         intention: z.string().describe("The intention of interviewer behind asking this question"),
//         answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
//     })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
//     skillGap: z.array(z.object({
//         skill: z.string().describe("The skill which the candidate is lacking"),
//         severity: z.enum(["low","medium","high"]).describe("The severity of this skill gap , i.e. how important is this skill for the job and how much it can impact the candidate's chances"),
//     })).describe("List  of Skil gaps in the candidate's profile along with their severity"),
//     preparationplan: z.array(z.object({
//         day: z.number().describe("The day number in the preparation plan, starting from 1"),
//         focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structure, system design, mock interviews etc."),
//         tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
//     })).describe("A day-wise preparation plan for the candidate  to follow in order to prepare for the interview effectively")
    
// })

// async function generateInterviewReport({resume,selfDescription,jobDescription}){

//     const prompt = `Generate an interview report for a candidate with the following details:
//                         resume: ${resume}
//                         selfDescription: ${selfDescription}
//                         jobDescription: ${jobDescription}
//     `

    

   
//     const response = await ai.models.generateContent({
//         model : "gemini-3-flash-preview",
//         contents: prompt,
//         config:{
//             responseMimeType: "application/json",
//             responseSchema: zodToJsonSchema(interviewReportSchema)
//         }
//     })

//     // return JSON.parse(response.text)
//     console.log(response.text)
// }   

// module.exports = generateInterviewReport



const { GoogleGenAI, Type } = require("@google/genai");
const { z } = require("zod");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

const interviewReportSchema = z.object({
    matchScore: z.number(),
    technicalQuestions: z.array(
        z.object({
            question: z.string(),
            intention: z.string(),
            answer: z.string()
        })
    ),
    behavioralQuestions: z.array(
        z.object({
            question: z.string(),
            intention: z.string(),
            answer: z.string()
        })
    ),
    skillGap: z.array(
        z.object({
            skill: z.string(),
            severity: z.enum(["low", "medium", "high"])
        })
    ),
    preparationplan: z.array(
        z.object({
            day: z.number(),
            focus: z.string(),
            tasks: z.array(z.string())
        })
    )
});

async function generateInterviewReport({
    resume,
    selfDescription,
    jobDescription
}) {

    const prompt = `
Generate an interview report.

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}

Rules:
- Return ONLY valid JSON.
- Follow the schema exactly.
- matchScore must be between 0 and 100.
- Generate at least 5 technical questions.
- Generate at least 5 behavioral questions.
- Generate a detailed preparation plan of 7 days.
`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",

            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    matchScore: {
                        type: Type.NUMBER
                    },

                    technicalQuestions: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                question: {
                                    type: Type.STRING
                                },
                                intention: {
                                    type: Type.STRING
                                },
                                answer: {
                                    type: Type.STRING
                                }
                            },
                            required: [
                                "question",
                                "intention",
                                "answer"
                            ]
                        }
                    },

                    behavioralQuestions: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                question: {
                                    type: Type.STRING
                                },
                                intention: {
                                    type: Type.STRING
                                },
                                answer: {
                                    type: Type.STRING
                                }
                            },
                            required: [
                                "question",
                                "intention",
                                "answer"
                            ]
                        }
                    },

                    skillGap: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                skill: {
                                    type: Type.STRING
                                },
                                severity: {
                                    type: Type.STRING,
                                    enum: ["low", "medium", "high"]
                                }
                            },
                            required: [
                                "skill",
                                "severity"
                            ]
                        }
                    },

                    preparationplan: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                day: {
                                    type: Type.NUMBER
                                },
                                focus: {
                                    type: Type.STRING
                                },
                                tasks: {
                                    type: Type.ARRAY,
                                    items: {
                                        type: Type.STRING
                                    }
                                }
                            },
                            required: [
                                "day",
                                "focus",
                                "tasks"
                            ]
                        }
                    }
                },

                required: [
                    "matchScore",
                    "technicalQuestions",
                    "behavioralQuestions",
                    "skillGap",
                    "preparationplan"
                ]
            }
        }
    });

    const result = JSON.parse(response.text);

    const validated =
        interviewReportSchema.parse(result);

    return validated;
    // console.log(validated)
}

module.exports = generateInterviewReport;