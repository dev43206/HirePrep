
const { GoogleGenAI, Type } = require("@google/genai");
const { z } = require("zod");
const puppeteer = require("puppeteer")

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
    ),
    title: z.string()
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
- Generate the title of the job for which the interview report is generated
`;

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
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
                    },
                    title: {
                        type: Type.STRING
                    }
                },

                

                required: [
                    "matchScore",
                    "technicalQuestions",
                    "behavioralQuestions",
                    "skillGap",
                    "preparationplan",
                    "title"
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